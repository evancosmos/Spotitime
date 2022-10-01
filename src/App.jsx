import { useEffect, useState } from 'react';
import './App.css';
import TimeForm from './Components/TimeForm';
import SpotifyWebApi from 'spotify-web-api-js';
const spotify = new SpotifyWebApi;

function App() {

  const [token, setToken] = useState("");

  function fetchData(){
    fetch('http://localhost:9000/login', {
      headers: {
        'Access-Control-Allow-Origin' : '*'
      }
    })
      .then(dataGet => dataGet.json())
      .then((dataGet) => setToken(dataGet["token"]));
  }

  useEffect(() => {
    document.title = "Yeet"
  })

  return (
    <div className="App">
      <div className='WelcomeHead' onClick={() => fetchData()}>
        Welcome to Spotitime {token}
        <div className='WelcomeSub'>
          Enter in a time, and we'll make queue up music for that long
        </div>
      </div>
      
      <TimeForm/>

    </div>
  );
}

export default App;
