import React, { useState, useEffect } from "react";
import './MoviePopUp.css'
import likeblack from '../../assets/like-white.png';
import instance from "../../axios";
import requests from "../../request";


export default function MoviePopUp(props){
  const [cast, setCast] = useState(null)
  console.log(props.data)
  cast && console.log(cast)

  const year = props.data.release_date ? props.data.release_date.slice(0, 4) : props.data.first_air_date.slice(0,4)
  
  useEffect(()=>{
    fetch(`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.data.id}/credits?api_key=${requests.apiKey}`)
        .then(res => res.json())
        .then(data => setCast(data))
  }, [])



  return (
    <div className="moviePopUp">
      <div>
        <main>
          <img className="popUpImage" src={`https://image.tmdb.org/t/p/w1280/${props.data.backdrop_path}`} alt="" />
        </main>
      </div>
      <h3 className="title">{props.data.title ? props.data.title : props.data.original_name}</h3>
      
      <div className="buttonsOnPicDiv">
        <button className="popUpPlayButton">▶ Play</button>
        <div className="emojiPopUp">+</div>
        <div className="emojiPopUp"><img src={likeblack} alt="" className="likeButton likeButtonPopUp" /></div>
      </div>
      <div className="popUpInfoGrid">
        <div className="yearRatingRuntimeDiv">
            <div>{year}</div>
            <div className={`contentRating ${props.contentRatingClass}`}>{props.contentRating}</div>
            <div>{props.runtime}</div>
        </div>
        <div className="synopsis">{props.data.overview}</div>
        <div className="popUp-castGenreKeywordsDiv">
          <div className="cast">Cast : <span className="castNames">{cast && `${cast.cast.length > 0 && cast.cast[0].name}, ${cast.cast.length > 1 && cast.cast[1].name}, ${cast.cast.length > 2 && cast.cast[2].name}, more`}</span></div>
          <div className="genre">Genres: <span className="genresList">{`${props.data.genres[0].name}, ${props.data.genres[1].name}, ${props.data.genres[2].name}, more`}</span></div>
          <div className="popUp-keywords">Belongs to: <span className="popUpKeywordsList">{`${props.keywords.length > 0 && props.keywords[0].name}, ${props.keywords.length > 1 && props.keywords[1].name}, ${props.keywords.length > 2 && props.keywords[2].name}`}</span></div>
        </div>
      </div>
    </div>
  );
}