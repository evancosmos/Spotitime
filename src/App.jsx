import { useEffect, useMemo, useState } from 'react';
import './App.css';

//import TimeForm from './Components/TimeForm';
import LoggedOut from './Components/LoggedOut';

import SpotifyWebApi from 'spotify-web-api-js';
import getRandomSearch from './utils/randomId';
import LoggedIn from './Components/LoggedIn';

//TODO: Get songs to fill a more percise duration, clean packagejson, Add playlist/queue option, add hipster option

function App() {
  const spotify = useMemo(() => new SpotifyWebApi(), []);

  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [playlistDur, setPlaylistDur] = useState(0);
  //const [randSong, setRandomSong] = useState("")
  const [nameSongs, setNameSongs] = useState([]) //This is for display info in web app

  useEffect(() => {
    const hash = window.location.hash
    let tokenLocal = window.localStorage.getItem("token")

    if (!tokenLocal && hash) {
        tokenLocal = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", tokenLocal)
    }

    spotify.setAccessToken(tokenLocal)

    spotify.getMe()
    .then(

      //Token valid
      (data) => {
        setUser(data)
        setToken(tokenLocal)
      },

      //Token is no longer valid
      () => {
        setUser("")
        setToken("")
        window.localStorage.removeItem("token")
      }
    )
    
  }, [spotify])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
    setUser("")
  }

  //Random Song Button
/*   const randomSong = () => {
    let randomId = getRandomSearch()
    spotify.search(randomId, ["track"])
      .then(
        //(data) => console.log(data.tracks.items[0].name),
        (data) => setRandomSong(data.tracks.items[0].name),
        (err) => console.log(err)
      )
  }

  <button type={"submit"} onClick={randomSong}>Get a random spotitfy song</button>
      {randSong} */

  const getSongsToTime = (timeEntered) => {
    let innerDuration = timeEntered
    let songArrUri = []
    let songArrName = []
    const maxErrorMS = 30000 // +/- Error Range for playlist length vs playlist requested length. Lower range means higher search time.
    let errorAcum = 0;

    //id of "short songs" playlist: 4VQfkbHBOMUfhy2394RqdP
    
    async function gettingTracks(){
      while(innerDuration > maxErrorMS){
        let randomId = getRandomSearch()
        let subDuration = 0
        await spotify.search(randomId, ["track"])
          .then(
            (data) => {
              let item = data.tracks.items[0]
              subDuration = item.duration_ms

              if((innerDuration - subDuration) < (0-maxErrorMS)){
                subDuration = 15000 //Subtracting innerDuration by 15seconds stops infinite loops
                errorAcum += 15000
              }
              else{
                songArrName.push(item.name)
                songArrUri.push(item.uri)
                songLenDict[item.name] = item
              }
            },
            (err) => console.log(err)
          )
        
        innerDuration = innerDuration - subDuration
      }
    }
      
    gettingTracks().then(
      () => {
        //console.log(songLenDict)
        setPlaylistDur(timeEntered - innerDuration - errorAcum)
        setNameSongs(songArrName)
        makePlaylist(songArrUri)
      }
    )
  }

  const makePlaylist = (songArrUris) => {

    spotify.createPlaylist(user.id, {"name": "Spotitime - Musical Timer"})
    .then(
      (data) => {
        //populate platlist with durSongs array
        spotify.addTracksToPlaylist(data.id, songArrUris)
      },
      (err) => console.log(err)
    )
  }

  return (
    <div className="App">

      <div className='SourceLinkWrapper'>
        <a className='SourceLink' href='https://github.com/evancosmos/Spotitime'>Source Code</a>
      </div>

      <div className='WelcomeHead'>
        Welcome to Spotitime {token ? user.display_name : ""}
        <div className='WelcomeSub'>
        Enter in a time, and we'll make you a playlist on your spotify account for about that long
        </div>
      </div>

      <div className="LoginBtn">
          {//Depending on if token exists, either have a button to auth or a logout button to clear token
            !token ? 
            <LoggedOut/> : 
            <LoggedIn logoutFunc={logout} makePlayListFunc={getSongsToTime} user={user} nameSongs={nameSongs} playlistDur={playlistDur}/>
          }
      </div>

    </div>
  );
}

export default App;
