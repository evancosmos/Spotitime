import { useEffect, useMemo, useState } from 'react';
import './App.css';
import LoggedOut from './Components/LoggedOut';
import SpotifyWebApi from 'spotify-web-api-js';
import LoggedIn from './Components/LoggedIn';

//TODO: Get songs to fill a more percise duration, clean packagejson, Add playlist/queue option, add hipster option

function App() {
  const spotify = useMemo(() => new SpotifyWebApi(), []);

  const [token, setToken] = useState("");
  const [user, setUser] = useState("");

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
            <LoggedIn logoutFunc={logout} user={user} spotify={spotify}/>
          }
      </div>

    </div>
  );
}

export default App;
