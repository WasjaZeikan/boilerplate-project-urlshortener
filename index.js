require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.use(express.json());

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [];
let len = 1;
app.post('/api/shorturl', (req, res) => {
  try {
    const url = new URL(req.body.url);
    const result = {original_url: url.href, short_url: len};
    urls.push(result);
    len += 1;
    res.status(202);
    res.json(result);
    return;
  } catch(err) {
    console.error(err);
    if (err instanceof TypeError) {
      res.json({ error: 'invalid url' });
    }
  }
});

const DEFAULT_URL = 'https://freeCodeCamp.org';
app.get('/api/shorturl/:short_url', (req, res) => {
  const url = urls.find((obj) => obj.short_url === parseInt(req.params.short_url));
  if (url) res.redirect(url.original_url);
  else res.redirect(DEFAULT_URL);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
