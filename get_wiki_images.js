const https = require('https');
const fs = require('fs');
const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=TITLE&gsrlimit=3&prop=pageimages&pithumbsize=800&format=json";

function getWikiImage(query) {
    return new Promise(resolve => {
        https.get(url.replace('TITLE', encodeURIComponent(query)), { headers: { 'User-Agent': 'NodeBot/1.0' } }, res => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try {
                const j = JSON.parse(data);
                const pages = j.query?.pages;
                if (!pages) return resolve(null);
                for (let k of Object.keys(pages)) {
                   if (pages[k] && pages[k].thumbnail) {
                       return resolve(pages[k].thumbnail.source);
                   }
                }
                resolve(null);
                } catch(e) { resolve(null); }
            });
        });
    });
}
async function run() {
    let out = "";
    out += "DESERT=" + await getWikiImage('Egyptian desert safari camel') + "\n";
    out += "NILE=" + await getWikiImage('Nile river cruise ship') + "\n";
    out += "TEMPLE=" + await getWikiImage('Karnak Temple pillars Luxor') + "\n";
    out += "DIVING=" + await getWikiImage('Coral reef scuba diving') + "\n";
    fs.writeFileSync('images_output.txt', out);
}
run();
