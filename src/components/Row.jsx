import React, {useState, useEffect, useRef} from "react"
import instance from '../axios'
import {nanoid} from 'nanoid'

export default function Row(props){
  const [movieData, setMovieData] = useState([])
  const ref = useRef(null);
  const [margin, setMargin] = useState(true)


  useEffect(()=>{
    fetch(`${instance}${props.fetch}`)
        .then(res => res.json())
        .then(data => setMovieData(data.results))
  }, [])

  
  const visualMovies = movieData.map(movie =>
    (<img className="movieCard" key={nanoid()} src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}/>)
  )

  let styles = {marginLeft : -40}

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
    if (ref.current.scrollLeft > 3800 && scrollOffset > 0){
      ref.current.scrollLeft = 0;
      ref.current.style.setProperty("--movieDiv-index", 0)

    }
    if(ref.current.scrollLeft === 0 && scrollOffset < 0){
      ref.current.scrollLeft = 4500;
      ref.current.style.setProperty("--movieDiv-index", 3)
      
    }

    setMargin(false)
  };

    return (
        <div className="row">
            <h3>{props.title}</h3>
            <div className="movieDiv" ref={ref} style={!margin ? styles : {}}>
              {!margin && <div className="arrowLeft" onClick={()=>scroll(-1 * window.innerWidth - 300)} >{"<"}</div>}
                {visualMovies}
              <div className="arrowRight" onClick={()=>scroll(window.innerWidth -300)}>{">"}</div>
            </div>

        </div>
    )
}