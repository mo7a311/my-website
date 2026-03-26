import './style.css';
import { renderNavbar, setupNavbarEvents } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';
import { setupRouter } from './router.js';

document.querySelector('#app').innerHTML = `
  <div class="app-container">
    ${renderNavbar()}
    <main id="main-content">
      <section class="hero-modern">
        <div class="hero-content">
          <h1 class="hero-title">Discover the Wonders of Egypt</h1>
          <p class="hero-subtitle">Explore ancient history, breathtaking temples, and unforgettable adventures.</p>
          
          <div class="search-bar-container">
            <input type="text" class="search-input" placeholder="Where do you want to go? (e.g. Cairo, Luxor)" />
            <button class="btn-primary" id="exploreNowBtn" style="padding: 1rem 2rem; font-size: 1.1rem; border-radius: 30px;">Explore Now</button>
          </div>
        </div>
      </section>
      
      <section id="dynamic-content" class="content-section">
        <!-- Route views will be rendered here -->
      </section>
    </main>
    ${renderFooter()}
  </div>
`;

// Initialize events
setupNavbarEvents(document.querySelector('#app'));
setupRouter(document.querySelector('#app'));

document.getElementById('exploreNowBtn')?.addEventListener('click', () => {
  window.location.hash = 'explore';
});
