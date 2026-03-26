const https = require('https');
const fs = require('fs');
https.get('https://en.wikipedia.org/w/api.php?action=query&titles=Dune_bashing&prop=pageimages&pithumbsize=800&format=json', {headers:{'User-Agent':'test/1.0'}}, res => {
  let data = '';
  res.on('data', d => data+=d);
  res.on('end', () => {
      const pages = JSON.parse(data).query.pages;
      const url = Object.values(pages)[0].thumbnail.source;
      console.log("Downloading from", url);
      https.get(url, {headers:{'User-Agent':'test/1.0'}}, img => {
          const file = fs.createWriteStream('client/public/images/safari.jpg');
          img.pipe(file);
          file.on('finish', () => console.log("Done downloading safari image."));
      });
  });
});
