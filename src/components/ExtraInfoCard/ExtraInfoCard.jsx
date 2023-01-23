import React, { useState, useEffect, useRef, useCallback } from "react";
import requests from '../../request'
import instance from '../../axios'
import "./ExtraInfoCard.css"

export default function ExtraInfoCard(props){
    const [detailedInfo, setDetailInfo] = useState([])


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

      let runtime;
      if (props.mediaType && props.mediaType === "tv" && detailedInfo.number_of_seasons > 1){
        runtime = `${detailedInfo.number_of_seasons} Seasons`
      } else if (props.mediaType === "tv"){
        runtime = `${detailedInfo.number_of_episodes} Episodes`
      } else {      
        runtime = `${Math.floor(detailedInfo.runtime/60)}h ${detailedInfo.runtime%60}mins`
      }
      

      let year = ""
      if(detailedInfo.release_date){
        year = detailedInfo.release_date ? detailedInfo.release_date.slice(0, 4) : detailedInfo.first_air_date.slice(0,4)
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


    console.log(detailedInfo)

    return(
        <div className="extraInfoCard">
          <div className="extraInfoCard--imageElements">
            <img className="extraInfoCard--image" src={props.link}/>
            <div className="extraInfoCard--runtime">{runtime}</div>
            <div className="extraInfoCard--playButton">▶</div>
            <div className="extraInfoCard--title">{detailedInfo.title ? detailedInfo.title : detailedInfo.original_name}</div>

          </div>
          <div className="extraInfoCard--info"></div>
            <div className="extraInfoCard--contentYearListDiv">
              <div className="extraInfoCard--contentYearDiv">
                <div className={`extraInfoCard--contentRating contentRating ${contentRatingClass}`}>{contentRating}</div>
                <div>{year}</div>
              </div>
              <div className="emoji">+</div>
            </div>
            <div className="extraInfoCard--summary">{detailedInfo.overview}</div>
        </div>
    )
}