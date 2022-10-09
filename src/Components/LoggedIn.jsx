import React from 'react'
import { useState } from 'react';
import './LoggedIn.css'

export default function LoggedIn(props) {
    const [minsEntered, setMins] = useState(0);
    const [secsEntered, setSecs] = useState(0);

    return (
        <div>
            <div className='LogOutBtn' onClick={() => props.logoutFunc()}>Logout</div>

            <div className="form">
              <label>Enter how long to make the playlist:
                  <input type="text" value={minsEntered} placeholder="0" size="2" onChange={e => setMins(e.target.value)}/>Minutes
                  <input type="text" value={secsEntered} placeholder="0" size="2" onChange={e => setSecs(e.target.value)}/>Seconds
              </label>
              <div className='makeListBtn' onClick={() => props.makePlayListFunc((parseInt(minsEntered) * 60 * 1000) + (parseInt(secsEntered) * 1000))}>Make me a list!</div>
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
