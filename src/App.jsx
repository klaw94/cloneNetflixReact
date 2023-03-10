import React, { useState, useEffect } from 'react'
import requests from './request'
import Navbar from './components/Navbar'
import './App.css'
import Row from './components/Row'


function App() {
  const[myList, setMyList] = useState([])
  const[likedFilms, setLikedFilms] = useState([])
  const [searchMode, setSearchMode] = useState(false)
  const [searchForm, setSearchForm] = useState()

  //console.log(likedFilms)

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

  return (
    <div className="App">
      <Navbar searchMode={searchMode}/>
      {myList.length > 0 && <Row title="My List" 
                              fetch={requests.myList} 
                              myList={myList}
                              myListFunction={addToMyList} 
                              removeListFunction={removeFromMyList}
                              likeFilm={likeAFilm}
                              stopLikingAFilm={stopLikingAFilm}
                              likedFilms={likedFilms}
                              updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>}
      <Row title="Trend Now" 
        fetch={requests.fetchTrending}  
        myList={myList} myListFunction={addToMyList} 
        removeListFunction={removeFromMyList}
        likeFilm={likeAFilm}
        stopLikingAFilm={stopLikingAFilm}
        likedFilms={likedFilms}
        updateStatusOfLikedFilm={updateStatusOfLikedFilm}/>
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
    </div>
  )
}

export default App
