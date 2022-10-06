import React from 'react'

export default function LoggedIn(props) {

    

    return (
        <div>
            <div className='WelcomeHead'>
                Welcome to Spotitime {props.user.display_name}
                <div className='WelcomeSub'>
                Enter in a time, and we'll make queue up music for that long
                </div>
            </div>

            <button onClick={() => props.logoutFunc()}>Logout</button>
        </div>
    )
}
