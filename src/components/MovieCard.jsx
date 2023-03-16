import React, { useState, useEffect, useRef, useContext } from "react";
import requests from '../request'
import instance from '../axios'
import likeblack from '../assets/like-white.png';
import likewhite from '../assets/like-black.png';
import dislikeblack from "../assets/dislike-white.png"
import dislikewhite from "../assets/dislike-black.png"
import loveblack from "../assets/heart-white.png"
import lovewhite from "../assets/heart-black.png"
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
              setIsLiked(props.likedFilms[i].status);
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

    function toggleNeedsToBeSendToLikedFilms(status){
      setNeedsToSendLikedRequest(true)
      setIsLiked(status)
    }

    //I cant send the films to the api automatically, because then the pop up closes. So I need to do this function every time the pop up closes. 
    function handleMyListAndLikeSubmission(id, mediaType, image){
      addOrRemoveMyFilm(id, mediaType, image)
      addOrRemoveSimilarMovies()
      addOrRemoveLikedMovies()
    }

    function addFilmsToTheListOfSimilarMoviesToMyList(id, mediaType, image, genres){//HERE
      if(similarMoviesToSendToMyList.length === 0){
        setSimilarMoviesToSendToMyList(prevValue=>[...prevValue, {id: id, mediaType : mediaType, backdrop_path: image, genres: genres}])
      } else{
        for(let i = 0; i < similarMoviesToSendToMyList.length; i++){
          if(id === similarMoviesToSendToMyList[i].id){
            setSimilarMoviesToSendToMyList(prevValue => prevValue.filter(film=> film.id != id))
            return;
          } else if (id !== similarMoviesToSendToMyList[i].id && i === similarMoviesToSendToMyList.length - 1){
            setSimilarMoviesToSendToMyList(prevValue=>[...prevValue, {id: id, mediaType : mediaType, backdrop_path: image,  genres: genres}])
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
            handleAddToList(props.fetchId, 0, props.mediaType, detailedInfo.backdrop_path, detailedInfo.genres)
          }
        }
      }
    }

  function addOrRemoveSimilarMovies(){
    for(let i = 0; i < similarMoviesToSendToMyList.length; i++){
      for(let x = 0; x < props.myList.length; x++){
        if(similarMoviesToSendToMyList[i].id === props.myList[x].id){
          props.removeListFunction(similarMoviesToSendToMyList[i].id, 0);//HERE
          return;
        } else if (x === props.myList.length -1){
          handleAddToList(similarMoviesToSendToMyList[i].id, 0, similarMoviesToSendToMyList[i].mediaType, similarMoviesToSendToMyList[i].backdrop_path, similarMoviesToSendToMyList[i].genres)
        }
      }
    }
  }
  
  let visibleButton
  if(isLiked === "liked"){
   visibleButton = (<div className="emoji selected" onClick={()=>handleStopLikingAFilm(detailedInfo.id, 0)}><img src={likewhite} alt="" className="likeButton" /></div>)
  } else if(isLiked === "disliked"){
    visibleButton = (<div className="emoji selected" onClick={()=>handleStopLikingAFilm(detailedInfo.id, 0)}><img src={dislikewhite} alt="" className="likeButton" /></div>)
  } else if(isLiked === "loved"){
    visibleButton =(<div className="emoji selected" onClick={()=>handleStopLikingAFilm(detailedInfo.id, 0)}><img src={lovewhite} alt="" className="likeButton" /></div>)
  }

  function addOrRemoveLikedMovies(){
    if(needsToSendLikedRequest){
      for(let i = 0; i < props.likedFilms.length; i++){
        if((isLiked === false) && props.fetchId === props.likedFilms[i].id){
          handleStopLikingAFilm(props.fetchId, 0);
          return;
        } else if(isLiked !== false && props.fetchId === props.likedFilms[i].id){
          if(isLiked !== props.likedFilms[i].status){
            handleUpdateLikeStatus(props.fetchId, 0, props.mediaType, isLiked)//HERE
            return;
          }
        } else if (isLiked !== false && i === props.likedFilms.length -1){
          handleLikingAFilm(props.fetchId, 0, props.mediaType, isLiked)//HERE
        }
      }
    }
  }


  function handleAddToList(id, employeeid, mediaType, backdrop_path, myGenres){
    props.myListFunction(id, employeeid, mediaType, backdrop_path)//HERE
    for(let i = 0; i < myGenres.length; i++){
      props.likeAGenre(employeeid, myGenres[i].id, myGenres[i].name, "list")
    }
  }

  function handleStopLikingAFilm(id, employeeid, originalStatus){
    let status;
    switch(originalStatus) {
      case "liked":
        status = "disliked"
        break;
      case "loved":
        status = "stoplove"
        break;
      case "disliked":
        status = "liked"
        break;
      default:
        status = ""
    }
  
    props.stopLikingAFilm(detailedInfo.id, 0)
    for(let i = 0; i < detailedInfo.genres.length; i++){
      props.likeAGenre(employeeid, detailedInfo.genres[i].id, detailedInfo.genres[i].name, status)
    }
  }

  function handleUpdateLikeStatus(id, employeeid, mediaType, status){
    props.updateStatusOfLikedFilm(id, employeeid, mediaType, status)
    for(let i = 0; i < detailedInfo.genres.length; i++){
      console.log(`change my liking of ${detailedInfo.genres[i].name}`)
      props.likeAGenre(employeeid, detailedInfo.genres[i].id, detailedInfo.genres[i].name, status)
    }
  }

  function handleLikingAFilm(id, employeeid, mediaType, status){
    props.likeFilm(id, employeeid, mediaType, status)
    for(let i = 0; i < detailedInfo.genres.length; i++){
      console.log(`change my liking of ${detailedInfo.genres[i].name}`)
      props.likeAGenre(employeeid, detailedInfo.genres[i].id, detailedInfo.genres[i].name, status)
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
              <div className="emoji list" onClick={() => props.removeListFunction(detailedInfo.id, 0)}>✔</div> :
              <div className="emoji list" onClick={() => handleAddToList(detailedInfo.id, 0, props.mediaType, detailedInfo.backdrop_path, detailedInfo.genres)}>+</div>}
             {isLiked ? 
                <div className="emojiDiv">
                <div className="emoji invisible one" 
                  onClick={()=>{isLiked === "loved" ? handleStopLikingAFilm(detailedInfo.id, 0, isLiked) : handleUpdateLikeStatus(detailedInfo.id, 0, props.mediaType, "loved")}}><img src={isLiked === "loved" ? lovewhite : loveblack} alt="" className="likeButton" /></div>
                <div className="emoji invisible three" 
                  onClick={()=>{isLiked === "liked" ? handleStopLikingAFilm(detailedInfo.id, 0, isLiked) : handleUpdateLikeStatus(detailedInfo.id, 0, props.mediaType, "liked") }}><img src={isLiked === "liked" ? likewhite : likeblack} alt="" className="likeButton" /></div>
                <div className="emoji invisible two" 
                  onClick={()=>{isLiked === "disliked" ?  handleStopLikingAFilm(detailedInfo.id, 0, isLiked) : handleUpdateLikeStatus(detailedInfo.id, 0, props.mediaType, "disliked")}}><img src={isLiked === "disliked" ? dislikewhite : dislikeblack} alt="" className="likeButton" /></div>
                {visibleButton}
              </div> : 
              <div className="emojiDiv">
                <div className="emoji invisible one" onClick={()=>handleLikingAFilm(detailedInfo.id, 0, props.mediaType, "loved")}><img src={loveblack} alt="" className="likeButton" /></div>
                <div className="emoji main" onClick={()=>handleLikingAFilm(detailedInfo.id, 0, props.mediaType, "liked")}><img src={likeblack} alt="" className="likeButton" /></div>
                <div className="emoji invisible two" onClick={()=>handleLikingAFilm(detailedInfo.id, 0, props.mediaType, "disliked")}><img src={dislikeblack} alt="" className="likeButton" /></div>
              </div>}
            </div>
            <Popup trigger={<div className="emoji vEmoji">˅</div>} onClose={handleMyListAndLikeSubmission}  modal>
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