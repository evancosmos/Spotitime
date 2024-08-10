import './singleTrack.css'

export default function SingleTrack(props) {



    return (
        <div id='songWrapper'>
            <img id="albArt" src={props.albumArtURI} alt="No Album Art Found"/>
            <div id="songName">{props.songName}</div>
        </div>
    )
}