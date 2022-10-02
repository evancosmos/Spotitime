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
        </div>
    )
}

