import React, {useState, useEffect, useRef, useContext} from "react"
import instance from '../axios'
import {nanoid} from 'nanoid'
import MovieCard from "./MovieCard";


export default function Row(props){
  const [movieData, setMovieData] = useState([])
  const ref = useRef(null);
  const [margin, setMargin] = useState(true)


  let visualMovies
  useEffect(()=>{
    props.title != "My List" ?
    fetch(`${instance}${props.fetch}`)
        .then(res => res.json())
        .then(data => setMovieData(data.results)) :
    
    setMovieData(props.myList)       
  }, [props.myList])

  if (props.title === "My List"){
  visualMovies = props.myList.map(movie =>
    (<MovieCard key={nanoid()} 
      className="card" 
      fetchId={movie.id} 
      myList={props.myList}
      mediaType={movie.media_type ? movie.media_type : movie.mediaType} 
      myListFunction={props.myListFunction} 
      removeListFunction={props.removeListFunction}
      link={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
      likeFilm={props.likeFilm}
      stopLikingAFilm={props.stopLikingAFilm}
      likedFilms={props.likedFilms}
      updateStatusOfLikedFilm={props.updateStatusOfLikedFilm} />
    )
  )
  } else {
    visualMovies = movieData.map(movie =>
      (<MovieCard key={nanoid()} 
        className="card" 
        fetchId={movie.id} 
        myList={props.myList}
        mediaType={movie.media_type ? movie.media_type : movie.mediaType} 
        myListFunction={props.myListFunction} 
        removeListFunction={props.removeListFunction}
        link={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
        likeFilm={props.likeFilm}
        stopLikingAFilm={props.stopLikingAFilm}
        likedFilms={props.likedFilms}
        updateStatusOfLikedFilm={props.updateStatusOfLikedFilm} />
      )
    )
  }

  let styles = {marginLeft : -40}

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
    if (Math.abs(ref.current.scrollWidth - ref.current.scrollLeft - ref.current.clientWidth) < 1 && scrollOffset > 0){
      ref.current.scrollLeft = 0;
    }
    if(ref.current.scrollLeft === 0 && scrollOffset < 0){
      ref.current.scrollLeft = 4500;
    }
    setMargin(false)
   // setLetsRefresh(oldValue => !oldValue)
  };

    return (
        <div className="row">
            <h3>{props.title}</h3>
            <div className="movieDiv" ref={ref} style={!margin ? styles : {}}>
              <div className="overflowY">
                {visualMovies}
                {!margin && <div className="arrowLeft arrow" onClick={()=>scroll(-1 * window.innerWidth + 220)} >{"<"}</div>}
              <div className="arrowRight arrow" onClick={()=>scroll(window.innerWidth -220)}>{">"}</div>
              </div>
            </div>

        </div>
    )
}