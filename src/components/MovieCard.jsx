import React, { useState, useEffect } from "react";
import requests from '../request'
import instance from '../axios'
import likeblack from '../assets/like-white.png';


export default function MovieCard(props){
    const [detailedInfo, setDetailInfo] = useState([])
    const [keywords, setKeywords] = useState([])

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
//http://api.themoviedb.org/3/movie/35/keywords?api_key=
      useEffect(()=>{
        fetch(`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}/keywords?api_key=${requests.apiKey}`)
          .then(res=> res.json())
          .then(data => setKeywords(data))
      }, [detailedInfo])

      console.log(`${props.mediaType ? props.mediaType : "movie"} ${props.fetchId}`)

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



    return(
    <div className="card">
      <img className="movieCard" src={props.link}/>
      <div className="movieInfo">
        <div className="movieEmojisDiv">
          <div className="movieEmojisLeft">
              <div className="emoji">▶</div>
              <div className="emoji">+</div>
              <div className="emoji"><img src={likeblack} alt="" className="likeButton" /></div>
            </div>
            <div className="emoji vEmoji">˅</div>
        </div>
        <div className="ratingTimeDiv">
          <div className={`contentRating ${contentRatingClass}`}>{contentRating}</div>
          <div className="runtime">{runtime}</div>
        </div>
        {props.mediaType === "tv" ? 
        keywords.results && keywords.results.length > 0 && <div className="keywords">{`${keywords.results.length > 0 && keywords.results[0].name} · ${keywords.results.length > 1 && keywords.results[1].name} · ${keywords.results.length > 2 && keywords.results[2].name} `}</div> :
        keywords.keywords && keywords.keywords.length > 0 && <div className="keywords">{`${keywords.keywords.length > 0 && keywords.keywords[0].name} · ${keywords.keywords.length > 1 && keywords.keywords[1].name} · ${keywords.keywords.length > 2 && keywords.keywords[2].name} `}</div>}
      </div>
    </div>
    )
}