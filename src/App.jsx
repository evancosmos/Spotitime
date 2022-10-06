import { useEffect, useMemo, useState } from 'react';
import './App.css';

//import TimeForm from './Components/TimeForm';
import LoggedOut from './Components/LoggedOut';

import SpotifyWebApi from 'spotify-web-api-js';
import getRandomSearch from './utils/randomId';
import LoggedIn from './Components/LoggedIn';

//TODO: Fix await issues, Get songs to fill a more percise duration, clean packagejson, split app into more components, Add playlist/queue option, add hipster option

function App() {
  const spotify = useMemo(() => new SpotifyWebApi(), []);

  const [token, setToken] = useState("");
  const [user, setUser] = useState("")
  const [randSong, setRandomSong] = useState("")
  const [nameSongs, setNameSongs] = useState([]) //This is for display info in web app
  const [timeEntered, setTime] = useState(0);

  useEffect(() => {
    const hash = window.location.hash
    let tokenLocal = window.localStorage.getItem("token")

    if (!tokenLocal && hash) {
        tokenLocal = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", tokenLocal)
    }

    spotify.setAccessToken(tokenLocal)

    const getUser = () => {
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
    }
    getUser();

  }, [spotify, token])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
    setUser("")
  }

  const randomSong = () => {
    let randomId = getRandomSearch()
    spotify.search(randomId, ["track"])
      .then(
        //(data) => console.log(data.tracks.items[0].name),
        (data) => setRandomSong(data.tracks.items[0].name),
        (err) => console.log(err)
      )
  }

  const getSongsToTime = () => {
    let innerDuration = timeEntered
    let songArrUri = []
    let songArrName = []

    let randomId = getRandomSearch()
    
    //Still only runs on second go
    spotify.search(randomId, ["track"])
      .then(
        (data) => {
          let item = data.tracks.items[0]
          //Add it to an array of songs
          songArrUri.push(item.uri)
          songArrName.push(item.name)
          //Subtract the songs duration from durationMS
          innerDuration = innerDuration - item.duration_ms
        },
        (err) => console.log("token on error is " + token )
      )
      .then(
        () => {
          setNameSongs(songArrName)
          makePlaylist(songArrUri)
        }
      )
  }

  const makePlaylist = (songArrUris) => {

    spotify.createPlaylist(user.id, {"name": "Spotitime2022"})
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

      <div className="LoginBtn">
          {//Depending on if token exists, either have a button to auth or a logout button to clear token
            !token ? <LoggedOut/> : <LoggedIn logoutFunc={logout} user={user}/>
          }
      </div>

      <button type={"submit"} onClick={randomSong}>Get a random spotitfy song</button>
      {randSong}

      <div className="form">
          <form>
              <label>Enter how many milliseconds to make the music:
                  <input type="number" value={timeEntered} onChange={e => setTime(e.target.value)}/>
              </label>
              <button onClick={getSongsToTime}>Make me a list!</button>
          </form>
      </div>

      {nameSongs.map(item => 
        <li key={nameSongs}>{item}</li>
      )}

    </div>
  );
}

export default App;
