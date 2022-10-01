const secrets = require('./secrets.json')


  
  function getMusic(){
    let spotify = new SpotifyWebApi();

    spotify.setAccessToken(token); //Need token from musicFetch

    spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
        function (data) {
        console.log('Artist albums', data);
        },
        function (err) {
        console.error(err);
        }
    );
}