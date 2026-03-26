export function renderExplore() {
  return `
    <div class="explore-page animate-fade-in">
      <h2>Explore All Destinations</h2>
      <p>Browse through historical sites, museums, and activities.</p>
      <div class="search-bar glass-effect" style="margin: 2rem 0; padding: 1rem; border-radius: 8px;">
        <input type="text" placeholder="Search attractions..." style="width:100%; padding:0.5rem; background:transparent; border:none; color:var(--text-main); font-size:1rem; outline:none;" />
      </div>
      <div class="cards-grid" id="explore-container">
        <!-- List will go here -->
      </div>
    </div>
  `;
}

import { fetchAttractions } from '../api.js';

export async function loadExploreData() {
  const container = document.getElementById('explore-container');
  if(!container) return;
  
  const attractions = await fetchAttractions();
  if(attractions.length === 0) {
    container.innerHTML = '<p>No attractions found.</p>';
    return;
  }
  
  container.innerHTML = attractions.map(a => `
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
      </div>
    </a>
  `).join('');
}
