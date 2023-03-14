import React, { useState, useEffect } from "react";
import './HeaderMovie.css'
import instance from "../../axios";
import requests from "../../request";
import VideoPlayer from "../VideoPlayer/VideoPlayer"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import MoviePopUp from "../MoviePopUp/MoviePopUp";


export default function HeaderMovie(props){
    const [mainMovie, setMainMovie] = useState([])
    const [detailedInfo, setDetailInfo] = useState([])
    const [keywords, setKeywords] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [isInMyList, setIsInMyList] = useState(false)
    const [needsToSendMyListRequest, setNeedsToSendMyListRequest] = useState(false)
    const [needsToSendLikedRequest, setNeedsToSendLikedRequest] = useState(false)
    const [similarMoviesToSendToMyList, setSimilarMoviesToSendToMyList] = useState([])

    useEffect(()=>{
        fetch(`${instance}/movie/popular?api_key=${requests.apiKey}&language=en-US&page=1`)
        .then(res => res.json())
        .then(data => {
            setMainMovie(data.results[0])
          }) 
      }, [])

      useEffect(()=>{
        if(mainMovie.id){
            fetch(`${instance}/movie/${mainMovie.id}?api_key=${requests.apiKey}&language=en-US&append_to_response=release_dates`)
                .then(res => res.json())
                .then(data => setDetailInfo(data))

        }
      }, [mainMovie])

      useEffect(()=>{
        fetch(`${instance}/movie/${mainMovie.id}/keywords?api_key=${requests.apiKey}`)
          .then(res=> res.json())
          .then(data => setKeywords(data))
      }, [detailedInfo])

      useEffect(()=>{
        if (props.likedFilms){
          for(let i = 0; i < props.likedFilms.length; i++){
            if(mainMovie.id === props.likedFilms[i].id){
              setIsLiked(props.likedFilms[i].status);
              return;
            }
          }
        }
      }, [])

      useEffect(()=>{
        if (props.myList){
          for(let i = 0; i < props.myList.length; i++){
            if(mainMovie.id === props.myList[i].id){
              setIsInMyList(true);
              return;
            }
          }
        }
      }, [])

      console.log(mainMovie)
      console.log(detailedInfo)


     let runtime = `${Math.floor(detailedInfo.runtime/60)}h ${detailedInfo.runtime%60}mins`

      let contentRating;
      let contentRatingClass;
     if (detailedInfo.release_dates){      
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

    function toggleNeedsToBeSendToMyList(){
        setNeedsToSendMyListRequest(true)
        setIsInMyList(prevValue => !prevValue)
      }
  
      function toggleNeedsToBeSendToLikedFilms(status){
        setNeedsToSendLikedRequest(true)
        setIsLiked(status)
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

      function handleMyListAndLikeSubmission(id, mediaType, image){
        addOrRemoveMyFilm(id, mediaType, image)
        addOrRemoveSimilarMovies()
        addOrRemoveLikedMovies()
      }

      function addOrRemoveMyFilm(id, mediaType, image){
        if(needsToSendMyListRequest){
          for(let i = 0; i < props.myList.length; i++){
            if(isInMyList === false && mainMovie.id === props.myList[i].id){
              props.removeListFunction(mainMovie.id, 0);
              return;
            } else if(isInMyList === true && mainMovie.id === props.myList[i].id){
              return;
  
            } else if (isInMyList === true && i === props.myList.length -1){
              props.myListFunction(mainMovie.id, 0, "movie", detailedInfo.backdrop_path)
            }
          }
        }
      }

      function addOrRemoveSimilarMovies(){
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
            if((isLiked === false) && mainMovie.id === props.likedFilms[i].id){
              props.stopLikingAFilm(mainMovie.id, 0);
              return;
            } else if(isLiked !== false && mainMovie.id === props.likedFilms[i].id){
              if(isLiked !== props.likedFilms[i].status){
                props.updateStatusOfLikedFilm(mainMovie.id, 0, "movie", isLiked)
                return;
              }
            } else if (isLiked !== false && i === props.likedFilms.length -1){
              props.likeFilm(mainMovie.id, 0, "movie", isLiked)
            }
          }
        }
      }
    

    return(
        <div className="headerMovieDiv">
           {mainMovie.backdrop_path && <img src={`https://image.tmdb.org/t/p/original/${mainMovie.backdrop_path}`} />}
           <h1>{mainMovie.original_title}</h1>
           <p>{detailedInfo.overview}</p>
           <div className="header--buttonDiv">
           <Popup trigger={<button className="main--playButton">▶ Play</button>} modal>
                <VideoPlayer apiCall={`${instance}/movie/${mainMovie.id}?api_key=${requests.apiKey}&language=en-US`}/>
            </Popup> 
            <Popup trigger={<button className="main--meerInfo">More information</button>} onClose={handleMyListAndLikeSubmission} modal>
              <MoviePopUp data={detailedInfo} 
                contentRating={contentRating} 
                contentRatingClass={contentRatingClass} 
                mediaType="movie"
                runtime={runtime} 
                keywords={keywords.keywords}
                toggleFunction={toggleNeedsToBeSendToMyList}
                addFilmsToTheListOfSimilarMoviesToMyList={addFilmsToTheListOfSimilarMoviesToMyList}
                myList={props.myList}
                isInMyList={isInMyList}
                toggleLikeFunction={toggleNeedsToBeSendToLikedFilms}
                likedFilms={props.likedFilms}
                isLiked={isLiked}/>
            </Popup>   
               
           </div>
        </div>
    )
}