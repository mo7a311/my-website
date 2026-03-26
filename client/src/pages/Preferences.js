import { getUserPreferences, updateUserPreferences } from '../api.js';

export function renderPreferences() {
  return `
    <div class="explore-page animate-fade-in" style="min-height: 80vh; padding: 2rem;">
      <div style="max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="font-size: 2rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; text-align: center;">My Preferences</h2>
        <p style="color: var(--text-muted); text-align: center; margin-bottom: 2rem;">
          Customize your "Near Me" recommendations exactly to your liking.
        </p>

        <form id="preferences-form">
          <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--text-main); margin-bottom: 1rem; font-size: 1.2rem;">What are you interested in?</h3>
            
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); cursor: pointer;">
                <input type="checkbox" name="interests" value="Historic" class="pref-checkbox" />
                🏛️ Historic Sites & Monuments
              </label>
              
              <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); cursor: pointer;">
                <input type="checkbox" name="interests" value="Tourism" class="pref-checkbox" />
                🖼️ Museums & Tourist Attractions
              </label>
              
              <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); cursor: pointer;">
                <input type="checkbox" name="interests" value="Leisure / Sport" class="pref-checkbox" />
                🏊 Leisure & Sports
              </label>
              
              <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); cursor: pointer;">
                <input type="checkbox" name="interests" value="Entertainment" class="pref-checkbox" />
                🎳 Entertainment (Cinemas, Theatres)
              </label>
            </div>
          </div>

          <div style="margin-bottom: 2.5rem;">
            <h3 style="color: var(--text-main); margin-bottom: 1rem; font-size: 1.2rem;">Maximum Travel Distance</h3>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
              <span id="distance-val" style="color: var(--primary); font-weight: bold; font-size: 1.1rem;">5 km</span>
            </div>
            <input type="range" id="distance-slider" min="1" max="20" step="1" value="5" style="width: 100%; cursor: pointer;" />
            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.8rem; margin-top: 0.5rem;">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>
          
          <div id="pref-msg" style="display: none; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center;"></div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem; border-radius: 30px; background: linear-gradient(135deg, var(--primary) 0%, #a47326 100%); color: white; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(201,147,59,0.3);">
            Save Preferences
          </button>
        </form>
        
        <div style="text-align: center; margin-top: 1.5rem;">
          <a href="#recommendations" style="color: var(--text-muted); text-decoration: none;">&larr; Back to Near Me</a>
        </div>
      </div>
    </div>
  `;
}

export function loadPreferencesData() {
  const form = document.getElementById('preferences-form');
  const slider = document.getElementById('distance-slider');
  const distanceVal = document.getElementById('distance-val');
  const checkboxes = document.querySelectorAll('.pref-checkbox');
  const msgBox = document.getElementById('pref-msg');

  if (!form) return;

  // Update slider label visually
  slider.addEventListener('input', (e) => {
    distanceVal.textContent = e.target.value + ' km';
  });

  // Load existing preferences
  const loadPrefs = async () => {
    try {
      const res = await getUserPreferences();
      if (res.success && res.preferences) {
        const prefs = res.preferences;
        
        // Check matching boxes
        if (prefs.interests && prefs.interests.length > 0) {
          checkboxes.forEach(cb => {
            if (prefs.interests.includes(cb.value)) {
              cb.checked = true;
            } else {
              cb.checked = false;
            }
          });
        }
        
        // Set slider value
        if (prefs.maxDistance) {
          const km = Math.round(prefs.maxDistance / 1000);
          slider.value = km;
          distanceVal.textContent = km + ' km';
        }
      }
    } catch (err) {
      if (err.message === 'Not logged in') {
        showMessage('You must be logged in to save preferences. Login first.', 'error');
        form.querySelector('button').disabled = true;
      } else {
        showMessage('Failed to load preferences.', 'error');
      }
    }
  };

  loadPrefs();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Gather selected checkboxes
    const interests = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
      
    // Gather slider value and convert back to meters
    const maxDistance = parseInt(slider.value) * 1000;
    
    try {
      await updateUserPreferences({ interests, maxDistance });
      showMessage('Preferences saved successfully! Head back to Near Me.', 'success');
    } catch (err) {
      showMessage(err.message || 'Failed to update preferences', 'error');
    }
  });
  
  function showMessage(msg, type) {
    msgBox.style.display = 'block';
    msgBox.textContent = msg;
    if (type === 'success') {
      msgBox.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
      msgBox.style.color = '#4CAF50';
    } else {
      msgBox.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
      msgBox.style.color = '#ff6b6b';
    }
  }
}
