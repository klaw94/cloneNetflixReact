import React, { useState, useEffect } from 'react'
import requests from './request'
import Navbar from './components/Navbar'
import './App.css'
import Row from './components/Row'
import instance from './axios'
import {nanoid} from 'nanoid'
import MovieCard from './components/MovieCard'
import HeaderMovie from './components/HeaderMovie/HeaderMovie'



function App() {
  const [myList, setMyList] = useState([])
  const [likedFilms, setLikedFilms] = useState([])
  const [searchMode, setSearchMode] = useState(false)
  const [searchForm, setSearchForm] = useState("")
  const [searchedFilms, setSearchedFilms] = useState([])
  const [myGenres, setMyGenres] = useState([])
  const [favouriteGenres, setFavouriteGenres] = useState([])


  useEffect(()=>{
    fetch(instance + requests.searchedFilms + encodeURI(searchForm))
    .then(res => res.json())
    .then(data => {
      setSearchedFilms(data.results)
      }) 
  }, [searchForm])

  useEffect(()=>{
    fetch(requests.favouriteGenres)
    .then(res => res.json())
    .then(data => {
      setMyGenres(data)
      }) 
  }, [])

  useEffect(()=>{
    setFavouriteGenres(myGenres.filter(genre => genre.score > 0))
  }, [myGenres])

  useEffect(()=>{
    fetch(requests.myList)
    .then(res => res.json())
    .then(data => {
      setMyList(data)
      }) 
  }, [])

  useEffect(()=>{
    fetch(requests.likedFilms)
    .then(res => res.json())
    .then(data => {
      setLikedFilms(data)
      }) 
  }, [])

  useEffect(()=>{
    if(searchForm !== ""){
      setSearchMode(true)
    } else{
      setSearchMode(false)
    }
  }, [searchForm])



  function handleChange(event){
    setSearchForm(event.target.value)
  }

  function addToMyList (id, employeeid, media_type, backdrop_path) {
    fetch(requests.myList, {
         method: 'post',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
             id,
             employeeid,
             media_type,
             backdrop_path,
         }),
     })
    
      setMyList((prevData => [
        {
          id : id,
          employeeid : employeeid,
          mediaType : media_type,
          backdrop_path : backdrop_path,      
        }, ...prevData
      ]))
    
}


function removeFromMyList(movieId, employeeId){

  fetch(`${requests.myList}/${movieId}/${employeeId}`,{
    method: 'delete'
  })     
  
    setMyList((prevData =>{
      const newData = prevData.filter(data => data.id != movieId)
      return newData
    })
  )
}

function likeAFilm (id, employeeid, media_type, status) {
  fetch(requests.likedFilms, {
       method: 'post',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
           id,
           employeeid,
           media_type,
           status,
       }),
   })
  
    setLikedFilms((prevData => [
      {
        id : id,
        employeeid : employeeid,
        mediaType : media_type,
        status : status,      
      }, ...prevData
    ]))
  
}

console.log(myGenres)

function handleLikingAGenre(employeeid, genre_id, genre_name, status){
  let addition;
  switch(status) {
    case "liked":
      addition = 1
      break;
    case "list":
      addition = 1
      break;
    case "love":
      addition = 2
      break;
    case "disliked":
      addition = -1
      break;
    case "stoplove":
      addition = -2
      break;
    default:
      addition = 0
  }
  
  /* vendors contains the element we're looking for */
  if (myGenres.filter(genre => genre.genreId === genre_id).length > 0) {
    let relevantGenre = myGenres.filter(genre => genre.genreId === genre_id)[0];
    if(relevantGenre.score + addition === 0){
      deleteGenre(genre_id, employeeid)
    } else{
      updateGenre(genre_id, employeeid, addition, genre_name)
    }
  } else {
    addNewGenre(genre_id, employeeid, addition, genre_name)
  }
}

function updateGenre(genre_id, employeeid, addition, genre_name){
  fetch(`${requests.favouriteGenres}/${genre_id}/${employeeid}/${addition}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
   })
  setMyGenres(prevData=> prevData.map(genre=>{
   return  genre.genreId === genre_id ? ({...genre, score : genre.score + addition}) : genre
  }))
}

function deleteGenre(genre_id, employeeid){
  fetch(`${requests.favouriteGenres}/${genre_id}/${employeeid}`, {
    method: 'delete'
       })

  setMyGenres(prevData =>{
    const newData = prevData.filter(data => data.genreId != genre_id)
    return newData
  })
}

function addNewGenre(genre_id, employeeid, score, genre_name){
  fetch(requests.favouriteGenres, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        employeeid,
        genre_id,
        genre_name,
        score
    })
})

 setMyGenres((prevData => [
   {
     genreId : genre_id,
     employeeid : employeeid,
     genre_name : genre_name,
     score : score     
   }, ...prevData
 ]))

}

function stopLikingAFilm (id, employeeid) {
  fetch(`${requests.likedFilms}/${id}/${employeeid}`, {
       method: 'delete'
          })
  
  setLikedFilms(prevData =>{
    const newData = prevData.filter(data => data.id != id)
    return newData
  })
  
}

function updateStatusOfLikedFilm(id, employeeid, media_type, status){
  fetch(`${requests.likedFilms}/${id}/${employeeid}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        id,
        employeeid,
        media_type,
        status,
    }),
})
  setLikedFilms(prevData=> prevData.map(movie=>{
   return  movie.id === id ? ({...movie, status : status}) : movie
  }))

}

const visualSearchedMovies = searchedFilms.map(movie =>{
  return movie.backdrop_path ?
 (<MovieCard key={nanoid()} 
  className="card" 
  fetchId={movie.id} 
  myList={myList}
  mediaType={movie.media_type ? movie.media_type : movie.mediaType} 
  myListFunction={addToMyList} 
  removeListFunction={removeFromMyList}
  link={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
  likeFilm={likeAFilm}
  stopLikingAFilm={stopLikingAFilm}
  likedFilms={likedFilms}
  updateStatusOfLikedFilm={updateStatusOfLikedFilm}
  likeAGenre={handleLikingAGenre} />
) : (<></>)}
  )

favouriteGenres.length > 0 && console.log(instance + requests.fetchFavouriteFilm + favouriteGenres[0].genreId)

  return (
    <div className="App">
      <Navbar searchMode={searchMode} searchForm={searchForm} handleChange={handleChange}/>

{searchMode === false && <div>
  <HeaderMovie 
    myList={myList}
    likedFilms={likedFilms}             
     myListFunction={addToMyList} 
    removeListFunction={removeFromMyList}
    likeFilm={likeAFilm}
    likeAGenre={handleLikingAGenre}
    stopLikingAFilm={stopLikingAFilm}
    updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>
  {myList.length > 0 && <Row title="My List" 
                      fetch={requests.myList} 
                      myList={myList}
                      myListFunction={addToMyList} 
                      removeListFunction={removeFromMyList}
                      likeFilm={likeAFilm}
                      likeAGenre={handleLikingAGenre}
                      stopLikingAFilm={stopLikingAFilm}
                      likedFilms={likedFilms}
                      favouriteGenres={favouriteGenres}
                      updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>}
 
        <Row title="Trend Now" 
        fetch={requests.fetchTrending}  
        myList={myList} myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        likeAGenre={handleLikingAGenre}
        stopLikingAFilm={stopLikingAFilm}
        likedFilms={likedFilms}
        favouriteGenres={favouriteGenres}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>
      {favouriteGenres.length >= 1 ? 
      <Row title={favouriteGenres[0].genreName}
        fetch={requests.fetchFavouriteFilm + favouriteGenres[0].genreId}  
        myList={myList} 
        myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        favouriteGenres={favouriteGenres}
        likeAGenre={handleLikingAGenre}
        stopLikingAFilm={stopLikingAFilm}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/> :
        <Row title="Action Movies" 
        fetch={requests.fetchActionMovies}  
        myList={myList} 
        myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        likeAGenre={handleLikingAGenre}
        stopLikingAFilm={stopLikingAFilm}
        favouriteGenres={favouriteGenres}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>}
      {favouriteGenres.length >= 2 ?  
      <Row title={favouriteGenres[1].genreName}
        fetch={requests.fetchFavouriteFilm + favouriteGenres[1].genreId}  
        myList={myList} 
        myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        likeAGenre={handleLikingAGenre}
        stopLikingAFilm={stopLikingAFilm}
        favouriteGenres={favouriteGenres}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>:
         <Row title="Comedy Movies" 
        fetch={requests.fetchComedyMovies}  
        myList={myList} 
        myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        likeAGenre={handleLikingAGenre}
        stopLikingAFilm={stopLikingAFilm}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>}
      {favouriteGenres.length >= 3 && 
        <Row title={favouriteGenres[2].genreName}
        fetch={requests.fetchFavouriteFilm + favouriteGenres[2].genreId}  
        myList={myList} 
        myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        favouriteGenres={favouriteGenres}
        likeFilm={likeAFilm}
        likeAGenre={handleLikingAGenre}
        stopLikingAFilm={stopLikingAFilm}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>}
    </div>}
    
    {searchMode === true && <div className='searchedMoviesDiv'>
      {visualSearchedMovies}
    </div>}
     </div>
  )
}

export default App
