import { fetchMyBookings } from '../api.js';

export function renderDashboard() {
  const userStr = localStorage.getItem('user');
  let userName = 'Traveler';
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName = user.name || 'Traveler';
    } catch (e) {}
  }

  return `
    <div class="dashboard-page animate-fade-in" style="padding: 2rem; max-width: 1200px; margin: 0 auto; color: var(--text-main);">
      
      <!-- Dashboard Header -->
      <div class="glass-effect" style="padding: 2rem; border-radius: 16px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Welcome back, ${userName}!</h2>
          <p class="text-muted">Manage your upcoming trips and saved places.</p>
        </div>
        <div>
          <button class="btn-primary" onclick="window.location.hash='explore'">Explore More</button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 2rem;">
        
        <!-- Left Column: Upcoming Trips -->
        <div class="trips-section">
          <h3 style="font-size: 1.8rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--glass-border); padding-bottom: 0.5rem;">My Upcoming Trips</h3>
          <div id="bookings-container" class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
            <p>Loading your trips...</p>
          </div>
        </div>

        <!-- Right Column: Quick Links / Profile Stats -->
        <div class="profile-sidebar">
          <div class="glass-effect" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--primary);">Quick Stats & Links</h4>
            <div style="margin-bottom: 1rem;">
              <span style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--glass-border);">
                <span>🎫 Bookings</span>
                <strong id="booking-count">0</strong>
              </span>
            </div>
            
            <a href="#bookmarks" style="display: block; width: 100%; text-align: center; padding: 0.8rem; background: rgba(0,0,0,0.2); color: var(--text-main); border-radius: 8px; text-decoration: none; transition: 0.3s; margin-top: 1rem;" 
               onmouseover="this.style.background='var(--primary)'" 
               onmouseout="this.style.background='rgba(0,0,0,0.2)'">
               ⭐ View Saved Places
            </a>
            
            <a href="#preferences" style="display: block; width: 100%; text-align: center; padding: 0.8rem; background: rgba(0,0,0,0.2); color: var(--text-main); border-radius: 8px; text-decoration: none; transition: 0.3s; margin-top: 0.5rem;" 
               onmouseover="this.style.background='var(--primary)'" 
               onmouseout="this.style.background='rgba(0,0,0,0.2)'">
               ⚙️ Preferences
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}

export async function loadDashboardData() {
  const container = document.getElementById('bookings-container');
  const countEl = document.getElementById('booking-count');
  
  if (!container) return;

  try {
    const bookings = await fetchMyBookings();
    
    if (countEl) countEl.innerText = bookings.length;

    if (bookings.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; width: 100%; padding: 3rem; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px dashed var(--glass-border);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🧭</div>
          <p style="font-size: 1.2rem; color: var(--text-muted);">You have no upcoming trips yet.</p>
          <button class="btn-primary" style="margin-top: 1rem;" onclick="window.location.hash='explore'">Find a Tour</button>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(b => {
      const tourName = b.tour?.title || 'Unknown Tour';
      const tourImg = b.tour?.imageUrl || '/images/pyramids.jpg';
      const bDate = new Date(b.date).toLocaleDateString();
      
      return \`
        <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
          <img src="\${tourImg}" alt="\${tourName}" style="width: 100%; height: 180px; object-fit: cover; opacity: 0.9;" />
          <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; background: var(--glass-bg); backdrop-filter: blur(10px);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
              <h3 style="font-size: 1.3rem; color: var(--primary); margin: 0;">\${tourName}</h3>
              <span style="font-size: 0.8rem; padding: 3px 8px; border-radius: 12px; font-weight: bold; 
                 \${b.status==='confirmed' ? 'background: rgba(34,197,94,0.2); color: #4ade80;' : 'background: rgba(234,179,8,0.2); color: #facc15;'}">
                \${b.status.toUpperCase()}
              </span>
            </div>
            
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">📅 \${bDate}</p>
            
            <div style="margin-top: auto; padding-top: 1rem; border-top: 1px dashed var(--glass-border); text-align: center;">
              \${b.status === 'confirmed' ? 
                \`<div style="font-family: monospace; letter-spacing: 2px; background: white; color: black; padding: 0.8rem; border-radius: 6px; font-weight: bold;">[|||| Ticket ID: \${b._id.slice(-6).toUpperCase()} ||||]</div>\`
                : \`<p style="color: var(--text-muted); font-size: 0.9rem;">Awaiting Confirmation</p>\`
              }
            </div>
          </div>
        </div>
      \`;
    }).join('');

  } catch (error) {
    console.error('Failed to load dashboard:', error);
    container.innerHTML = '<p style="color: red;">Failed to load bookings. Please try again later.</p>';
  }
}
