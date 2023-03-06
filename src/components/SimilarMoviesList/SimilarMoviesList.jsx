import React, { useState, useEffect } from "react";
import "./SimilarMoviesList.css"
import instance from "../../axios";
import requests from "../../request";
import {nanoid} from 'nanoid'
import ExtraInfoCard from "../ExtraInfoCard/ExtraInfoCard";


export default function SimilarMoviesList(props){
    const [similarMovies, setSimilarMovies] = useState([])


    useEffect(()=>{
        props.keywords.length > 0 ? 
        fetch(`${instance}/discover/movie?api_key=${requests.apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_keywords=${props.keywords[0].id}|${props.keywords[1].id}`)
            .then(res => res.json())
            .then(data => setSimilarMovies(data.results))
        :
        fetch(`${instance}/discover/movie?api_key=${requests.apiKey}&with_genres=${props.genre[0].id},${props.genre[1].id}`)
            .then(res => res.json())
            .then(data => setSimilarMovies(data.results))
      }, [])

      
    let filteredSimilarMovies = [];
    
   for(let i = 0; i < similarMovies.length; i++){
    if (similarMovies[i].title != props.parentTitle){
        filteredSimilarMovies.push(similarMovies[i])
    }
   }


    const visualSimilarMovies = filteredSimilarMovies.map(movie =>
        (<ExtraInfoCard 
            key={movie.id} 
            className="card" 
            fetchId={movie.id} 
            mediaType="movie"
            link={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} 
            addFilmsToTheListOfSimilarMoviesToMyList={props.addFilmsToTheListOfSimilarMoviesToMyList}
            removeListFunction={props.removeListFunction}
            myList={props.myList}/>
    ))
       

        //console.log(similarMovies)
    return(
        <div className="similarMoviesList">
            <h3>Similar Movies</h3>
            <div className="similarMoviesListDiv">
                {visualSimilarMovies}
            </div>
        </div>
    )
}