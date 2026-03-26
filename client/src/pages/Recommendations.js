import { fetchNearbyRecommendations, fetchBookmarks, addBookmark, removeBookmark } from '../api.js';

export function renderRecommendations() {
  return `
    <div class="explore-page animate-fade-in" style="min-height: 80vh; padding: 2rem;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Places Near Me</h2>
        <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto;">
          Discover highly-rated activities, historic landmarks, and dining options right around your location.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap;">
          <a href="#preferences" class="btn" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; font-size: 1.1rem; border-radius: 30px; background: rgba(255,255,255,0.1); color: var(--text-main); border: 1px solid rgba(255,255,255,0.2); cursor: pointer; text-decoration: none; transition: background 0.2s;">
            ⚙️ Edit Preferences
          </a>
          
          <button id="find-near-me-btn" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; font-size: 1.1rem; border-radius: 30px; background: linear-gradient(135deg, var(--primary) 0%, #a47326 100%); color: white; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(201,147,59,0.3);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Explore Nearby Places
          </button>
        </div>
      </div>
      
      <div id="view-toggle-container" style="display: none; justify-content: center; gap: 1rem; margin-bottom: 2rem;">
        <button id="btn-list-view" class="btn active-view" style="padding: 0.5rem 1.5rem; border-radius: 20px; border: 1px solid var(--primary); background: var(--primary); color: white; cursor: pointer; transition: 0.2s;">List View</button>
        <button id="btn-map-view" class="btn" style="padding: 0.5rem 1.5rem; border-radius: 20px; border: 1px solid var(--primary); background: transparent; color: var(--text-main); cursor: pointer; transition: 0.2s;">Map View</button>
      </div>

      <div id="recommendations-container" class="cards-grid" style="display: none;">
         <!-- Results injected here -->
      </div>
      
      <div id="recommendations-map-container" style="display: none; height: 600px; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
         <div id="map" style="height: 100%; width: 100%; z-index: 1;"></div>
      </div>
      
      <div id="loading-spinner" style="display: none; text-align: center; padding: 4rem 0;">
        <div style="display: inline-block; width: 50px; height: 50px; border: 3px solid rgba(201,147,59,0.3); border-radius: 50%; border-top-color: var(--primary); animation: spin 1s ease-in-out infinite;"></div>
        <p style="margin-top: 1rem; color: var(--text-muted);">Finding the best spots around you...</p>
      </div>
      
      <div id="error-message" style="display: none; text-align: center; padding: 2rem; color: #ff6b6b; background: rgba(255,107,107,0.1); border-radius: 8px; margin-top: 2rem;">
        <!-- Error text injected here -->
      </div>
    </div>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
}

export function loadRecommendationsData() {
  const btn = document.getElementById('find-near-me-btn');
  const container = document.getElementById('recommendations-container');
  const spinner = document.getElementById('loading-spinner');
  const errorMsg = document.getElementById('error-message');
  
  const toggleContainer = document.getElementById('view-toggle-container');
  const btnListView = document.getElementById('btn-list-view');
  const btnMapView = document.getElementById('btn-map-view');
  const mapContainer = document.getElementById('recommendations-map-container');
  
  let mapInstance = null;

  if (!btn) return;

  btn.addEventListener('click', () => {
    // Hide previous UI states
    errorMsg.style.display = 'none';
    container.style.display = 'none';
    mapContainer.style.display = 'none';
    toggleContainer.style.display = 'none';
    spinner.style.display = 'block';
    
    // Check if Geolocation is supported
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          const places = await fetchNearbyRecommendations(lat, lng, 5000);
          const savedBookmarks = await fetchBookmarks();
          
          spinner.style.display = 'none';
          
          if (places.length === 0) {
            showError('We couldn\'t find any major attractions or restaurants near you.');
            return;
          }

          renderPlaces(places, lat, lng, savedBookmarks);
        } catch (error) {
          showError('Failed to load nearby places. Please try again later.');
        }
      },
      (error) => {
        spinner.style.display = 'none';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            showError("Location access denied. Please allow location access to use this feature.");
            break;
          case error.POSITION_UNAVAILABLE:
            showError("Location information is unavailable right now.");
            break;
          case error.TIMEOUT:
            showError("The request to get user location timed out.");
            break;
          default:
            showError("An unknown error occurred while getting location.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

  function showError(msg) {
    spinner.style.display = 'none';
    errorMsg.style.display = 'block';
    errorMsg.textContent = msg;
  }

  function renderPlaces(places, userLat, userLng, savedBookmarks = []) {
    toggleContainer.style.display = 'flex';
    container.style.display = 'grid';
    mapContainer.style.display = 'none';
    
    // 1. Render List View
    container.innerHTML = places.map((p, index) => {
      const isSaved = savedBookmarks.some(b => b.placeId === String(p.id));
      const heartIcon = isSaved ? '❤️' : '🤍';
      
      let fallbackImg = `https://loremflickr.com/400/300/activity,leisure/all?lock=${p.id}`;
      if(p.type === 'Entertainment') fallbackImg = `https://loremflickr.com/400/300/cinema,theatre/all?lock=${p.id}`;
      if(p.type === 'Historic') fallbackImg = `https://loremflickr.com/400/300/ancient,monument/all?lock=${p.id}`;
      if(p.type === 'Tourism') fallbackImg = `https://loremflickr.com/400/300/landmark,tourism/all?lock=${p.id}`;
      
      let finalImg = p.imageUrl || fallbackImg;
      let scoreBadge = p.score ? `<div style="position: absolute; top: 10px; right: 10px; background: #a47326; color: white; padding: 4px 8px; border-radius: 8px; font-weight: bold; font-size: 0.9rem; z-index: 2; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🏆 Score: ${p.score}/100</div>` : '';

      return `
        <div class="card" style="position: relative; text-decoration: none; color: inherit; cursor: default;">
          ${scoreBadge}
          <button class="bookmark-btn" data-id="${p.id}" data-idx="${index}" title="Save Place" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; font-size: 1.2rem; transition: transform 0.2s;">
            ${heartIcon}
          </button>
          <img src="${finalImg}" alt="${p.name}" class="card-img" style="object-fit:cover; height: 200px;" loading="lazy" />
          <div class="card-content">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <h3 class="card-title" style="margin-bottom: 0; font-size: 1.2rem;">${index + 1}. ${p.name}</h3>
              <span style="color: var(--primary); font-weight: bold; background: rgba(201,147,59,0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.9rem;">⭐ ${p.rating}</span>
            </div>
            
            <span style="display: inline-block; background: rgba(255,255,255,0.1); color: var(--text-main); font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; margin-bottom: 1rem;">
              ${p.type}
            </span>
            
            <div style="font-size: 0.9rem; color: var(--text-muted); display:flex; flex-direction: column; gap: 0.4rem;">
              <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                📍 <span>${p.address} | ~${p.distance || '?'} meters away</span>
              </div>
              ${p.opening_hours ? `<div style="display: flex; gap: 0.5rem; align-items: flex-start;">🕒 <span>${p.opening_hours}</span></div>` : ''}
              ${p.website ? `<div style="display: flex; gap: 0.5rem; align-items: flex-start;">🌐 <a href="${p.website}" target="_blank" style="color:var(--primary); text-decoration:none;">Website</a></div>` : ''}
            </div>
            
            <a href="https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${p.lat},${p.lng}&travelmode=driving" target="_blank" 
               style="display: block; text-align: center; margin-top: 1.5rem; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--primary); font-weight: 500; text-decoration: none; transition: background 0.2s;">
              Get Real-Life Directions
            </a>
          </div>
        </div>
      `;
    }).join('');
    
    // Attach bookmark events
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const isLoggedIn = localStorage.getItem('token') !== null;
        if (!isLoggedIn) {
          alert('Please login to save places.');
          return;
        }
        
        const placeId = e.currentTarget.dataset.id;
        const idx = e.currentTarget.dataset.idx;
        const placeObj = places[idx];
        const isCurrentlySaved = e.currentTarget.innerText.trim() === '❤️';
        
        try {
          e.currentTarget.style.transform = 'scale(0.8)';
          if (isCurrentlySaved) {
            await removeBookmark(placeId);
            e.currentTarget.innerText = '🤍';
          } else {
            await addBookmark(placeObj);
            e.currentTarget.innerText = '❤️';
          }
        } catch (err) {
          console.error(err);
          alert('Failed to update bookmark');
        } finally {
          e.currentTarget.style.transform = 'scale(1)';
        }
      });
    });

    // 2. Render Map View (Safely)
    try {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
      
      // Forcefully recreate the DOM element to guarantee a clean slate for Leaflet
      mapContainer.innerHTML = '<div id="map" style="height: 100%; width: 100%; z-index: 1;"></div>';
      
      mapInstance = L.map('map').setView([userLat, userLng], 14);
      
      // Using a beautiful dark map tile layer from CartoDB
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(mapInstance);
      
      // User Location Marker
      const userIcon = L.divIcon({ className: 'custom-user-marker', html: '📍', iconSize: [30, 30] });
      L.marker([userLat, userLng], { icon: userIcon }).addTo(mapInstance)
        .bindPopup('<b style="color: black;">You are here</b>')
        .openPopup();
        
      // Place Markers
      places.forEach((p, index) => {
        if (!p.lat || !p.lng) return; // safety check
        const placeIcon = L.divIcon({ className: 'custom-place-marker', html: '🔴', iconSize: [20, 20] });
        const marker = L.marker([p.lat, p.lng], { icon: placeIcon }).addTo(mapInstance);
        
        marker.bindPopup(`
          <div style="color: #333; font-family: sans-serif; min-width: 200px;">
            <h4 style="margin: 0 0 5px 0; font-size: 1.1rem; color: #a47326;">${index + 1}. ${p.name}</h4>
            <p style="margin: 0 0 5px 0; font-size: 0.9rem;"><strong>Engine Score:</strong> ${p.score || 0}/100</p>
            <span style="display:inline-block; font-size:0.8rem; background:#eee; padding:2px 6px; border-radius:4px; margin-bottom:10px;">${p.type}</span><br>
            <span style="display:inline-block; font-size:0.8rem; color:#666; margin-bottom:10px;">~${p.distance || '?'}m away</span>
            <br/>
            <a href="https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${p.lat},${p.lng}&travelmode=driving" target="_blank" style="display:inline-block; padding: 5px 10px; background: #a47326; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Directions</a>
          </div>
        `);
      });
    } catch (e) {
      console.error("Leaflet Map failed to initialize:", e);
      mapContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Failed to load the map interface.</div>';
    }
    
    // 3. Setup Toggle Events
    btnListView.onclick = () => {
      btnListView.style.background = 'var(--primary)';
      btnListView.style.color = 'white';
      btnMapView.style.background = 'transparent';
      btnMapView.style.color = 'var(--text-main)';
      container.style.display = 'grid';
      mapContainer.style.display = 'none';
    };
    
    btnMapView.onclick = () => {
      btnMapView.style.background = 'var(--primary)';
      btnMapView.style.color = 'white';
      btnListView.style.background = 'transparent';
      btnListView.style.color = 'var(--text-main)';
      container.style.display = 'none';
      mapContainer.style.display = 'block';
      setTimeout(() => mapInstance.invalidateSize(), 150); // crucial for leaflet resize internally
    };
  }
}
