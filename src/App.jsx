import { useEffect, useState } from 'react';
import secrets from './secrets.json'
import './App.css';
import TimeForm from './Components/TimeForm';
import SpotifyWebApi from 'spotify-web-api-js';
import getRandomSearch from './utils/randomId';

//TODO: Get songs to fill a duration, clean packagejson, split app into more components

function App() {
  const CLIENT_ID = secrets["Client ID"]
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const spotify = new SpotifyWebApi();

  const [token, setToken] = useState("");
  const [username, setUsername] = useState("")
  const [randSong, setRandomSong] = useState("")
  const [durSongs, setDurSongs] = useState([])

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    spotify.setAccessToken(token)
    setToken(token)
    getUser()
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const getUser = () => {
    spotify.getMe()
    .then(
      (data) => setUsername(data.display_name),
      (err) => console.log(err)
    )

  }

  const randomSong = () => {
    let randomId = getRandomSearch()
    spotify.search(randomId, ["track"])
      .then(
        //(data) => console.log(data.tracks.items[0].name),
        (data) => setRandomSong(data.tracks.items[0].duration_ms),
        (err) => console.log(err)
      )
  }

  const getSongsToTime = async (durationMS) => {
    let innerDuration = 1000
    let songArr = []
    let tempCount = 4
    
    //I'd rather install a sink then use async
    async function getTracks() {
      while(tempCount > 0){
        //Get a randomSong
        let randomId = getRandomSearch()
        const serchQuery = await spotify.search(randomId, ["track"])
          .then(
            (data) => {
              //Add it to an array of songs
              songArr.push(data.tracks.items[0].name)
              //Subtract the songs duration from durationMS
              innerDuration = innerDuration - data.tracks.items[0].duration_ms
            },
            (err) => console.log(err)
          )
          console.log(innerDuration)
          tempCount -= 1
      }
    }
    await getTracks()
    setDurSongs(songArr)
  }

  return (
    <div className="App">

      <div className="LoginBtn">
          {/*Depending on if token exists, either have a button to auth or a logout button to clear token*/}
          {
            !token ? 
            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
            : <button onClick={logout}>Logout</button>
          }
      </div>

      <div className='WelcomeHead'>
        Welcome to Spotitime {username}
        <div className='WelcomeSub'>
          Enter in a time, and we'll make queue up music for that long
        </div>
      </div>
      
      <button type={"submit"} onClick={randomSong}>Get a random spotitfy song</button>
      {randSong}

      <TimeForm/>

      <button type={"submit"} onClick={getSongsToTime}>Get array of songs for 1000000 ms</button>
      {durSongs.map(item => 
        <li>{item}</li>
      )}

    </div>
  );
}

export default App;
