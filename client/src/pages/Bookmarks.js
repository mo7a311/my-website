import { fetchBookmarks, removeBookmark } from '../api.js';

export function renderBookmarks() {
  return `
    <div class="bookmarks-page animate-fade-in" style="min-height: 80vh; padding: 2rem;">
      <h2 style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 2rem; text-align: center;">My Saved Places</h2>
      <div id="bookmarks-container" class="cards-grid">
         <div style="text-align: center; grid-column: 1 / -1; color: var(--text-muted); padding: 3rem;">Loading bookmarks...</div>
      </div>
    </div>
  `;
}

export async function loadBookmarksData() {
  const container = document.getElementById('bookmarks-container');
  if (!container) return;

  try {
    const bookmarks = await fetchBookmarks();
    
    if (bookmarks.length === 0) {
      container.innerHTML = `<div style="text-align: center; grid-column: 1 / -1; color: var(--text-muted); padding: 3rem;">You haven't saved any places yet.</div>`;
      return;
    }

    const renderList = () => {
      container.innerHTML = bookmarks.map(b => `
        <div class="card" style="position: relative;">
          <img src="${b.imageUrl}" alt="${b.name}" class="card-img" style="object-fit:cover; height: 200px;" loading="lazy" />
          <button class="remove-bookmark-btn" data-id="${b.placeId}" title="Remove Bookmark" style="position: absolute; top: 10px; right: 10px; background: rgba(255,107,107,0.9); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transition: transform 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <div class="card-content">
            <h3 class="card-title" style="margin-bottom: 0.5rem; font-size: 1.2rem;">${b.name}</h3>
            <span style="display: inline-block; background: rgba(255,255,255,0.1); color: var(--text-main); font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; margin-bottom: 1rem;">${b.type || 'Place'}</span>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">📍 ${b.address}</div>
            
            <a href="https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}" target="_blank" class="btn btn-primary" style="display: block; text-align: center; border-radius: 8px;">View on Maps</a>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const placeId = e.currentTarget.dataset.id;
          try {
            e.currentTarget.style.transform = 'scale(0.8)';
            await removeBookmark(placeId);
            const idx = bookmarks.findIndex(x => x.placeId === placeId);
            if (idx > -1) bookmarks.splice(idx, 1);
            if (bookmarks.length === 0) {
              container.innerHTML = `<div style="text-align: center; grid-column: 1 / -1; color: var(--text-muted); padding: 3rem;">You haven't saved any places yet.</div>`;
            } else {
              renderList();
            }
          } catch (err) {
            console.error(err);
            alert('Failed to remove bookmark');
            e.currentTarget.style.transform = 'scale(1)';
          }
        });
      });
    };

    renderList();

  } catch (err) {
    container.innerHTML = `<div style="text-align: center; grid-column: 1 / -1; color: #ff6b6b; padding: 3rem;">Failed to load bookmarks. Make sure you are logged in.</div>`;
  }
}
