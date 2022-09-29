import { useState } from 'react';
import './TimeForm.css';
import SpotifyWebApi from 'spotify-web-api-js';

export default function TimeForm() {
    const [timeEntered, setName] = useState("");
    
    return (
        <div className="form">
            <form>
                <label>Enter how many minutes to make the music:
                    <input type="number" value={timeEntered} onChange={(e) => setName(e.target.value)}/>
                </label>
                <input type="submit" />
            </form>
            <button type="button" onClick={getMusic}>Click Me!</button> 
        </div>
    )
}

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