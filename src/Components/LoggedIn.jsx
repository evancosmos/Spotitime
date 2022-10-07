import React from 'react'
import { useState } from 'react';
import './LoggedIn.css'

export default function LoggedIn(props) {
    const [timeEntered, setTime] = useState(0);

    return (
        <div>
            <div className='LogOutBtn' onClick={() => props.logoutFunc()}>Logout</div>

            <div className="form">
            <form>
              <label>Enter how many seconds to make the playlist:
                  <input type="number" value={timeEntered} onChange={e => setTime(e.target.value * 1000)}/>
              </label>
              <button onClick={() => props.makePlayListFunc(timeEntered)}>Make me a list!</button>
            </form>
            </div>

        {props.nameSongs.map(item => 
            <li key={props.nameSongs}>{item}</li>
        )}
    </div>
    )
}
