const express = require('express');
const querystring = require('querystring');
const secrets = require('./secrets.json');

const app = express();
var cors = require('cors');

app.use(cors());

const port = 9000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
})

app.get('/api', (req, res) => {
    res.status(200).send({
        id: "2",
        name: "john"
    })
})

var client_id = secrets['Client ID'];
var redirect_uri = 'http://localhost:9000/callback';

app.get('/login', function(req, res) {

  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});

app.get('/callback', function(req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;
  
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
    }
  });