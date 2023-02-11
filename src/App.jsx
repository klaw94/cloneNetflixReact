import { useState, useEffect } from 'react'
import requests from './request'
import Navbar from './components/Navbar'
import './App.css'
import Row from './components/Row'

function App() {
  const[myList, setMyList] = useState([])

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    crossDomain: true,
    headers: {
      accept: "application/json",
      ContentType: "application/json",
      AccessControlAllowOrigin: "*"
    },
  };

  useEffect(()=>{
  
     
    fetch(requests.myList, requestOptions)
        .then(res => res.json())
        .then(data => setMyList(data))        
  }, [])

 // console.log(myList)
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
     .then(fetch(requests.myList, requestOptions)
        .then(res => res.json())
        .then(data => setMyList(data)))
}

function removeFromMyList(movieId, employeeId){
  fetch(`http://localhost:8080/api/v1/movie/${movieId}/${employeeId}`,{
    method: 'delete'
  })     
  .then(fetch(requests.myList, requestOptions)
  .then(res => res.json())
  .then(data => setMyList(data)))
}

  return (
    <div className="App">
      <Navbar />
      <Row title="My List" fetch={requests.myList} myList={myList} myListFunction={addToMyList} removeListFunction={removeFromMyList}/>
      <Row title="Trend Now" fetch={requests.fetchTrending}  myListFunction={addToMyList} removeListFunction={removeFromMyList}/>
      <Row title="Action Movies" fetch={requests.fetchActionMovies}  myListFunction={addToMyList} removeListFunction={removeFromMyList}/>
      <Row title="Comedy Movies" fetch={requests.fetchComedyMovies}  myListFunction={addToMyList} removeListFunction={removeFromMyList}/>
     
    </div>
  )
}

export default App
