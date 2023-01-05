import React, { useState, useEffect } from "react";
import requests from '../request'
import instance from '../axios'



export default function MovieCard(props){
    const [detailedInfo, setDetailInfo] = useState([])
    
    useEffect(()=>{
        fetch(`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}?api_key=${requests.apiKey}`)
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
      
      // console.log(`${instance}/${props.mediaType ? props.mediaType : "movie"}/${props.fetchId}?api_key=${requests.apiKey}`)

        //"number_of_episodes":8,"number_of_seasons":1

    return(
    <div className="card">
      <img className="movieCard" src={props.link}/>
      <div className="movieInfo">
        <div className="movieEmojisDiv">
            <div>▶</div>
            <div>+</div>
            <div>👍</div>
            <div>˅</div>
        </div>
        <div className="runtime">{runtime}</div>
      </div>
    </div>
    )
}