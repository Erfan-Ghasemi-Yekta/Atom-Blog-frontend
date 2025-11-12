const http = require('http');
const https = require('https');

const API_BASE_URL = 'http://atom-game.ir:8000';
const API_TOKEN = process.env.ATOM_GAME_API_TOKEN; // Store your token securely

const server = http.createServer((req, res) => {
  const { method, url, headers } = req;
  const apiPath = url.startsWith('/api/') ? url.substring(4) : url;

  const options = {
    hostname: 'atom-game.ir',
    port: 8000,
    path: `/api/${apiPath}`,
    method,
    headers: {
      ...headers,
      'Authorization': `Bearer ${API_TOKEN}`,
      'Host': 'atom-game.ir'
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error('Proxy request error:', err);
    res.statusCode = 500;
    res.end('Proxy request error');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
