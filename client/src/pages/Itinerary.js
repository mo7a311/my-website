import { fetchAttractions } from '../api.js';

export function renderItinerary() {
  return `
    <div class="itinerary-page animate-fade-in" style="max-width: 800px; margin: 4rem auto; padding: 0 2rem;">
      <div class="section-title">
        <h2>AI Trip Planner</h2>
        <p class="text-muted">Tell us what you love, and we'll craft the perfect Egypt itinerary.</p>
      </div>

      <div class="glass-effect" style="padding: 2rem; border-radius: 16px; margin-bottom: 2rem;" id="ai-form-container">
        <h3 style="color: var(--primary); margin-bottom: 1.5rem;">What are you interested in?</h3>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;" id="interest-pills">
          <button class="filter-btn" data-interest="history">🏛️ History & Antiquities</button>
          <button class="filter-btn" data-interest="adventure">🐪 Desert Adventure</button>
          <button class="filter-btn" data-interest="food">🥘 Local Food & Markets</button>
          <button class="filter-btn" data-interest="culture">🎭 Culture & Arts</button>
        </div>

        <div style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted);">How many days?</label>
          <input type="number" id="trip-days" min="1" max="7" value="3" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.2); color: #fff; font-size: 1rem;" />
        </div>

        <button class="btn-primary" id="generate-btn" style="width: 100%; padding: 1rem; font-size: 1.1rem;">✨ Generate My Itinerary</button>
      </div>

      <div id="itinerary-results" style="display: none;">
        <!-- Results rendered here -->
      </div>
    </div>
  `;
}

export function loadItineraryData() {
  const pills = document.querySelectorAll('#interest-pills .filter-btn');
  const generateBtn = document.getElementById('generate-btn');
  const resultsContainer = document.getElementById('itinerary-results');
  const formContainer = document.getElementById('ai-form-container');
  const daysInput = document.getElementById('trip-days');
  
  let selectedInterests = new Set();

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.target.classList.toggle('active');
      const interest = e.target.getAttribute('data-interest');
      if(selectedInterests.has(interest)) {
        selectedInterests.delete(interest);
      } else {
        selectedInterests.add(interest);
      }
    });
  });

  generateBtn.addEventListener('click', async () => {
    if(selectedInterests.size === 0) {
      alert("Please select at least one interest!");
      return;
    }

    const days = parseInt(daysInput.value) || 3;
    const attractions = await fetchAttractions(); // Fetch our DB

    // UI Loading state
    generateBtn.innerHTML = "⏳ Thinking...";
    generateBtn.disabled = true;

    // Simulate AI Generation Delay
    setTimeout(() => {
      // Basic AI Logic matching tags with descriptions/categories (mock)
      let matchedAttractions = [...attractions];
      
      // Shuffle array for "AI" variance
      matchedAttractions.sort(() => 0.5 - Math.random());

      let itineraryHtml = `<h3 style="color:var(--primary); margin-bottom:2rem; font-size:2rem; text-align:center;">Your Personalized Itinerary</h3>`;
      
      for(let i = 1; i <= days; i++) {
        // Pick one attraction per day (cycle if ran out)
        const attraction = matchedAttractions[(i-1) % matchedAttractions.length];
        
        itineraryHtml += `
          <div class="glass-effect" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid var(--primary);">
            <h4 style="color: #fff; font-size: 1.25rem; margin-bottom: 1rem;">Day ${i}</h4>
            <div style="display: flex; gap: 1.5rem; align-items: center;">
              <img src="${attraction.imageUrl}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;" />
              <div>
                <h5 style="color: var(--primary); font-size: 1.1rem; margin-bottom: 0.5rem;">${attraction.name}</h5>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${attraction.description}</p>
                <a href="#attraction/${attraction.id}" style="color: #fff; text-decoration: underline; font-size: 0.85rem;">View Details</a>
              </div>
            </div>
          </div>
        `;
      }

      formContainer.style.display = 'none';
      resultsContainer.style.display = 'block';
      resultsContainer.innerHTML = itineraryHtml + `
        <button class="btn-primary" style="width:100%; padding:1rem; margin-top:2rem;" onclick="window.location.reload()">Start Over</button>
      `;

    }, 1500); // 1.5s thinking time
  });
}
