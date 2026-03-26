const https = require('https');
const fs = require('fs');

const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=Nile%20river%20cruise%20ship&gsrlimit=3&prop=pageimages&pithumbsize=800&format=json";

https.get(url, { headers: { 'User-Agent': 'NodeBot/1.0' } }, res => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const j = JSON.parse(data);
        const pages = j.query.pages;
        let imgUrl = null;
        for (let k of Object.keys(pages)) {
           if (pages[k] && pages[k].thumbnail) {
               imgUrl = pages[k].thumbnail.source;
               break;
           }
        }
        if (imgUrl) {
            console.log("Found URL:", imgUrl);
            https.get(imgUrl, { headers: { 'User-Agent': 'NodeBot/1.0' } }, imgRes => {
                const file = fs.createWriteStream('./client/public/images/cruise.jpg');
                imgRes.pipe(file);
                file.on('finish', () => console.log('Downloaded'));
            });
        }
    });
});
