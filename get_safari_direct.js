const https = require('https');
const fs = require('fs');
https.get('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Dune_bashing_in_Dubai.jpg/800px-Dune_bashing_in_Dubai.jpg', {headers: {'User-Agent': 'Mozilla/5.0'}}, res => {
  res.pipe(fs.createWriteStream('client/public/images/safari.jpg'));
});
