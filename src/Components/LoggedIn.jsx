import React from 'react'
import { useState } from 'react';
import './LoggedIn.css'

export default function LoggedIn(props) {
    const [timeEntered, setTime] = useState(0);

    return (
        <div>
            <div className='LogOutBtn' onClick={() => props.logoutFunc()}>Logout</div>

            <div className="form">
              <label>Enter how many milliseconds to make the playlist:
                  <input type="number" value={timeEntered} onChange={e => setTime(e.target.value)}/>
              </label>
              <button onClick={() => props.makePlayListFunc(timeEntered)}>Make me a list!</button>
            </div>

        <div className='Results'>
            {props.nameSongs.length > 0 ? "We've made a playlist on your account with the following songs:" : ""}

            {props.nameSongs.map(item => 
                <li className='ResultsItems' key={item}>{item}</li>
            )}
        </div>
    </div>
    )
}
