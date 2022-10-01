import { useEffect, useState } from 'react';
import secrets from './secrets.json'
import './App.css';
import TimeForm from './Components/TimeForm';
import axios from 'axios'
import SpotifyWebApi from 'spotify-web-api-js';

function App() {
  const CLIENT_ID = secrets["Client ID"]
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const spotify = new SpotifyWebApi();

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [username, setUsername] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    spotify.setAccessToken(token)
    getUser()
    setToken(token)
  }, [spotify])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "artist"
        }
    })

    setArtists(data.artists.items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
        <div key={artist.id}>
            {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
            {artist.name}
        </div>
    ))
  }

  const getUser = () => {
    spotify.getMe()
    .then(
      (data) => setUsername(data.display_name),
      (err) => console.log(err)
    )

  }

  return (
    <div className="App">

      <header className="App-header">
          {/*Depending on if token exists, either have a button to auth or a logout button to clear token*/}
          {
            !token ? 
            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
            : <button onClick={logout}>Logout</button>
          }
      </header>

      <div className='WelcomeHead'>
        Welcome to Spotitime {username}
        <div className='WelcomeSub'>
          Enter in a time, and we'll make queue up music for that long
        </div>
      </div>
      
      <form onSubmit={searchArtists}>
    <input type="text" onChange={e => setSearchKey(e.target.value)}/>
    <button type={"submit"}>Search</button>
    </form>

      <TimeForm/>
      {renderArtists()}


    </div>
  );
}

export default App;
