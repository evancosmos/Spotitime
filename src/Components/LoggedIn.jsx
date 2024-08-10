import React, { useEffect } from 'react'
import { useState } from 'react';
import { Bars } from 'react-loader-spinner';
import getRandomSearch from '../utils/randomId';
import './LoggedIn.css'
import SingleTrack from './singleTrack';

export default function LoggedIn(props) {
    const [minsEntered, setMins] = useState(0);
    const [secsEntered, setSecs] = useState(0);
    const [minsDis, setMinsDis] = useState(0);
    const [secsDis, setSecsDis] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [playlistDur, setPlaylistDur] = useState(0);
    //const [randSong, setRandomSong] = useState("")
    const [songData, setSongData] = useState([])

    useEffect(() => {
        let timeIn = playlistDur
        setMinsDis(Math.floor((timeIn/1000)/60))
        setSecsDis(Math.floor((timeIn/1000) % 60))
    }, [playlistDur])

    const getSongsToTime = (timeEntered) => {
        setIsLoading(true);
        let innerDuration = timeEntered

        let songArrUri = [] //URI Data is seperate to easily send out to spotify API
        let songData = []

        const maxErrorMS = 30000 // +/- Error Range for playlist length vs playlist requested length. Lower range means higher search time.
        let errorAcum = 0;
    
        //id of "short songs" playlist: 4VQfkbHBOMUfhy2394RqdP
        
        async function gettingTracks(){
          while(innerDuration > maxErrorMS){
            let randomId = getRandomSearch()
            let subDuration = 0
            await props.spotify.search(randomId, ["track"])
              .then(
                // eslint-disable-next-line
                (data) => {
                  let item = data.tracks.items[0]
                  subDuration = item.duration_ms
    
                  if((innerDuration - subDuration) < (0-maxErrorMS)){
                    subDuration = 15000 //Subtracting innerDuration by 15seconds stops infinite loops
                    errorAcum += 15000
                  }
                  else{ //Here's where valid song data is added
                    songData.push([item.name, item.album.images[0].url])
                    songArrUri.push(item.uri)
                  }
                },
                (err) => console.log(err)
              )
            
            innerDuration = innerDuration - subDuration
          }
        }
          
        gettingTracks().then(
          () => {
            setPlaylistDur(timeEntered - innerDuration - errorAcum)
            setSongData(songData)
            makePlayList(songArrUri)
            setIsLoading(false)
          }
        )
    }
    
    const makePlayList = (songArrUris) => {
        props.spotify.createPlaylist(props.user.id, {"name": "Spotitime - Musical Timer"})
        .then(
            (data) => {
            //populate platlist with durSongs array
            props.spotify.addTracksToPlaylist(data.id, songArrUris)
            },
            (err) => console.log(err)
        )
    }

    return (
        <div>
            <div className='LogOutBtn' onClick={() => props.logoutFunc()}>Logout</div>

            <div className="form">
              <label>Enter how long to make the playlist:
                  <input type="text" value={minsEntered} placeholder="0" size="2" onChange={e => setMins(e.target.value)}/>Minutes
                  <input type="text" value={secsEntered} placeholder="0" size="2" onChange={e => setSecs(e.target.value)}/>Seconds
              </label>
              { isLoading ?
              <Bars height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperClass='loadingBars' visible={true}/>
               : 
               <div className='makeListBtn' onClick={() => getSongsToTime((parseInt(minsEntered) * 60 * 1000) + (parseInt(secsEntered) * 1000))}>Make me a list!</div> }
            </div>

        <div className='Results'>
            <span className='ResultsHeader'>
                {songData.length > 0 ? "We've made a playlist of length " + minsDis + " mins " + secsDis + " seconds on your spotify account with the following songs:" : <span/> }
            </span>
            {songData.map(item =>
                <li key={item[0]}>
                <SingleTrack albumArtURI={item[1]} songName={item[0]}/>
                </li> 
            )}
        </div>
    </div>
    )
}
