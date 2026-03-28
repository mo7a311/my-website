const MOCK_ATTRACTIONS = [
  { 
    id: '1', name: 'Pyramids of Giza', category: 'Historical', 
    description: 'One of the wonders of the ancient world. The Great Pyramid is the oldest and largest of the pyramids.', 
    history: 'Built during the time of the Old Kingdom, the Pyramids of Giza served as monumental tombs for Pharaohs Khufu, Khafre, and Menkaure around 2580–2560 BC.',
    imageUrl: '/images/pyramids.jpg', 
    gallery: [
      '/images/pyramids.jpg',
      '/images/pyramids.jpg'
    ],
    rating: 4.9, lat: 29.9792, lng: 31.1342, bestTime: 'Morning', duration: '3-4 hours', price: '$20', hours: '8 AM - 5 PM',
    travelTips: ['Wear comfortable walking shoes.', 'Bring plenty of water and sunscreen.', 'Hire a guide for a better experience.'],
    reviews: [ { user: 'John Doe', rating: 5, comment: 'Absolutely breathtaking experience.' }, { user: 'Jane Smith', rating: 4, comment: 'Amazing, but very crowded.' } ]
  },
  { 
    id: '2', name: 'The Egyptian Museum', category: 'Museum', 
    description: 'Home to an extensive collection of ancient Egyptian antiquities, including the treasures of Tutankhamun.', 
    history: 'Established in 1902 in Tahrir Square, Cairo. It houses over 120,000 items and represents the largest collection of Pharaonic antiquities in the world.',
    imageUrl: '/museum-exterior.png', 
    gallery: [
      '/museum-interior.png',
      '/museum-exterior.png'
    ],
    rating: 4.7, lat: 30.0478, lng: 31.2336, bestTime: 'Morning or Afternoon', duration: '2-3 hours', price: '$15', hours: '9 AM - 5 PM',
    travelTips: ['Photography requires a special ticket.', 'The mummy room is highly recommended.', 'Allow at least half a day.'],
    reviews: [ { user: 'Alice', rating: 5, comment: 'So much history in one place!' } ]
  },
  { 
    id: '3', name: 'Karnak Temple', category: 'Historical', 
    description: 'A vast mix of decayed temples, chapels, and other buildings near Luxor.', 
    history: 'Construction began during the Middle Kingdom and continued into the Ptolemaic period. The precinct of Amun-Re is the main center of worship.',
    imageUrl: '/images/karnak.jpg', 
    gallery: [
      '/images/karnak.jpg',
      '/images/karnak.jpg'
    ],
    rating: 4.8, lat: 25.7188, lng: 32.6573, bestTime: 'Late Afternoon', duration: '2-3 hours', price: '$12', hours: '6 AM - 5:30 PM',
    travelTips: ['Stay for the Sound and Light show in the evening.', 'It is an open area, so wear hats.'],
    reviews: [ { user: 'Mark', rating: 5, comment: 'The columns are massive. Incredible architecture.' } ]
  }
];

// Utility: Haversine distance in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

export async function fetchAttractions() {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_ATTRACTIONS), 500));
}

export async function fetchAttractionById(id) {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_ATTRACTIONS.find(a => a.id === id)), 300));
}

export async function fetchNearbyAttractions(userLat, userLng) {
  return new Promise(resolve => {
    setTimeout(() => {
      let results = [...MOCK_ATTRACTIONS];
      if (userLat != null && userLng != null) {
        results = results.map(a => {
          const distance = getDistanceFromLatLonInKm(userLat, userLng, a.lat, a.lng);
          return { ...a, distance: parseFloat(distance.toFixed(1)) };
        }).sort((a, b) => a.distance - b.distance);
      }
      resolve(results);
    }, 500);
  });
}

// Authentication API calls
const API_URL = 'http://localhost:5000/api';

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Login failed');
  }
  return response.json();
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Registration failed');
  }
  return response.json();
}

export async function fetchNearbyRecommendations(lat, lng, radius = 5000) {
  try {
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/recommendations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {
      headers
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function fetchAiRecommendations(category) {
  try {
    const response = await fetch(`${API_URL}/recommendations/ai?category=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch AI recommendations');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function getUserPreferences() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not logged in');
  
  const response = await fetch(`${API_URL}/users/preferences`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch preferences');
  return response.json();
}

export async function updateUserPreferences(preferences) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not logged in');
  
  const response = await fetch(`${API_URL}/users/preferences`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(preferences)
  });
  if (!response.ok) throw new Error('Failed to update preferences');
  return response.json();
}

// Bookmark API calls
export async function fetchBookmarks() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  try {
    const response = await fetch(`${API_URL}/bookmarks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    return [];
  }
}

export async function addBookmark(place) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not logged in');
  const response = await fetch(`${API_URL}/bookmarks`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      placeId: String(place.id),
      name: place.name,
      type: place.type,
      lat: place.lat,
      lng: place.lng,
      address: place.address,
      imageUrl: place.imageUrl
    })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to add bookmark');
  }
  return response.json();
}

export async function removeBookmark(placeId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not logged in');
  const response = await fetch(`${API_URL}/bookmarks/${placeId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to remove bookmark');
  }
  return response.json();
}

export async function fetchMyBookings() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  try {
    const response = await fetch(`${API_URL}/bookings/my-bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}
