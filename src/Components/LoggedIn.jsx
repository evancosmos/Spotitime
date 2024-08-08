import React, { useEffect } from 'react'
import { useState } from 'react';
import { Bars } from 'react-loader-spinner';
import './LoggedIn.css'

export default function LoggedIn(props) {
    const [minsEntered, setMins] = useState(0);
    const [secsEntered, setSecs] = useState(0);

    const [minsDis, setMinsDis] = useState(0);
    const [secsDis, setSecsDis] = useState(0);


    useEffect(() => {
        let timeIn = props.playlistDur

        setMinsDis(Math.floor((timeIn/1000)/60))
        setSecsDis(Math.floor((timeIn/1000) % 60))
    }, [props.playlistDur])

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
            {props.nameSongs.length > 0 ? "We've made a playlist of length " + minsDis + " mins " + secsDis + " seconds on your account with the following songs:" : 
                <Bars height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true}/>
            }

            {props.nameSongs.map(item => 
                <li className='ResultsItems' key={item}>{item}</li>
            )}

            <div>
                {props.albArt.map((imgSrc) => (<img src={imgSrc} alt="Album Art N/A"/>))}
            </div>
        </div>
    </div>
    )
}
