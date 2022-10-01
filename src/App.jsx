import { useEffect, useState } from 'react';
import './App.css';
import TimeForm from './Components/TimeForm';

function App() {
  const [data, setData] = useState("User");

  function handleFetch(){
    fetch('http://localhost:9000/login')
      .then(dataGet => dataGet.json())
      .then((dataGet) => setData(dataGet["token"]));
  }

  useEffect(() => {
    document.title = "Yeet"
  })

  return (
    <div className="App">
      <div className='WelcomeHead' onClick={() => handleFetch()}>
        Welcome to Spotitime {data}
        <div className='WelcomeSub'>
          Enter in a time, and we'll make queue up music for that long
        </div>
      </div>
      
      <TimeForm/>

    </div>
  );
}

export default App;
