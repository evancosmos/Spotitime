const express = require('express');
const querystring = require('querystring');
const secrets = require('./secrets.json');
const request = require('request')

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
var client_secret = secrets['Client Secret'];
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

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
      
          // use the access token to access the Spotify Web API
          var token = body.access_token;
          console.log(token)
          /* var options = {
            url: 'https://api.spotify.com/',
            headers: {
              'Authorization': 'Bearer ' + token
            },
            json: true
          };
          request.get(options, function(error, response, body) {
            console.log(body);
          }); */
        }
    })

});

/* app.get('/refresh_token', function(req, res) {

    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  }); */
  