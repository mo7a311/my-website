import{f as m}from"./index-C5o8Pg2r.js";function b(){return`
    <div class="explore-page animate-fade-in" style="min-height: 80vh; padding: 2rem;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h2 style="font-size: 2.8rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Smart AI Travel Recommendations
        </h2>
        <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 600px; margin: 1rem auto;">
          Select a category below, and our intelligent engine will instantly curate a list of verified destinations in Egypt.
        </p>

        <!-- Dynamic Category Buttons -->
        <div class="categories-container" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
          <button class="ai-cat-btn" data-category="Historical Sites">🏛️ Historical Sites</button>
          <button class="ai-cat-btn" data-category="Museums">🏺 Museums</button>
          <button class="ai-cat-btn" data-category="Religious Sites">🕌 Religious Sites</button>
          <button class="ai-cat-btn" data-category="Beaches">🏖️ Beaches</button>
          <button class="ai-cat-btn" data-category="Desert Adventures">🏜️ Desert Adventures</button>
          <button class="ai-cat-btn" data-category="Food & Markets">🍛 Food & Markets</button>
        </div>
      </div>

      <!-- Loading State -->
      <div id="ai-loading-spinner" style="display: none; text-align: center; padding: 3rem 0;">
        <div style="display: inline-block; width: 50px; height: 50px; border: 3px solid rgba(201,147,59,0.3); border-radius: 50%; border-top-color: var(--primary); animation: spin 1s ease-in-out infinite;"></div>
        <p style="margin-top: 1rem; color: var(--text-muted); font-size: 1.2rem;" id="ai-loading-text">Consulting the AI Engine...</p>
      </div>

      <!-- Results Container -->
      <div id="ai-results-container" class="cards-grid" style="display: none;">
         <!-- Cards injected here dynamically -->
      </div>
      
      <!-- Fallback / Error -->
      <div id="ai-error-message" style="display: none; text-align: center; padding: 2rem; color: #ff6b6b; background: rgba(255,107,107,0.1); border-radius: 8px; margin-top: 2rem;">
      </div>
    </div>
    <style>
      .ai-cat-btn {
        padding: 0.8rem 1.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 30px;
        background: rgba(255,255,255,0.05);
        color: var(--text-main);
        border: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      }
      .ai-cat-btn:hover {
        transform: translateY(-3px);
        background: rgba(255,255,255,0.15);
        border-color: rgba(255,255,255,0.3);
        box-shadow: 0 8px 15px rgba(0,0,0,0.3);
      }
      .ai-cat-btn.active {
        background: linear-gradient(135deg, var(--primary) 0%, #a47326 100%);
        color: white;
        border-color: transparent;
        box-shadow: 0 4px 15px rgba(201,147,59,0.4);
      }
    </style>
  `}function u(){const a=document.querySelectorAll(".ai-cat-btn"),r=document.getElementById("ai-results-container"),i=document.getElementById("ai-loading-spinner"),l=document.getElementById("ai-loading-text"),n=document.getElementById("ai-error-message");if(!a||a.length===0)return;async function c(e){n.style.display="none",r.style.display="none",i.style.display="block",l.textContent=`Asking AI Algorithm about "${e}"...`,r.innerHTML="";try{const t=await m(e);if(i.style.display="none",!t||t.length===0){s(`The AI could not find any recommendations for "${e}".`);return}g(t)}catch{i.style.display="none",s("Failed to fetch recommendations from the AI endpoint.")}}function s(e){n.style.display="block",n.textContent=e}function g(e){r.style.display="grid",r.innerHTML=e.map((t,o)=>`
        <div class="card" style="display: flex; flex-direction: column; cursor: default; transition: transform 0.3s; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden;">
          <div style="position: relative;">
            <img src="${t.imageUrl||`https://loremflickr.com/400/300/landscape,egypt/all?lock=${o}`}" alt="${t.name}" loading="lazy" style="width: 100%; height: 220px; object-fit: cover; border-bottom: 2px solid var(--primary);" />
            <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 0.9rem; color: #ffd700; border: 1px solid rgba(255,215,0,0.3);">
              ★ ${t.rating||"N/A"}
            </div>
          </div>

          <div class="card-content" style="padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <h3 style="margin: 0; font-size: 1.3rem; color: var(--text-main);">${t.name}</h3>
            </div>
            
            <div style="color: var(--primary); font-size: 0.9rem; font-weight: 500; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 0.5rem;">
               <span style="background: rgba(201, 147, 59, 0.1); padding: 2px 8px; border-radius: 4px;">${t.type||"Unknown Type"}</span>
               <span style="color: var(--text-muted);">• ${t.location}</span>
            </div>

            <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.5rem; flex-grow: 1;">
              ${t.description}
            </p>
          </div>
        </div>
      `).join("")}a.forEach(e=>{e.addEventListener("click",t=>{a.forEach(d=>d.classList.remove("active")),t.currentTarget.classList.add("active");const o=t.currentTarget.dataset.category;c(o)})})}export{u as loadAiRecommendationsData,b as renderAiRecommendations};
