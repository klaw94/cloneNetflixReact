import React from "react";
import netflixlogo from "../assets/netflixlogo.png"
import avatar from "../assets/Netflix-avatar.png"

export default function Navbar(){
    return(
        <div className="navbar">
            <img src={netflixlogo} className="netflixLogo" />
            <img src={avatar} className="myAvatar" />
        </div>
    )
}