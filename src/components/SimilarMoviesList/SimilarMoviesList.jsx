import React, { useState, useEffect } from "react";
import "./SimilarMoviesList.css"

export default function SimilarMoviesList(props){
    const [similarMovies, setSimilarMovies] = useState([])

    return(
        <div className="similarMoviesList">
            <h3>Similar Movies</h3>
        </div>
    )
}