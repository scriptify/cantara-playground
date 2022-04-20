import http from 'http';
// import url from 'url'

const getManifest = (origin: string, startUrlParams: string = 'jwt=1234') => ({
  icons: [
    {
      src: `${origin}/icon_512x512.15f1c00c4ec01d4d24ab1db001c75113.png`,
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: `${origin}/icon_192x192.d49c64d26c42cc676f3a6297637381de.png`,
      sizes: '192x192',
      type: 'image/png',
    },
  ],
  name: 'Cantara PWA',
  short_name: 'Cantara PWA',
  orientation: 'portrait',
  display: 'standalone',
  start_url: `${origin}/?${startUrlParams}`,
  theme_color: '#000000',
  background_color: '#000000',
});

//create a server object:
http
  .createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      const url = new URL(req.url!, 'http://myapi.com');
      const searchParams = new URLSearchParams(url.search);
      const origin = searchParams.get('origin') ?? '';
      const data = searchParams.get('data') ?? undefined;

      console.log({ data, origin });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(getManifest(origin, data))); //end the response
    } catch (e) {
      console.error(e);
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'not found' })); //end the response
    }
  })
  .listen(3000); //the server object listens on port 8080
