import React, { useState, useEffect, useRef, useCallback } from "react";
import requests from '../request'
import instance from '../axios'
import likeblack from '../assets/like-white.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import MoviePopUp from "./MoviePopUp/MoviePopUp";
import VideoPlayer from "./VideoPlayer/VideoPlayer"


export default function MovieCard(props){
    const [detailedInfo, setDetailInfo] = useState([])
    const [keywords, setKeywords] = useState([])
    const ref = useRef()
    const [videoIsPlaying, setVideoIsPlaying] = useState(false)
    const [isInMyList, setIsInMyList] = useState(false)
    // const [left, setLeft] = useState([])

    let contentRatingFetch
    if (props.mediaType && props.mediaType === "tv"){
      contentRatingFetch = `&append_to_response=content_ratings`
    } else {      
      contentRatingFetch = `&append_to_response=release_dates`
    }
    
    useEffect(()=>{
        fetch(`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}?api_key=${requests.apiKey}&language=en-US${contentRatingFetch}`)
            .then(res => res.json())
            .then(data => setDetailInfo(data))
      }, [])

      useEffect(()=>{
        fetch(`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}/keywords?api_key=${requests.apiKey}`)
          .then(res=> res.json())
          .then(data => setKeywords(data))
      }, [detailedInfo])

      useEffect(()=>{
        if (props.myList){
          for(let i = 0; i < props.myList.length; i++){
            if(props.fetchId === props.myList[i].id){
              setIsInMyList(true);
              return;
            }
          }
        }
      }, [])

    console.log(detailedInfo)

      let runtime;
      if (props.mediaType && props.mediaType === "tv" && detailedInfo.number_of_seasons > 1){
        runtime = `${detailedInfo.number_of_seasons} Seasons`
      } else if (props.mediaType === "tv"){
        runtime = `${detailedInfo.number_of_episodes} Episodes`
      } else {      
        runtime = `${Math.floor(detailedInfo.runtime/60)}h ${detailedInfo.runtime%60}mins`
      }
      

      let contentRating;
      let contentRatingClass;
      if (props.mediaType && props.mediaType === "tv" && detailedInfo.content_ratings){
        let UsRating
        //I look for US in the array of age ratings
        for (let i = 0; i < detailedInfo.content_ratings.results.length; i++){
          if (detailedInfo.content_ratings.results[i].iso_3166_1 === "US"){
            UsRating = detailedInfo.content_ratings.results[i].rating
            break
          }
        }

        switch(UsRating) {
          case "TV-Y7":
            contentRating = "+7"
            contentRatingClass = "contentSeven"
            break;
          case "TV-14":
            contentRating = "+13"
            contentRatingClass = "contentThirteen"
            break;
          case "TV-MA":
            contentRating = "+16"
            contentRatingClass = "contentSixteen"
            break;
          default:
            contentRating = "+0"
            contentRatingClass = "contentZero"
            break
        }
      } 
      else if (detailedInfo.release_dates){      
        let UsRating
        //I look for US in the array of age ratings
        for (let i = 0; i < detailedInfo.release_dates.results.length; i++){
          if (detailedInfo.release_dates.results[i].iso_3166_1 === "US"){
            UsRating = detailedInfo.release_dates.results[i].release_dates[0].certification;
            break
          }
        }

        switch(UsRating) {
          case "PG":
            contentRating = "+7"
            contentRatingClass = "contentSeven"
            break;
          case "PG-13":
            contentRating = "+13"
            contentRatingClass = "contentThirteen"
            break;
          case "G":
            contentRating = "+0"
            contentRatingClass = "contentZero"
            break
          default:
            contentRating = "+16"
            contentRatingClass = "contentSixteen"
            break
        }
    }

    let visualKeywords;
    if(props.mediaType === "tv"){
      if(keywords.results){
        visualKeywords = (<div className="keywords">
        {keywords.results.length > 0 && <span> {keywords.results[0].name} </span> }
        {keywords.results.length > 1 && <span>{` · ${keywords.results[1].name}`}</span> }
        {keywords.results.length > 2 && <span>{` · ${keywords.results[2].name}`}</span> }
        </div>)
      }
    } else {
      if(keywords.keywords) {
        visualKeywords = (<div className="keywords">
          {keywords.keywords.length > 0 && <span> {keywords.keywords[0].name} </span> }
          {keywords.keywords.length > 1 && <span>{` · ${keywords.keywords[1].name}`}</span> }
          {keywords.keywords.length > 2 && <span>{` · ${keywords.keywords[2].name}`}</span> }
          </div>)
      }
    }

    // {props.keywords.length > 0 && <span className="popUpKeywordsList"> {props.keywords[0].name}</span>}
    //       {props.keywords.length > 1 && <span className="popUpKeywordsList">, {props.keywords[1].name}</span>}
    //       {props.keywords.length > 2 && <span className="popUpKeywordsList">, {props.keywords[2].name}</span>}


    return(
    <div className="card" ref={ref}>
      <Popup trigger={<img className="movieCard" src={props.link}/>} modal>
        <VideoPlayer apiCall={`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}?api_key=${requests.apiKey}&language=en-US`}/>
      </Popup> 
      
      <div className="movieInfo">
        <div className="movieEmojisDiv">
          <div className="movieEmojisLeft">
          <Popup trigger={<div className="emoji">▶</div>} modal>
              <VideoPlayer apiCall={`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}?api_key=${requests.apiKey}&language=en-US`}/>
            </Popup> 
             {isInMyList ?
              <div className="emoji" onClick={() => props.removeListFunction(detailedInfo.id, 0)}>✔</div> :
              <div className="emoji" onClick={() => props.myListFunction(detailedInfo.id, 0, props.mediaType, detailedInfo.backdrop_path)}>+</div>}
              <div className="emoji"><img src={likeblack} alt="" className="likeButton" /></div>
            </div>
            <Popup trigger={<div className="emoji vEmoji">˅</div>} modal>
              <MoviePopUp data={detailedInfo} contentRating={contentRating} contentRatingClass={contentRatingClass} mediaType={props.mediaType} runtime={runtime} keywords={props.mediaType === "tv" ? keywords.results : keywords.keywords}/>
            </Popup>  
        </div>
        <div className="ratingTimeDiv">
          <div className={`contentRating ${contentRatingClass}`}>{contentRating}</div>
          <div className="runtime">{runtime}</div>
        </div>
          {visualKeywords}
        </div>
      {/* {videoIsPlaying && <VideoPlayer video/>} */}
    </div>
    )
}