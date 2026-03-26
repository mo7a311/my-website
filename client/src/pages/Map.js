import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchAttractions } from '../api.js';

export function renderMap() {
  return `
    <div class="map-page animate-fade-in" style="height: calc(100vh - 80px); width: 100%; display: flex; flex-direction: column;">
      <div id="map-container" style="flex: 1; width: 100%; z-index: 1;"></div>
    </div>
  `;
}

export async function loadMapData() {
  // Wait a tick for the DOM to render the container
  setTimeout(async () => {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    // Use default Egypt Coordinates
    const map = L.map('map-container').setView([26.8206, 30.8025], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Fix leaflet marker icon paths
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const attractions = await fetchAttractions();
    
    // Add markers for mock data
    // Assuming mock data has coordinates; generating some default ones around Cairo if not present
    const coordsMap = {
      '1': [29.9792, 31.1342], // Pyramids
      '2': [30.0478, 31.2336], // Museum
      '3': [25.7188, 32.6573]  // Karnak
    };

    attractions.forEach(a => {
      const coords = coordsMap[a.id] || [30.0, 31.0];
      const popupContent = `
        <div style="text-align:center;">
          <h4 style="margin: 0; color: #c9933b;">${a.name}</h4>
          <p style="margin: 0.5rem 0; font-size: 0.85rem;">${a.category}</p>
          <a href="#attraction/${a.id}" style="color: blue; text-decoration: underline;">View Details</a>
        </div>
      `;
      L.marker(coords).addTo(map).bindPopup(popupContent);
    });
  }, 100);
}
