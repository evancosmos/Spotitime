import './App.css';
import './Components/timeForm'

function App() {
  return (
    <div className="App">
      <div className='WelcomeHead'>
        Welcome to Spotitime
        <div className='WelcomeSub'>
          Enter in a time, and we'll make queue up music for that long
        </div>
      </div>

    <timeEntry></timeEntry>

    </div>
  );
}

export default App;
