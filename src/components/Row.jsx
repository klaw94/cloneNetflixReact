import React, {useState, useEffect, useRef} from "react"
import instance from '../axios'
import {nanoid} from 'nanoid'


export default function Row(props){
  const [movieData, setMovieData] = useState([])
  const ref = useRef(null);


  useEffect(()=>{
    fetch(`${instance}${props.fetch}`)
        .then(res => res.json())
        .then(data => setMovieData(data.results))
  }, [])

  
  const visualMovies = movieData.map(movie =>
    (<img className="movieCard" key={nanoid()} src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}/>)
  )

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

    return (
        <div className="row">
            <h3>{props.title}</h3>
            <div className="movieDiv" ref={ref}>
              <div className="arrowLeft" onClick={()=>scroll(-25)} >{"<"}</div>
                {visualMovies}
              <div className="arrowRight" onClick={()=>scroll(25)}>{">"}</div>
            </div>

        </div>
    )
}