import { useState, useEffect } from 'react'
import requests from './request'
import Navbar from './components/Navbar'
import './App.css'
import Row from './components/Row'

function App() {

  return (
    <div className="App">
      <Navbar />
      <Row title="Trend Now" fetch={requests.fetchTrending}/>
      <Row title="Action Movies" fetch={requests.fetchActionMovies}/>
      <Row title="Comedy Movies" fetch={requests.fetchComedyMovies}/>
     
    </div>
  )
}

export default App
