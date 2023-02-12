import React, { useState, useEffect } from 'react'
import requests from './request'
import Navbar from './components/Navbar'
import './App.css'
import Row from './components/Row'


function App() {
  const[myList, setMyList] = useState([])
  const [letsRefresh, setLetsRefresh] = useState(true)



  useEffect(()=>{

     fetchData()
           
  }, [])

function fetchData(){
  fetch(requests.myList)
  .then(res => res.json())
  .then(data => {
    setMyList(data)
    }) 
}

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
     .then((res)=>{
      setMyList((prevData => [
        {
          id : id,
          employeeid : employeeid,
          mediaType : media_type,
          backdrop_path : backdrop_path,      
        }, ...prevData
      ]))
     }
      )
}

console.log(myList)

function removeFromMyList(movieId, employeeId){
  fetch(`http://localhost:8080/api/v1/movie/${movieId}/${employeeId}`,{
    method: 'delete'
  })     
  .then(
    setMyList((prevData =>{
      const newData = prevData.filter(data => data.id != movieId)
      return newData
    }))
  )
}

  return (
    <div className="App">
      <Navbar />
      {myList.length > 0 && <Row title="My List" fetch={requests.myList} myList={myList} myListFunction={addToMyList} removeListFunction={removeFromMyList}/>}
      <Row title="Trend Now" fetch={requests.fetchTrending}  myList={myList} myListFunction={addToMyList} removeListFunction={removeFromMyList}/>
      <Row title="Action Movies" fetch={requests.fetchActionMovies}  myList={myList} myListFunction={addToMyList} removeListFunction={removeFromMyList}/>
      <Row title="Comedy Movies" fetch={requests.fetchComedyMovies}  myList={myList} myListFunction={addToMyList} removeListFunction={removeFromMyList}/>
    </div>
  )
}

export default App
