import React from "react";
import "./DetailedInfoSelectedMovie.css"

export default function DetailedInfoSelectedMovie(props){
    const visualGenres = props.genres.map((genre, index) => {
        if (index < 4){
          return(
            <span className="white" key={genre.id}>{genre.name}{index === props.genres.length - 1 || index === 2 ? "" : ", "}</span>
        );
        } else{
          return
        }
      
      })

      const visualKeywords = props.keywords.map((keyword, index) => {
        if (index < 4){
          return(
            <span className="white" key={keyword.id}>{keyword.name}{index === props.keywords.length - 1 || index === 3 ? "" : ", "}</span>
        );
        } else{
          return
        }
      
      })

      let director
      let directorPresentation
      //console.log(props)
      if(props.cast){
         director = props.cast.crew.find(person =>
          person.job === "Director"
        )
        directorPresentation = "Directed by:"
       }
       if (!director && props.cast){
        director = props.cast.crew.find(person =>
            person.known_for_department === "Directing"
          )
        directorPresentation = "Created by:"

       }
     console.log(director)

      let screenWriters = []
      if(props.cast){
        screenWriters = props.cast.crew.filter(person=>(person.job === "Screenplay" || person.job === "Script Coordinator") && person.known_for_department === "Writing")
      }
      console.log(screenWriters)
     

      const visualScreenWriters = screenWriters.map((screenWriter, index) => {
        if (index < 4){
          return(
            <span className="white" key={screenWriter.id}>{screenWriter.name}{index === screenWriters.length - 1 || index === 3 ? "" : ", "}</span>
        );
        } else{
          return
        }
      
      })

      let visualCast
      if(props.cast != null){
        visualCast = props.cast.cast.map((actor, index) => {
          if (index < 10){
            return(
              <span className="white" key={actor.id}>{actor.name}{index === props.cast.length - 1 || index === 9 ? "" : ", "}</span>
          );
          } else{
            return
          }
       
        }) 
      }


    return(
        <div className="detailedInfoSelectedMovie">
            <h3>About <strong>{props.title}</strong></h3>
        {director && director.name && <div className="grey">{directorPresentation + " "} 
            <span className="white">{director.name}</span>
        </div>}
        {screenWriters.length > 0 && <div className="grey">Screenplay: {" "} 
            {visualScreenWriters}
        </div>}
        {props.cast != null && props.cast.cast.length > 0 && <div className="grey">Cast: {" "}
          {visualCast}
        </div>}
        {props.genres.length > 0 && <div className="grey">Genres:  {" "}
            {visualGenres}
        </div>}
        {props.keywords.length > 0 && <div className="grey">Belongs to: {" "}
            {visualKeywords}
        </div>}
        <div className="contentRatingExtraInfo grey">Content rating: 
            <div className={`contentRating ${props.contentRatingClass}`}>{props.contentRating}</div></div>
            
        </div>
    )
}