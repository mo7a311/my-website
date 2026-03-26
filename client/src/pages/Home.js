import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchNearbyAttractions } from '../api.js';

export function renderHome() {
  const destinations = [
    {
      id: 'cairo',
      name: 'Cairo',
      image: '/images/pyramids.jpg',
      description: 'The vibrant capital and gateway to the Pyramids.',
      rating: 4.8,
      location: 'Egypt',
      cost: '$400',
      bestTime: 'Oct-Apr',
      tags: ['History', 'Culture']
    },
    {
      id: 'luxor',
      name: 'Luxor',
      image: '/images/luxor.png',
      description: "The world's greatest open-air museum.",
      rating: 4.9,
      location: 'Upper Egypt',
      cost: '$350',
      bestTime: 'Oct-Apr',
      tags: ['History']
    },
    {
      id: 'aswan',
      name: 'Aswan',
      image: '/images/aswan.png',
      description: 'A serene destination along the majestic Nile.',
      rating: 4.7,
      location: 'South Egypt',
      cost: '$300',
      bestTime: 'Oct-Apr',
      tags: ['Culture', 'Nature']
    },
    {
      id: 'alexandria',
      name: 'Alexandria',
      image: '/images/alexandria.png',
      description: 'The Pearl of the Mediterranean.',
      rating: 4.6,
      location: 'North Coast',
      cost: '$250',
      bestTime: 'May-Sep',
      tags: ['Beaches', 'History']
    },
    {
      id: 'sharm',
      name: 'Sharm El Sheikh',
      image: '/images/sharm.png',
      description: 'World-class diving and Red Sea beaches.',
      rating: 4.8,
      location: 'Sinai Peninsula',
      cost: '$500',
      bestTime: 'Mar-Nov',
      tags: ['Diving', 'Beaches']
    }
  ];

  const destCardsHTML = destinations.map(dest => `
    <div class="group relative rounded-2xl overflow-hidden h-96 shadow-lg cursor-pointer transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--primary)]/30">
      <img src="${dest.image}" alt="${dest.name}" loading="lazy" class="absolute w-full h-full object-cover transition duration-700 ease-in-out group-hover:scale-110" />
      
      <!-- Tags Top -->
      <div class="absolute top-4 left-4 flex gap-2 z-10">
        ${dest.tags.map(tag => `<span class="bg-black/50 backdrop-blur-[4px] text-white text-xs px-3 py-1.5 rounded-full border border-white/20 tracking-wider uppercase">${tag}</span>`).join('')}
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>

      <!-- Content Summary -->
      <div class="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 transform group-hover:-translate-y-36 z-10 flex flex-col justify-end h-1/2">
        <h3 class="text-3xl font-extrabold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">${dest.name}</h3>
        <p class="text-[0.95rem] text-slate-200 line-clamp-2">${dest.description}</p>
      </div>

      <!-- Hidden Reveal Information (Glassmorphism) -->
      <div class="absolute bottom-0 left-0 right-0 p-5 bg-[#1e293b]/80 backdrop-blur-md border-t border-white/10 transform translate-y-full transition-all duration-500 group-hover:translate-y-0 z-20 flex flex-col gap-3">
        <div class="flex justify-between text-white text-sm font-medium">
          <span class="flex items-center gap-1"><span class="text-yellow-400">⭐</span> ${dest.rating}</span>
          <span class="flex items-center gap-1 text-slate-300"><span>📍</span> ${dest.location}</span>
        </div>
        <div class="flex justify-between text-white text-sm font-medium border-b border-white/10 pb-3">
          <span class="flex items-center gap-1 text-slate-300"><span>💰</span> ${dest.cost} avg</span>
          <span class="flex items-center gap-1 text-slate-300"><span>🕒</span> ${dest.bestTime}</span>
        </div>
        <a href="#destination/${dest.id}" class="mt-1 w-full text-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2.5 rounded-lg text-sm font-bold tracking-wide transition duration-300 shadow-lg hover:shadow-[var(--primary)]/50">
          Explore More
        </a>
      </div>
    </div>
  `).join('');

  return `
    <div class="home-page animate-fade-in">
      
      <!-- Popular Destinations Section -->
      <div class="section-title" style="margin-top: 2rem;">
        <h2>Popular Destinations in Egypt</h2>
        <p class="text-muted">Explore the majestic cities steeped in history.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12 px-4 max-w-7xl mx-auto">
        ${destCardsHTML}
      </div>

      <!-- Recommended Section -->
      <div class="section-title" style="margin-top: 4rem;">
        <h2>Recommended For You</h2>
        <p class="text-muted">Discover top attractions based on your location.</p>
      </div>
      
      <div class="filters-container" id="category-filters">
        <button class="filter-btn active" data-filter="All">All Attractions</button>
        <button class="filter-btn" data-filter="Historical">Historical Sites</button>
        <button class="filter-btn" data-filter="Museum">Museums</button>
        <button class="filter-btn" data-filter="Religious">Religious Sites</button>
        <button class="filter-btn" data-filter="Beaches">Beaches</button>
        <button class="filter-btn" data-filter="Desert">Desert Adventures</button>
        <button class="filter-btn" data-filter="Food">Food & Markets</button>
      </div>

      <div class="glass-effect" id="home-map-container" style="width: 100%; height: 400px; border-radius: 16px; margin-bottom: 2rem; z-index: 1;"></div>

      <div class="cards-grid" id="recommendations-container" style="margin-bottom: 4rem;">
        <!-- JS will populate nearby attractions here -->
        <p style="text-align:center; width: 100%;">Click "Find Nearby Places" in the banner to see suggestions.</p>
      </div>

      <!-- Unique Experiences Section -->
      <div class="section-title">
        <h2>Unique Egyptian Experiences</h2>
        <p class="text-muted">Create unforgettable memories with curated tours.</p>
      </div>
      <div class="experiences-grid">
        <div class="exp-card">
          <img src="/images/safari.jpg" alt="Desert Safari">
          <div class="exp-content">
            <h4>Desert Safari</h4>
            <p>Thrilling 4x4 rides and Bedouin camps.</p>
          </div>
        </div>
        <div class="exp-card">
          <img src="/images/cruise.jpg" alt="Nile Cruise">
          <div class="exp-content">
            <h4>Nile River Cruise</h4>
            <p>Sail through history on a luxury cruise.</p>
          </div>
        </div>
        <div class="exp-card">
          <img src="/images/luxor.png" alt="Temples Tour">
          <div class="exp-content">
            <h4>Ancient Temples Tour</h4>
            <p>Private guided tours of Luxor and Karnak.</p>
          </div>
        </div>
        <div class="exp-card">
          <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80" alt="Diving">
          <div class="exp-content">
            <h4>Red Sea Diving</h4>
            <p>Explore vibrant coral reefs in the Red Sea.</p>
          </div>
        </div>
      </div>

      <!-- Testimonials -->
      <div class="section-title" style="margin-top: 4rem; margin-bottom: 2rem;">
        <h2>Tourist Testimonials</h2>
        <p class="text-muted">See what fellow travelers are saying.</p>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="review">"Visiting the pyramids was the most incredible experience of my life. The guide was exceptionally knowledgeable."</p>
          <div class="author">
            <strong>Sarah M.</strong>
            <span>United Kingdom</span>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="review">"The Nile cruise exceeded all expectations. Luxor and Aswan are deeply magical at sunrise."</p>
          <div class="author">
            <strong>David L.</strong>
            <span>United States</span>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="review">"Diving in Sharm El Sheikh is world-class. The coral reefs are perfectly preserved."</p>
          <div class="author">
            <strong>Elena R.</strong>
            <span>Spain</span>
          </div>
        </div>
      </div>

    </div>
  `;
}


export async function loadHomeData() {
  const container = document.getElementById('recommendations-container');
  if(!container) return;

  container.innerHTML = '<p style="text-align:center; width: 100%;">Locating you to find nearby attractions...</p>';

  let currentAttractions = [];
  let activeFilter = 'All';
  let homeMap = null;
  let homeMarkers = null;

  // Initialize leafet default icons
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  const customUserIcon = L.divIcon({
    html: '<div style="font-size:24px;">📍</div>',
    className: 'custom-user-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  });

  setTimeout(() => {
    const mapEl = document.getElementById('home-map-container');
    if(!mapEl) return;
    homeMap = L.map('home-map-container').setView([26.8206, 30.8025], 5); // Default Egypt View
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(homeMap);
    homeMarkers = L.layerGroup().addTo(homeMap);
  }, 100);

  const renderCards = async (lat, lng) => {
    // Only fetch once
    if (currentAttractions.length === 0) {
      currentAttractions = await fetchNearbyAttractions(lat, lng);
    }
    
    // Apply Category Filter
    let displayAttractions = currentAttractions;
    if (activeFilter !== 'All') {
      displayAttractions = currentAttractions.filter(a => a.category === activeFilter);
    }

    if(displayAttractions.length === 0) {
      container.innerHTML = '<p style="text-align:center; width: 100%;">No attractions found in this category.</p>';
      return;
    }
    
    container.innerHTML = displayAttractions.map(a => `
      <a href="#attraction/${a.id}" class="card" style="text-decoration: none; color: inherit;">
        <img src="${a.imageUrl}" alt="${a.name}" class="card-img" />
        <div class="card-content">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h3 class="card-title" style="margin-bottom: 0.2rem;">${a.name}</h3>
            <span style="color: var(--primary); font-weight: bold; background: rgba(201,147,59,0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.9rem;">⭐ ${a.rating}</span>
          </div>
          <p class="card-desc" style="margin-bottom: 1rem;">${a.description}</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
            <div><strong>Best Time:</strong> ${a.bestTime || 'N/A'}</div>
            <div><strong>Duration:</strong> ${a.duration || 'N/A'}</div>
            <div><strong>Ticket:</strong> ${a.price || 'N/A'}</div>
            <div><strong>Open:</strong> ${a.hours || 'N/A'}</div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid var(--glass-border); padding-top: 1rem;">
            ${
              a.distance !== undefined 
                ? `<span style="color: var(--text-main); font-size: 0.9rem;">📍 <strong>${a.distance} km</strong> away</span>` 
                : `<span style="color: var(--text-main); font-size: 0.9rem;">📍 Popular</span>`
            }
            <button class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.85rem;">View Details</button>
          </div>
        </div>
      </a>
    `).join('');

    // Update map markers
    setTimeout(() => {
      if(!homeMap || !homeMarkers) return;
      homeMarkers.clearLayers();

      // Plot user location first
      if(lat && lng) {
        L.marker([lat, lng], {icon: customUserIcon}).addTo(homeMarkers)
         .bindPopup('<b>You are here!</b><br>Fetching nearby places.');
        homeMap.setView([lat, lng], 8);
      }

      // Plot attractions
      displayAttractions.forEach(a => {
        const popup = `
          <div style="text-align:center;">
            <b style="color:var(--primary);">${a.name}</b><br>
            <span>⭐ ${a.rating}</span><br>
            <a href="#attraction/${a.id}" style="color:blue;text-decoration:underline;">View Place</a>
          </div>
        `;
        L.marker([a.lat, a.lng]).addTo(homeMarkers).bindPopup(popup);
      });
    }, 200);
  };

  // Bind filter button events
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.getAttribute('data-filter');
      
      // Re-render from saved state (no new network request needed to just filter)
      // Pass nulls to skip refetch logic
      renderCards(null, null); 
    });
  });

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        renderCards(latitude, longitude);
      },
      (error) => {
        console.warn("Geolocation denied or failed, loading default popular attractions.");
        renderCards(null, null); // Load defaults
      },
      { timeout: 5000 }
    );
  } else {
    // Geolocation not supported
    renderCards(null, null);
  }
}
