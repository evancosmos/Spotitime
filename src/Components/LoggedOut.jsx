import React from 'react'
import secrets from '../secrets.json'
import './LoggedOut.css'

export default function LoggedOut() {
  const CLIENT_ID = secrets["Client ID"]
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "playlist-modify-private playlist-modify-public"

  return (
    <div>
      <div className='WelcomeHead'>
          Welcome to Spotitime
          <div className='WelcomeSub'>
              Enter in a time, and we'll make you a playlist on your spotify account for exactly that long
          </div>
      </div>

    <div className='LogInWrapper'>
        <a className='LogInBtn' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
    </div>
    </div>
  )
}
