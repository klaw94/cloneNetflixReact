import React, { useState, useEffect, useRef, useContext } from "react";
import requests from '../request'
import instance from '../axios'
import likeblack from '../assets/like-white.png';
import likewhite from '../assets/like-black.png';
import dislikeblack from "../assets/dislike-white.png"
import loveblack from "../assets/heart-white.png"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import MoviePopUp from "./MoviePopUp/MoviePopUp";
import VideoPlayer from "./VideoPlayer/VideoPlayer"


export default function MovieCard(props){
    const [detailedInfo, setDetailInfo] = useState([])
    const [keywords, setKeywords] = useState([])
    const ref = useRef()
    const [isInMyList, setIsInMyList] = useState(false)
    const [needsToSendMyListRequest, setNeedsToSendMyListRequest] = useState(false)
    const [needsToSendLikedRequest, setNeedsToSendLikedRequest] = useState(false)
    const [similarMoviesToSendToMyList, setSimilarMoviesToSendToMyList] = useState([])
    const [isLiked, setIsLiked] = useState(false)
  

    useEffect(() => {
      // the handler for actually showing the prompt
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
      const handler = event => {
        event.preventDefault();
        event.returnValue = '';
      };
      if (needsToSendMyListRequest || similarMoviesToSendToMyList.length > 0 || needsToSendLikedRequest === true) {
        window.addEventListener('beforeunload', handler);
        // clean it up, if the dirty state changes
        return () => {
          window.removeEventListener('beforeunload', handler);
        };
      }
      // since this is not dirty, don't do anything
      return () => {};
    }, [needsToSendMyListRequest, similarMoviesToSendToMyList, needsToSendLikedRequest]);

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

      useEffect(()=>{
        if (props.likedFilms){
          for(let i = 0; i < props.likedFilms.length; i++){
            if(props.fetchId === props.likedFilms[i].id){
              setIsLiked(true);
              return;
            }
          }
        }
      }, [])

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
        visualKeywords = keywords.results.map((keyword, index) => {
          if (index < 3){
            return(
              <span key={keyword.id}>{keyword.name} {index < keyword.length - 1 || index !== 2 ? " · " : ""}</span>
          );
          } else{
            return
          }
       
        }) 
      }
    } else {
      if(keywords.keywords) {
        visualKeywords = keywords.keywords.map((keyword, index) => {
          if (index < 3){
            return(
              <span key={keyword.id}>{keyword.name} {index < keyword.length - 1 || index !== 2 ? " · " : ""}</span>
          );
          } else{
            return
          }
       
        }) 
      }
    }
    
    function toggleNeedsToBeSendToMyList(){
      setNeedsToSendMyListRequest(true)
      setIsInMyList(prevValue => !prevValue)
    }

    function toggleNeedsToBeSendToLikedFilms(){
      setNeedsToSendLikedRequest(true)
      setIsLiked(prevValue => !prevValue)
    }

    //I cant send the films to the api automatically, because then the pop up closes. So I need to do this function every time the pop up closes. 
    function handleMyListSubmission(id, mediaType, image){
      addOrRemoveMyFilm(id, mediaType, image)
      addOrRemoveSimilarMovies()
      addOrRemoveLikedMovies()
    }

    function addFilmsToTheListOfSimilarMoviesToMyList(id, mediaType, image){
      if(similarMoviesToSendToMyList.length === 0){
        setSimilarMoviesToSendToMyList(prevValue=>[...prevValue, {id: id, mediaType : mediaType, backdrop_path: image}])
      } else{
      for(let i = 0; i < similarMoviesToSendToMyList.length; i++){
        if(id === similarMoviesToSendToMyList[i].id){
          setSimilarMoviesToSendToMyList(prevValue => prevValue.filter(film=> film.id != id))
          return;
        } else if (id !== similarMoviesToSendToMyList[i].id && i === similarMoviesToSendToMyList.length - 1){
          setSimilarMoviesToSendToMyList(prevValue=>[...prevValue, {id: id, mediaType : mediaType, backdrop_path: image}])

        }
      }
     }
    }

    function addOrRemoveMyFilm(id, mediaType, image){
      if(needsToSendMyListRequest){
        for(let i = 0; i < props.myList.length; i++){
          if(isInMyList === false && props.fetchId === props.myList[i].id){
            props.removeListFunction(props.fetchId, 0);
            return;
          } else if(isInMyList === true && props.fetchId === props.myList[i].id){
            return;

          } else if (isInMyList === true && i === props.myList.length -1){
            props.myListFunction(props.fetchId, 0, props.mediaType, detailedInfo.backdrop_path)
          }
        }
      }
    }

  function addOrRemoveSimilarMovies(){
    console.log(similarMoviesToSendToMyList)
    for(let i = 0; i < similarMoviesToSendToMyList.length; i++){
      for(let x = 0; x < props.myList.length; x++){
        if(similarMoviesToSendToMyList[i].id === props.myList[x].id){
          props.removeListFunction(similarMoviesToSendToMyList[i].id, 0);
          return;
        } else if (x === props.myList.length -1){
          props.myListFunction(similarMoviesToSendToMyList[i].id, 0, similarMoviesToSendToMyList[i].mediaType, similarMoviesToSendToMyList[i].backdrop_path)
        }
      }
    }
  }

  function addOrRemoveLikedMovies(){
    if(needsToSendLikedRequest){
      for(let i = 0; i < props.likedFilms.length; i++){
        if(isLiked === false && props.fetchId === props.likedFilms[i].id){
          props.stopLikingAFilm(props.fetchId, 0);
          return;
        } else if(isLiked === true && props.fetchId === props.likedFilms[i].id){
          return;

        } else if (isLiked === true && i === props.likedFilms.length -1){
          props.likeFilm(props.fetchId, 0, props.mediaType, "liked")
        }
      }
    }
  }


    return(
    <div className="card" ref={ref}>
      <Popup trigger={<img className="movieCard" src={props.link}/>} modal>
        <VideoPlayer apiCall={`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}?api_key=${requests.apiKey}&language=en-US`}/>
      </Popup> 
      
      <div className="movieInfo">
        <div className="movieEmojisDiv">
          <div className="movieEmojisLeft">
          <Popup trigger={<div className="emoji">▶</div>}  modal>
              <VideoPlayer apiCall={`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}?api_key=${requests.apiKey}&language=en-US`}/>
            </Popup> 
             {isInMyList ?
              <div className="emoji" onClick={() => props.removeListFunction(detailedInfo.id, 0)}>✔</div> :
              <div className="emoji" onClick={() => props.myListFunction(detailedInfo.id, 0, props.mediaType, detailedInfo.backdrop_path)}>+</div>}
             {isLiked ? 
              <div className="emoji" onClick={()=>props.stopLikingAFilm(detailedInfo.id, 0)}><img src={likewhite} alt="" className="likeButton" /></div> : 
              <div className="emojiDiv">
                <div className="emoji invisible" onClick={()=>props.likeFilm(detailedInfo.id, 0, props.mediaType, "loved")}><img src={loveblack} alt="" className="likeButton" /></div>
                <div className="emoji" onClick={()=>props.likeFilm(detailedInfo.id, 0, props.mediaType, "liked")}><img src={likeblack} alt="" className="likeButton" /></div>
                <div className="emoji invisible" onClick={()=>props.likeFilm(detailedInfo.id, 0, props.mediaType, "disliked")}><img src={dislikeblack} alt="" className="likeButton" /></div>
              </div>}
            </div>
            <Popup trigger={<div className="emoji vEmoji">˅</div>} onClose={handleMyListSubmission}  modal>
              <MoviePopUp data={detailedInfo} 
                contentRating={contentRating} 
                contentRatingClass={contentRatingClass} 
                mediaType={props.mediaType} 
                runtime={runtime} 
                keywords={props.mediaType === "tv" ? keywords.results : keywords.keywords}
                toggleFunction={toggleNeedsToBeSendToMyList}
                addFilmsToTheListOfSimilarMoviesToMyList={addFilmsToTheListOfSimilarMoviesToMyList}
                myList={props.myList}
                isInMyList={isInMyList}
                toggleLikeFunction={toggleNeedsToBeSendToLikedFilms}
                likedFilms={props.likedFilms}
                isLiked={isLiked}/>
            </Popup>  
        </div>
        <div className="ratingTimeDiv">
          <div className={`contentRating ${contentRatingClass}`}>{contentRating}</div>
          <div className="runtime">{runtime}</div>
        </div>
        <div className="keywords">
          {visualKeywords}
          </div>
        </div>
      {/* {videoIsPlaying && <VideoPlayer video/>} */}
    </div>
    )
}