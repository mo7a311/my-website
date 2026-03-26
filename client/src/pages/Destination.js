import L from 'leaflet';

export function renderDestination(id) {
  // Normally we would have an API call here. 
  // We'll hardcode some robust mock data to satisfy requirements.
  const data = {
    cairo: {
      name: "Cairo",
      image: "https://images.unsplash.com/photo-1553603227-234282e7bb0a?auto=format&fit=crop&w=1920&q=80",
      attractions: ["Great Pyramid of Giza", "Egyptian Museum", "Khan el-Khalili Bazaar", "Salah El-Din Citadel"],
      hotels: ["Marriott Mena House", "The Nile Ritz-Carlton", "Four Seasons Nile Plaza"],
      restaurants: ["Abou Tarek", "Sequoia", "Naguib Mahfouz Cafe"],
      tips: ["Bargain at the bazaars.", "Drink bottled water.", "Visit the Pyramids early in the morning."],
      coords: [30.0444, 31.2357]
    },
    luxor: {
      name: "Luxor",
      image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1920&q=80",
      attractions: ["Karnak Temple", "Valley of the Kings", "Luxor Temple", "Hatshepsut Temple"],
      hotels: ["Sofitel Winter Palace", "Hilton Luxor Resort", "Steigenberger Nile Palace"],
      restaurants: ["Sofra Restaurant & Cafe", "1886 Restaurant", "Aisha Restaurant"],
      tips: ["Bring sunscreen and a hat.", "Take a hot air balloon ride at sunrise."],
      coords: [25.6872, 32.6396]
    },
    aswan: {
      name: "Aswan",
      image: "https://images.unsplash.com/photo-1596796985038-024c084e3e33?auto=format&fit=crop&w=1920&q=80",
      attractions: ["Philae Temple", "Abu Simbel Temples", "Nubian Village", "Unfinished Obelisk"],
      hotels: ["Sofitel Legend Old Cataract", "Mövenpick Resort Aswan", "Tolip Aswan Hotel"],
      restaurants: ["1902 Restaurant", "Panorama Restaurant", "El Dokka"],
      tips: ["Take a felucca ride at sunset.", "Visit the colorful Nubian villages."],
      coords: [24.0889, 32.8998]
    },
    alexandria: {
      name: "Alexandria",
      image: "https://images.unsplash.com/photo-1588661730048-89c094fa5d05?auto=format&fit=crop&w=1920&q=80",
      attractions: ["Bibliotheca Alexandrina", "Qaitbay Citadel", "Montaza Palace", "Catacombs of Kom El Shoqafa"],
      hotels: ["Four Seasons San Stefano", "Steigenberger Cecil Hotel", "Hilton Alexandria Corniche"],
      restaurants: ["Sea Gull", "Balbaa Village", "White and Blue"],
      tips: ["Enjoy seafood by the Mediterranean.", "Expect milder weather than Cairo."],
      coords: [31.2001, 29.9187]
    },
    sharm: {
      name: "Sharm El Sheikh",
      image: "https://images.unsplash.com/photo-1504938361719-79883da4bf63?auto=format&fit=crop&w=1920&q=80",
      attractions: ["Ras Mohammed National Park", "Naama Bay", "Mount Sinai", "Saint Catherine's Monastery"],
      hotels: ["Four Seasons Resort", "Rixos Premium Seagate", "Steigenberger Alcazar"],
      restaurants: ["Fares Seafood", "Pomodoro", "Rangoli"],
      tips: ["Excellent diving spot, bring an underwater camera.", "Negotiate taxi fares before riding."],
      coords: [27.9158, 34.3299]
    }
  };

  const dest = data[id];

  if(!dest) {
    return `<div class="content-section text-center"><h2 class="text-3xl text-white">Destination not found.</h2><a href="#home" class="btn-primary mt-4">Go Back</a></div>`;
  }

  return `
    <div class="animate-fade-in pb-16">
      <!-- Hero -->
      <div class="relative h-[60vh] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        <img src="${dest.image}" class="absolute inset-0 w-full h-full object-cover z-0" alt="${dest.name}" />
        <div class="relative z-20 text-center">
          <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg">${dest.name}</h1>
          <p class="text-xl text-slate-200">The gateway to unforgettable experiences.</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          
          <div class="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h2 class="text-2xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2"><span>🏛️</span> Top Attractions</h2>
            <ul class="list-disc list-inside text-slate-300 space-y-2 ml-2">
              ${dest.attractions.map(attr => `<li>${attr}</li>`).join('')}
            </ul>
          </div>

          <div class="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h2 class="text-2xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2"><span>🏨</span> Recommended Hotels</h2>
            <ul class="list-disc list-inside text-slate-300 space-y-2 ml-2">
              ${dest.hotels.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>

          <div class="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h2 class="text-2xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2"><span>🍽️</span> Popular Restaurants</h2>
            <ul class="list-disc list-inside text-slate-300 space-y-2 ml-2">
              ${dest.restaurants.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          
          <!-- Map -->
          <div class="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-col h-80">
            <h2 class="text-xl font-bold text-[var(--primary)] mb-3 flex items-center gap-2"><span>🗺️</span> Map Location</h2>
            <div id="dest-map-container" class="w-full flex-1 rounded-xl overflow-hidden border border-white/10" data-lat="${dest.coords[0]}" data-lng="${dest.coords[1]}"></div>
          </div>

          <!-- Tips -->
          <div class="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h2 class="text-xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2"><span>💡</span> Tourist Tips</h2>
            <ul class="space-y-3 text-sm text-slate-300">
              ${dest.tips.map(tip => `
                <li class="flex items-start gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
                  <span class="text-yellow-500 mt-0.5">★</span>
                  <span>${tip}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Actions -->
          <button class="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:bg-[var(--primary-hover)] transition shadow-lg hover:shadow-[var(--primary)]/50 flex justify-center items-center gap-2">
            <span>❤️</span> Add to Favorites
          </button>
        </div>

      </div>
    </div>
  `;
}

export function loadDestinationData() {
  setTimeout(() => {
    const mapEl = document.getElementById('dest-map-container');
    if(!mapEl) return;
    
    // Initialize leafet default icons if not done already globally
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const lat = parseFloat(mapEl.getAttribute('data-lat'));
    const lng = parseFloat(mapEl.getAttribute('data-lng'));

    const destMap = L.map('dest-map-container').setView([lat, lng], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(destMap);
    L.marker([lat, lng]).addTo(destMap);
  }, 100);
}
