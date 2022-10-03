import React from 'react'
import secrets from '../secrets.json'

export default function LoggedOut() {
  const CLIENT_ID = secrets["Client ID"]
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "playlist-modify-private playlist-modify-public"

  return (
    <div>
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
    </div>
  )
}
