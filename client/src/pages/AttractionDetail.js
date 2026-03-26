import { fetchAttractionById, fetchNearbyAttractions } from '../api.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function renderAttractionDetail() {
  return `
    <div class="detail-page animate-fade-in" id="detail-container">
      <div style="text-align:center; padding: 4rem;">Loading...</div>
    </div>
  `;
}

export async function loadAttractionDetail(id) {
  const attraction = await fetchAttractionById(id);
  const container = document.getElementById('detail-container');
  if(!container) return;

  if(!attraction) {
    container.innerHTML = `<div style="text-align:center; padding:4rem;"><h2>Attraction not found</h2><a href="#explore" class="btn-primary" style="margin-top:1rem;">Back to Explore</a></div>`;
    return;
  }

  // Load nearby based on coords
  const nearby = await fetchNearbyAttractions(attraction.lat, attraction.lng);
  const others = nearby.filter(a => a.id !== id).slice(0, 2);

  const galleryHtml = attraction.gallery.map(img => `<img src="${img}" style="width:100%; height:200px; object-fit:cover; border-radius:12px; border:1px solid var(--glass-border);"/>`).join('');
  const tipsHtml = attraction.travelTips.map(tip => `<li>✔️ ${tip}</li>`).join('');
  const reviewsHtml = attraction.reviews.map(r => `
    <div style="background:rgba(0,0,0,0.2); padding:1rem; border-radius:8px; margin-bottom:1rem;">
      <strong>${r.user}</strong> <span style="color:var(--primary);">⭐ ${r.rating}</span>
      <p style="margin-top:0.5rem; font-size:0.9rem;">${r.comment}</p>
    </div>
  `).join('');
  
  const nearbyHtml = others.map(a => `
    <a href="#attraction/${a.id}" class="card" style="text-decoration:none; color:inherit; display:block; margin-bottom:1rem;">
      <div style="display:flex; gap:1rem; align-items:center; padding:0.5rem;">
        <img src="${a.imageUrl}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;"/>
        <div><h4 style="color:var(--primary); margin:0;">${a.name}</h4><small>📍 ${a.distance} km away</small></div>
      </div>
    </a>
  `).join('');

  container.innerHTML = `
    <!-- Top Hero Banner -->
    <div style="position:relative; width:100vw; height:50vh; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; background: url('${attraction.imageUrl}') center/cover no-repeat; margin-bottom: -5rem;">
      <div style="position:absolute; inset:0; background:linear-gradient(rgba(15,23,42,0.1), rgba(15,23,42,1));"></div>
    </div>

    <!-- Main Content Grid -->
    <div style="max-width: 1200px; margin: 0 auto; position:relative; z-index:10; padding:0 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 3.5rem; color:#fff; margin-bottom:0.5rem; text-shadow:2px 2px 4px rgba(0,0,0,0.5);">${attraction.name}</h1>
          <span style="background:var(--primary); color:#fff; padding:0.3rem 1rem; border-radius:20px; font-weight:bold;">⭐ ${attraction.rating} • ${attraction.category}</span>
        </div>
        <button class="btn-primary" style="padding: 0.75rem 2rem; font-size:1.1rem;">Book Tour</button>
      </div>

      <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 3rem;">
        
        <!-- Left Column (Main Details) -->
        <div>
          <div class="glass-effect" style="padding: 2rem; border-radius: 16px; margin-bottom: 2rem;">
            <h3 style="color:var(--primary); margin-bottom:1rem;">About</h3>
            <p style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 1.5rem;">${attraction.description}</p>
            <h3 style="color:var(--primary); margin-bottom:1rem;">History</h3>
            <p style="color: var(--text-muted); line-height:1.7;">${attraction.history}</p>
          </div>

          <h3 style="color:#fff; margin-bottom:1rem;">Gallery</h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom: 2rem;">
            ${galleryHtml}
          </div>

          <div class="glass-effect" style="padding: 2rem; border-radius: 16px; margin-bottom: 2rem;">
            <h3 style="color:var(--primary); margin-bottom:1rem;">Location Map</h3>
            <div id="detail-map" style="width:100%; height:300px; border-radius:12px; z-index:1;"></div>
          </div>

          <div class="glass-effect" style="padding: 2rem; border-radius: 16px; margin-bottom: 2rem;">
            <h3 style="color:var(--primary); margin-bottom:1rem;">Reviews</h3>
            ${reviewsHtml}
          </div>
        </div>

        <!-- Right Column (Meta & Sidebar) -->
        <div>
          <div class="glass-effect" style="padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem;">
            <h4 style="color:var(--primary); border-bottom:1px solid var(--glass-border); padding-bottom:0.5rem; margin-bottom:1rem;">Visitor Info</h4>
            <div style="margin-bottom:0.8rem;"><strong>Best Time:</strong> <span style="color:var(--text-muted); float:right;">${attraction.bestTime}</span></div>
            <div style="margin-bottom:0.8rem;"><strong>Duration:</strong> <span style="color:var(--text-muted); float:right;">${attraction.duration}</span></div>
            <div style="margin-bottom:0.8rem;"><strong>Ticket:</strong> <span style="color:var(--text-muted); float:right;">${attraction.price}</span></div>
            <div><strong>Open:</strong> <span style="color:var(--text-muted); float:right;">${attraction.hours}</span></div>
          </div>

          <div class="glass-effect" style="padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem;">
            <h4 style="color:var(--primary); border-bottom:1px solid var(--glass-border); padding-bottom:0.5rem; margin-bottom:1rem;">Travel Tips</h4>
            <ul style="list-style:none; padding:0; margin:0; color:var(--text-muted); line-height:1.8;">
              ${tipsHtml}
            </ul>
          </div>

          <div class="glass-effect" style="padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem;">
            <h4 style="color:var(--primary); border-bottom:1px solid var(--glass-border); padding-bottom:0.5rem; margin-bottom:1rem;">Nearby Attractions</h4>
            ${nearbyHtml || '<p>No nearby attractions found.</p>'}
          </div>
          
          <a href="#explore" style="color: var(--primary); text-decoration: none; display:inline-block; margin-top:1rem;">&larr; Back to all Destinations</a>
        </div>
      </div>
    </div>
  `;

  // Initialize Map inside the new DOM element after render
  setTimeout(() => {
    const mapEl = document.getElementById('detail-map');
    if(mapEl) {
      const map = L.map('detail-map').setView([attraction.lat, attraction.lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      L.marker([attraction.lat, attraction.lng]).addTo(map).bindPopup(`<b>${attraction.name}</b>`).openPopup();
    }
  }, 100);
}
