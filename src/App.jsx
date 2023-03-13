import React, { useState, useEffect } from 'react'
import requests from './request'
import Navbar from './components/Navbar'
import './App.css'
import Row from './components/Row'
import instance from './axios'
import {nanoid} from 'nanoid'
import MovieCard from './components/MovieCard'



function App() {
  const[myList, setMyList] = useState([])
  const[likedFilms, setLikedFilms] = useState([])
  const [searchMode, setSearchMode] = useState(false)
  const [searchForm, setSearchForm] = useState("")
  const [searchedFilms, setSearchedFilms] = useState([])

  console.log(searchedFilms)


  useEffect(()=>{
    console.log('hehe')
    fetch(instance + requests.searchedFilms + encodeURI(searchForm))
    .then(res => res.json())
    .then(data => {
      setSearchedFilms(data.results)
      }) 
  }, [searchForm])


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

//console.log(likedFilms)
  function addToMyList (id, employeeid, media_type, backdrop_path) {
    fetch(`http://localhost:8080/api/v1/movie`, {
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

  fetch(`http://localhost:8080/api/v1/movie/${movieId}/${employeeId}`,{
    method: 'delete'
  })     
  
    setMyList((prevData =>{
      const newData = prevData.filter(data => data.id != movieId)
      return newData
    })
  )
}

function likeAFilm (id, employeeid, media_type, status) {
  fetch(`http://localhost:8080/api/v1/liked-movie`, {
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

function stopLikingAFilm (id, employeeid) {
  fetch(`http://localhost:8080/api/v1/liked-movie/${id}/${employeeid}`, {
       method: 'delete'
          })
  
  setLikedFilms(prevData =>{
    const newData = prevData.filter(data => data.id != id)
    return newData
  })
  
}

function updateStatusOfLikedFilm(id, employeeid, media_type, status){
  fetch(`http://localhost:8080/api/v1/liked-movie/${id}/${employeeid}`, {
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
    console.log(movie)
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
  updateStatusOfLikedFilm={updateStatusOfLikedFilm} />
) : (<></>)}
  )

  return (
    <div className="App">
      <Navbar searchMode={searchMode} searchForm={searchForm} handleChange={handleChange}/>

{searchMode === false && <div>
      <Row title="Trend Now" 
        fetch={requests.fetchTrending}  
        myList={myList} myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        stopLikingAFilm={stopLikingAFilm}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>
      {myList.length > 0 && <Row title="My List" 
                      fetch={requests.myList} 
                      myList={myList}
                      myListFunction={addToMyList} 
                      removeListFunction={removeFromMyList}
                      likeFilm={likeAFilm}
                      stopLikingAFilm={stopLikingAFilm}
                      likedFilms={likedFilms}
                      updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>}
      <Row title="Action Movies" 
        fetch={requests.fetchActionMovies}  
        myList={myList} 
        myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        stopLikingAFilm={stopLikingAFilm}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>
      <Row title="Comedy Movies" 
        fetch={requests.fetchComedyMovies}  
        myList={myList} 
        myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        stopLikingAFilm={stopLikingAFilm}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>
    </div>}
    
    {searchMode === true && <div className='searchedMoviesDiv'>
      {visualSearchedMovies}
    </div>}
     </div>
  )
}

export default App
