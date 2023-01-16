import React, {useState, useEffect, useRef} from "react"
import instance from '../axios'
import {nanoid} from 'nanoid'
import MovieCard from "./MovieCard";

export default function Row(props){
  const [movieData, setMovieData] = useState([])
  const ref = useRef(null);
  const [margin, setMargin] = useState(true)


  useEffect(()=>{
    fetch(`${instance}${props.fetch}`)
        .then(res => res.json())
        .then(data => setMovieData(data.results))
  }, [])

  //console.log(movieData)


  const visualMovies = movieData.map(movie =>
    (<MovieCard key={nanoid()} className="card" fetchId={movie.id} mediaType={movie.media_type} link={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} />
    )
  )

  let styles = {marginLeft : -40}

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
    if (Math.abs(ref.current.scrollWidth - ref.current.scrollLeft - ref.current.clientWidth) < 1){
      ref.current.scrollLeft = 0;
    }
    if(ref.current.scrollLeft === 0 && scrollOffset < 0){
      ref.current.scrollLeft = 4500;
      
    }
    // console.log(ref.current.scrollLeft)
    // console.log(movieData)
    setMargin(false)
  };
//(window.innerWidth - 300 * (movieData.length * 260 / window.innerWidth - 300))

    return (
        <div className="row">
            <h3>{props.title}</h3>
            <div className="movieDiv" ref={ref} style={!margin ? styles : {}}>
              <div className="overflowY">
                {visualMovies}
                {!margin && <div className="arrowLeft arrow" onClick={()=>scroll(-1 * window.innerWidth + 300)} >{"<"}</div>}
              <div className="arrowRight arrow" onClick={()=>scroll(window.innerWidth -300)}>{">"}</div>
              </div>
            </div>

        </div>
    )
}