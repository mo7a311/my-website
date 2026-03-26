import { renderHome, loadHomeData } from './pages/Home.js';
import { renderExplore, loadExploreData } from './pages/Explore.js';
import { renderMap, loadMapData } from './pages/Map.js';
import { renderAttractionDetail, loadAttractionDetail } from './pages/AttractionDetail.js';
import { renderItinerary, loadItineraryData } from './pages/Itinerary.js';
import { renderDestination, loadDestinationData } from './pages/Destination.js';
import { renderRecommendations, loadRecommendationsData } from './pages/Recommendations.js';
import { renderPreferences, loadPreferencesData } from './pages/Preferences.js';
import { renderBookmarks, loadBookmarksData } from './pages/Bookmarks.js';

export function setupRouter(appElement) {
  const dynamicContent = appElement.querySelector('#dynamic-content');
  const heroSection = appElement.querySelector('.hero-modern');
  
  const routes = {
    '': () => {
      if(heroSection) heroSection.style.display = 'flex';
      dynamicContent.innerHTML = renderHome();
      loadHomeData();
    },
    'home': () => {
      if(heroSection) heroSection.style.display = 'flex';
      dynamicContent.innerHTML = renderHome();
      loadHomeData();
    },
    'explore': () => {
      if(heroSection) heroSection.style.display = 'none';
      dynamicContent.innerHTML = renderExplore();
      loadExploreData();
    },
    'recommendations': () => {
      if(heroSection) heroSection.style.display = 'none';
      dynamicContent.innerHTML = renderRecommendations();
      loadRecommendationsData();
    },
    'preferences': () => {
      if(heroSection) heroSection.style.display = 'none';
      dynamicContent.innerHTML = renderPreferences();
      loadPreferencesData();
    },
    'bookmarks': () => {
      if(heroSection) heroSection.style.display = 'none';
      dynamicContent.innerHTML = renderBookmarks();
      loadBookmarksData();
    },
    'ai-recommendations': () => {
      if(heroSection) heroSection.style.display = 'none';
      import('./pages/AiRecommendations.js').then(module => {
        dynamicContent.innerHTML = module.renderAiRecommendations();
        module.loadAiRecommendationsData();
      });
    },
    'map': () => {
      if(heroSection) heroSection.style.display = 'none';
      dynamicContent.innerHTML = renderMap();
      loadMapData();
    },
    'planner': () => {
      if(heroSection) heroSection.style.display = 'none';
      dynamicContent.innerHTML = renderItinerary();
      loadItineraryData();
    },
    'login': () => {
      if(heroSection) heroSection.style.display = 'none';
      import('./pages/Auth.js').then(module => {
        dynamicContent.innerHTML = module.renderAuth();
        module.setupAuthEvents();
      });
    }
  };

  const loadRoute = () => {
    const hash = window.location.hash.slice(1);
    const parts = hash.split('/');
    const basePath = parts[0];
    
    if (basePath === 'attraction' && parts[1]) {
      heroSection.style.display = 'none';
      dynamicContent.innerHTML = renderAttractionDetail();
      loadAttractionDetail(parts[1]);
      window.scrollTo(0, 0);
      return;
    }

    if (basePath === 'destination' && parts[1]) {
      if(heroSection) heroSection.style.display = 'none';
      dynamicContent.innerHTML = renderDestination(parts[1]);
      loadDestinationData();
      window.scrollTo(0, 0);
      return;
    }

    if (!routes[basePath]) {
      routes['']();
    } else {
      routes[basePath]();
    }
    window.scrollTo(0, 0);
  };

  // Unbind any previous listeners to prevent Vite HMR duplicate trigger bugs
  if (window.__routeListener) {
    window.removeEventListener('hashchange', window.__routeListener);
  }
  window.__routeListener = loadRoute;
  
  window.addEventListener('hashchange', window.__routeListener);
  loadRoute(); // Load initial route
}
