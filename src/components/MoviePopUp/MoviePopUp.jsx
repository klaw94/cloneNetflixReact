import React, { useState, useEffect } from "react";
import './MoviePopUp.css'
import likeblack from '../../assets/like-white.png';



export default function MoviePopUp(props){
  console.log(props.data)

  return (
    <div className="moviePopUp">
      <main>
        <img className="popUpImage" src={`https://image.tmdb.org/t/p/w1280/${props.data.backdrop_path}`} alt="" />
        <h3 className="title">{props.data.title}</h3>
        <div className="buttonsOnPicDiv">
          <button>Play</button>
          <div className="emoji">+</div>
          <div className="emoji"><img src={likeblack} alt="" className="likeButton" /></div>
        </div>
      </main>
    </div>
  );
}