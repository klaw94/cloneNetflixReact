import React, { useState, useEffect } from "react";
import './HeaderMovie.css'
import instance from "../../axios";
import requests from "../../request";


export default function HeaderMovie(){
    const [mainMovie, setMainMovie] = useState([])
    const [detailedInfo, setDetailInfo] = useState([])

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

      console.log(detailedInfo)

    return(
        <div className="headerMovieDiv">
           {mainMovie.backdrop_path && <img src={`https://image.tmdb.org/t/p/original/${mainMovie.backdrop_path}`} />}
           <h1>{mainMovie.original_title}</h1>
           <p>{detailedInfo.overview}</p>
           <div className="header--buttonDiv">
                <button className="main--playButton">▶ Play</button>
                <button className="main--meerInfo">More information</button>
           </div>
        </div>
    )
}