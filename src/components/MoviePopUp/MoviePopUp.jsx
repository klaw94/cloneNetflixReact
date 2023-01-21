import React, { useState, useEffect } from "react";
import './MoviePopUp.css'
import likeblack from '../../assets/like-white.png';
import instance from "../../axios";
import requests from "../../request";
import SimilarMoviesList from "../SimilarMoviesList/SimilarMoviesList";


export default function MoviePopUp(props){
  const [cast, setCast] = useState(null)
  // console.log(props.data)
  //console.log(props.data.genres)

  const year = props.data.release_date ? props.data.release_date.slice(0, 4) : props.data.first_air_date.slice(0,4)
  
  useEffect(()=>{
    fetch(`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.data.id}/credits?api_key=${requests.apiKey}`)
        .then(res => res.json())
        .then(data => setCast(data))
  }, [])

 // console.log(props.keywords)
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
        {cast != null && cast.cast.length > 0 && <div className="cast">Cast : 
          {cast != null && cast.cast.length > 0 && <span className="castNames"> {cast.cast[0].name}, </span>}
          {cast != null && cast.cast.length > 1 && <span className="castNames"> {cast.cast[1].name}, </span>}
          {cast != null && cast.cast.length > 2 && <span className="castNames"> {cast.cast[2].name}, </span>}
          <span className="castNames">more</span>
        </div>}
        {props.data.genres.length > 0 && <div className="genre">Genres : 
          {props.data.genres.length > 0 && <span className="genresList"> {props.data.genres[0].name}, </span>}
          {props.data.genres.length > 1 && <span className="genresList"> {props.data.genres[1].name}, </span>}
          {props.data.genres.length > 2 && <span className="genresList"> {props.data.genres[2].name}, </span>}
          <span className="genresList">more</span>
        </div>}
        {props.keywords.length > 0 && <div className="popUp-keywords">Keywords : 
          {props.keywords.length > 0 && <span className="popUpKeywordsList"> {props.keywords[0].name}</span>}
          {props.keywords.length > 1 && <span className="popUpKeywordsList">, {props.keywords[1].name}</span>}
          {props.keywords.length > 2 && <span className="popUpKeywordsList">, {props.keywords[2].name}</span>}
        </div>}
      </div>
    </div>
   <SimilarMoviesList mediaType={props.mediaType} parentTitle={props.data.title ? props.data.title : props.data.original_name} keywords={props.keywords.length > 1 ? props.keywords : []} genre={props.data.genres.length > 1 ? props.data.genres : []}/>
    </div>
  );
}