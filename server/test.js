const http = require('http');

const data = JSON.stringify({
  name: "Test6",
  email: "test6@test.com",
  password: "pwd"
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let chunks = [];
  res.on('data', d => chunks.push(d));
  res.on('end', () => console.log('Response:', Buffer.concat(chunks).toString()));
});

req.on('error', console.error);
req.write(data);
req.end();
