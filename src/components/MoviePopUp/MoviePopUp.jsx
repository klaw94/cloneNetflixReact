import React, { useState, useEffect } from "react";
import './MoviePopUp.css'
import likeblack from '../../assets/like-white.png';
import instance from "../../axios";
import requests from "../../request";
import SimilarMoviesList from "../SimilarMoviesList/SimilarMoviesList";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import VideoPlayer from "../VideoPlayer/VideoPlayer"
import likewhite from '../../assets/like-black.png';
import dislikeblack from "../../assets/dislike-white.png"
import dislikewhite from "../../assets/dislike-black.png"
import loveblack from "../../assets/heart-white.png"
import lovewhite from "../../assets/heart-black.png"



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

  let visualCast
  if(cast != null){
    visualCast = cast.cast.map((actor, index) => {
      if (index < 3){
        return(
          <span className="castNames" key={actor.id}>{actor.name}{index < cast.length - 1 || index !== 3 ? ", " : ""}</span>
      );
      } else{
        return
      }
   
    }) 
  }

const visualGenres = props.data.genres.map((genre, index) => {
  if (index < 3){
    return(
      <span className="genresList" key={genre.id}>{genre.name}{index < props.data.genres.length - 1 || index !== 3 ? ", " : ""}</span>
  );
  } else{
    return
  }

})

const visualKeywords = props.keywords.map((keyword, index) => {
  if (index < 3){
    return(
      <span className="popUpKeywordsList" key={keyword.id}>{keyword.name}{index <  props.keywords.length - 1 || index !== 3 ? ", " : ""}</span>
  );
  } else{
    return
  }

})

function handleClick(){
  props.toggleFunction()
}

let visibleButton
if(props.isLiked === "liked"){
 visibleButton = (<div className="emojiPopUp popUpSelected" onClick={()=>props.toggleLikeFunction(false)}><img src={likewhite} alt="" className="likeButton likeButtonPopUp" /></div>)
} else if(props.isLiked === "disliked"){
  visibleButton = (<div className="emojiPopUp popUpSelected" onClick={()=>props.toggleLikeFunction(false)}><img src={dislikewhite} alt="" className="likeButton likeButtonPopUp" /></div>)
} else if(props.isLiked === "loved"){
  visibleButton =(<div className="emojiPopUp popUpSelected" onClick={()=>props.toggleLikeFunction(false)}><img src={lovewhite} alt="" className="likeButton likeButtonPopUp" /></div>)
}


 
  return (
    <div className="moviePopUp">
      <div>
        <main>
          <img className="popUpImage" src={`https://image.tmdb.org/t/p/w1280/${props.data.backdrop_path}`} alt="" />
        </main>
      </div>
      <h3 className="title">{props.data.title ? props.data.title : props.data.original_name}</h3>
      
      <div className="buttonsOnPicDiv">
        <Popup trigger={<button className="popUpPlayButton">▶ Play</button>} modal>
          <VideoPlayer apiCall={`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.data.id}?api_key=${requests.apiKey}&language=en-US`}/>
        </Popup> 
        {props.isInMyList ?
              <div className="emojiPopUp" onClick={handleClick}>✔</div> :
              <div className="emojiPopUp" onClick={handleClick}>+</div>}
        {/* {props.isLiked ? 
           <div className="emojiPopUp" onClick={props.toggleLikeFunction}><img src={likewhite} alt="" className="likeButton likeButtonPopUp" /></div> : 
           <div className="emojiPopUp" onClick={props.toggleLikeFunction}><img src={likeblack} alt="" className="likeButton likeButtonPopUp" /></div>} */}
        {props.isLiked ? 
                <div className="popUpEmojiDiv">
                <div className="emojiPopUp invisible popOne" onClick={()=>{props.isLiked === "loved" ? props.toggleLikeFunction(false) : props.toggleLikeFunction("loved")}}><img src={props.isLiked === "loved" ? lovewhite : loveblack} alt="" className="likeButton likeButtonPopUp" /></div>
                <div className="emojiPopUp invisible popThree" onClick={()=>{props.isLiked === "liked" ? props.toggleLikeFunction(false) : props.toggleLikeFunction("liked")}}><img src={props.isLiked === "liked" ? likewhite : likeblack} alt="" className="likeButton likeButtonPopUp" /></div>
                <div className="emojiPopUp invisible popTwo" onClick={()=>{props.isLiked === "disliked" ?  props.toggleLikeFunction(false) : props.toggleLikeFunction("disliked")}}><img src={props.isLiked === "disliked" ? dislikewhite : dislikeblack} alt="" className="likeButton likeButtonPopUp" /></div>
                {visibleButton}
              </div> : 
              <div className="popUpEmojiDiv">
                <div className="emojiPopUp invisible popOne" onClick={()=>props.toggleLikeFunction("loved")}><img src={loveblack} alt="" className="likeButton likeButtonPopUp" /></div>
                <div className="emojiPopUp popMain" onClick={()=>props.toggleLikeFunction("liked")}><img src={likeblack} alt="" className="likeButton likeButtonPopUp" /></div>
                <div className="emojiPopUp invisible popTwo" onClick={()=>props.toggleLikeFunction("disliked")}><img src={dislikeblack} alt="" className="likeButton likeButtonPopUp" /></div>
              </div>}
      </div>
      <div className="popUpInfoGrid">
        <div className="yearRatingRuntimeDiv">
            <div>{year}</div>
            <div className={`contentRating ${props.contentRatingClass}`}>{props.contentRating}</div>
            <div>{props.runtime}</div>
        </div>
        <div className="synopsis">{props.data.overview}</div>
        <div className="popUp-castGenreKeywordsDiv">
        {cast != null && cast.cast.length > 0 && <div className="cast">Cast: {" "}
          {visualCast}
          <span className="castNames">more</span>
        </div>}
        {props.data.genres.length > 0 && <div className="genre">Genres:  {" "}
          {visualGenres}
          <span className="genresList">more</span>
        </div>}
        {props.keywords.length > 0 && <div className="popUp-keywords">Keywords: {" "}
        {visualKeywords}
        <span className="popUpKeywordsList">more</span>
        </div>}
      </div>
    </div>
   <SimilarMoviesList 
    mediaType={props.mediaType} 
    parentTitle={props.data.title ? props.data.title : props.data.original_name} 
    keywords={props.keywords.length > 1 ? props.keywords : []} 
    genre={props.data.genres.length > 0 ? props.data.genres : []}
    myList={props.myList}
    addFilmsToTheListOfSimilarMoviesToMyList={props.addFilmsToTheListOfSimilarMoviesToMyList}

    />
    </div>
  );
}