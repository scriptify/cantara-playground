import http from 'http';
// import url from 'url'

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
      const json = decodeURIComponent(url.search.slice(1));
      console.log('json', json);
      console.log('url', req.url);
      const obj = JSON.parse(json);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(obj)); //end the response
    } catch (e) {
      console.error(e);
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'not found' })); //end the response
    }
  })
  .listen(3000); //the server object listens on port 8080
