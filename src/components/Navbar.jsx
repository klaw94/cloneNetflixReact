import React, { useState, useEffect, useRef } from "react";
import netflixlogo from "../assets/netflixlogo.png"
import avatar from "../assets/Netflix-avatar.png"
import lens from "../assets/lens.png"

export default function Navbar(props){
  const [searchMode, setSearchMode] = useState(false)
  const [stylesSearchBox, setStylesSearchBox] = useState({width: 26, border : "none"})
  const searchRef = useRef(null)


  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if(props.searchForm === "" || !props.searchForm){
          setSearchMode(false)
        } else{
          setSearchMode(true)
        }
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.searchForm]);


  useEffect(()=>{
    if(!searchMode){
   
      setStylesSearchBox({width: 26, border : "none"})
  
    
    } else {

      setStylesSearchBox({width: 200, border : "solid 1px white"})

    }
   }, [searchMode])


  function toggleSearchMode(){
    setSearchMode(true)
  }


  function handleChange(event) {
    props.handleChange(event)
  }

  function reloadPage(){
    if(props.searchMode){
      location.reload();

    }
  }

    return(
        <div className="navbar">
            <img src={netflixlogo} className="netflixLogo" onClick={reloadPage}/>
            <div className="navbar--search-avatar-div">
            <div className="search-field">
              {/* <div onClick={toggleSearchMode} style={stylesIcon} className="navbar--lensicon-div"><img className="navbar--lensicon" src={lens}/></div> */}
              <input onClick={toggleSearchMode}
                ref={searchRef}
                style={stylesSearchBox}
                type="search"
                autoComplete="off"
                placeholder="Titles of series or movie"
                onChange={handleChange}
                name="app_name"
                value={props.searchForm}
              />
            </div>
            <img src={avatar} className="myAvatar" />
            </div>
        </div>
    )
}