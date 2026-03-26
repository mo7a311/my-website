const https = require('https');

function fetchImages(query) {
  return new Promise((resolve) => {
    https.get(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=15`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        // Find first non-premium image
        const img = parsed.results.find(r => !r.premium && !r.is_premium);
        resolve(img ? img.urls.raw + '&w=600&q=80&fit=crop' : null);
      });
    });
  });
}

async function main() {
  const q1 = await fetchImages('egypt desert safari bedouin');
  const q2 = await fetchImages('nile river cruise egypt');
  const q3 = await fetchImages('luxor temple egypt ancient');
  const q4 = await fetchImages('red sea scuba diving coral');
  console.log('DESERT_SAFARI=', q1);
  console.log('NILE_CRUISE=', q2);
  console.log('TEMPLES_TOUR=', q3);
  console.log('RED_SEA_DIVING=', q4);
}

main();
