const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RecommendationCache = require('../models/RecommendationCache');

// Haversine distance formula (returns distance in meters)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const toRad = angle => angle * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const getNearbyRecommendations = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let radius = req.query.radius || 5000;

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: 'Valid latitude and longitude numbers are required.' });
    }
    
    radius = Number(radius);
    if (isNaN(radius) || radius < 500 || radius > 50000) {
      radius = 5000; // default safeguard
    }

    // Check if user is authenticated to fetch their preferences
    const authHeader = req.headers.authorization;
    let userPrefs = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.preferences) {
          userPrefs = user.preferences;
          if (userPrefs.maxDistance) radius = userPrefs.maxDistance;
        }
      } catch (err) {
        console.log('User not authenticated or token invalid. Proceeding without preferences.');
      }
    }

    // 1. Build cacheKey based on rounded coordinates (approx 1.1km grid precision), radius, and interests
    const latGrid = parseFloat(lat).toFixed(2);
    const lngGrid = parseFloat(lng).toFixed(2);
    const cacheRadius = Math.ceil(radius / 1000) * 1000;
    const cacheInterests = userPrefs && userPrefs.interests && userPrefs.interests.length > 0 
      ? userPrefs.interests.sort().join(',') 
      : 'all';
    
    const cacheKey = `${latGrid}:${lngGrid}:${cacheRadius}:${cacheInterests}`;

    // 2. Check if cache exists
    const cachedEntry = await RecommendationCache.findOne({ cacheKey });
    
    let places = [];
    
    if (cachedEntry) {
      // Re-map places to update distance and score precisely to the current user's exact lat/lng
      places = cachedEntry.data.map(p => {
        const distance = calculateDistance(parseFloat(lat), parseFloat(lng), p.lat, p.lng);
        p.distance = distance;

        let score = 0;
        let distScore = 50 * (1 - (distance / radius));
        if (distScore < 0) distScore = 0;
        score += distScore;

        let ratingScore = (p.rating / 5) * 30;
        score += ratingScore;

        let categoryScore = 0;
        if (userPrefs && userPrefs.interests && userPrefs.interests.length > 0) {
          if (userPrefs.interests.includes(p.type)) categoryScore = 20;
        } else {
          categoryScore = 15;
        }
        score += categoryScore;

        p.score = Math.round(score);
        return p;
      });
      places.sort((a, b) => b.score - a.score);
      
      return res.status(200).json({
        success: true,
        count: places.length,
        cached: true,
        data: places
      });
    }

    let queryNodes = '';
    
    // Dynamically build the Overpass filter based on preferences
    if (userPrefs && userPrefs.interests && userPrefs.interests.length > 0) {
      if (userPrefs.interests.includes('Tourism')) {
        queryNodes += `node["tourism"~"museum|theme_park|zoo|aquarium|attraction|viewpoint"](around:${radius},${lat},${lng});\n`;
      }
      if (userPrefs.interests.includes('Historic')) {
        queryNodes += `node["historic"~"archaeological_site|monument|ruins|castle"](around:${radius},${lat},${lng});\n`;
      }
      if (userPrefs.interests.includes('Leisure / Sport')) {
        queryNodes += `node["leisure"~"sports_centre|water_park|stadium|escape_game|bowling_alley"](around:${radius},${lat},${lng});\n`;
      }
      if (userPrefs.interests.includes('Entertainment')) {
        queryNodes += `node["amenity"~"cinema|theatre|arts_centre"](around:${radius},${lat},${lng});\n`;
      }
    } 
    
    // If no interests selected or user is guest, fallback to all activities
    if (!queryNodes) {
      queryNodes = `
        node["tourism"~"museum|theme_park|zoo|aquarium|attraction|viewpoint"](around:${radius},${lat},${lng});
        node["historic"~"archaeological_site|monument|ruins|castle"](around:${radius},${lat},${lng});
        node["leisure"~"sports_centre|water_park|stadium|escape_game|bowling_alley"](around:${radius},${lat},${lng});
        node["amenity"~"cinema|theatre|arts_centre"](around:${radius},${lat},${lng});
      `;
    }

    const overpassQuery = `
      [out:json][timeout:25];
      (
        ${queryNodes}
      );
      out tags qt 50;
    `;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    const response = await fetch(overpassUrl);
    if (!response.ok) throw new Error(`Overpass API responded with status: ${response.status}`);
    const data = await response.json();

    // Map and filter raw OpenStreetMap data into a cleaner structure
    places = data.elements
      .filter(el => el.tags && el.tags.name)
      .map(el => {
        const rating = el.tags.rating ? parseFloat(el.tags.rating) : (Math.random() * 2 + 3).toFixed(1);
        
        let type = 'Activity';
        if (el.tags.tourism) type = 'Tourism';
        if (el.tags.leisure) type = 'Leisure / Sport';
        if (el.tags.historic) type = 'Historic';
        if (el.tags.amenity) type = 'Entertainment';

        return {
          id: el.id,
          name: el.tags.name,
          type: type,
          lat: el.lat,
          lng: el.lon,
          rating: rating,
          address: el.tags['addr:street'] || el.tags['addr:city'] || 'Location unknown',
          website: el.tags.website || el.tags.wikipedia || null,
          phone: el.tags.phone || null,
          opening_hours: el.tags.opening_hours || null
        };
      });

    // Score and Sort the Places dynamically
    places = places.map(p => {
      // 1. Calculate precise distance
      const distance = calculateDistance(parseFloat(lat), parseFloat(lng), p.lat, p.lng);
      p.distance = distance;

      // 2. Base Scoring System (Max 100 points)
      let score = 0;

      // A. Distance Score (Max 50 points) - Closer is better
      let distScore = 50 * (1 - (distance / radius));
      if (distScore < 0) distScore = 0;
      score += distScore;

      // B. Rating Score (Max 30 points)
      let ratingScore = (p.rating / 5) * 30;
      score += ratingScore;

      // C. Category Match Score (Max 20 points)
      let categoryScore = 0;
      if (userPrefs && userPrefs.interests && userPrefs.interests.length > 0) {
        if (userPrefs.interests.includes(p.type)) {
          categoryScore = 20;
        }
      // If user selected Tourism, it maps
      } else {
        categoryScore = 15; // default baseline if no preferences are explicitly searched
      }
      score += categoryScore;

      p.score = Math.round(score);
      return p;
    });

    // 3. Sort by Intelligent Score
    places.sort((a, b) => b.score - a.score);
    places = places.slice(0, 15); // Limit to top 15 highest recommended results

    // Fetch real images from Wikipedia for each place
    const getWikiImage = async (query) => {
      try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json`;
        const res = await fetch(url, { headers: { 'User-Agent': 'EgyptTouristBot/1.0' } });
        const j = await res.json();
        const pages = j.query?.pages;
        if (pages) {
          for (let k of Object.keys(pages)) {
            if (pages[k] && pages[k].thumbnail) return pages[k].thumbnail.source;
          }
        }
      } catch (e) {
        return null; // Ignore errors, return null
      }
      return null;
    };

    places = await Promise.all(places.map(async (p) => {
      const imageUrl = await getWikiImage(p.name + " Egypt");
      return { ...p, imageUrl };
    }));

    // Cache the fully populated 15 places for 24h
    await RecommendationCache.create({ cacheKey, data: places });

    res.status(200).json({
      success: true,
      count: places.length,
      cached: false,
      data: places
    });
  } catch (error) {
    console.error('Error fetching nearby recommendations:', error.message);
    res.status(500).json({ message: 'Failed to fetch recommendations', error: error.message });
  }
};

module.exports = {
  getNearbyRecommendations
};
