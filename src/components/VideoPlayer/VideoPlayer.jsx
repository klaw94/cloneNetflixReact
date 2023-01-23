import React, { useState, useEffect, useRef, useCallback } from "react";
import "./VideoPlayer.css"


export default function Player (props) {
    const [video, setVideo] = useState([])
    const [fullScreen, setFullScreen] = useState(true)

    useEffect(()=>{
        fetch(`${props.apiCall}&append_to_response=videos`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                let trailer = null;
                for (let i = 0; i < data.videos.results.length; i++){
                    if (data.videos.results[i].name === "Official Trailer"){
                        trailer = data.videos.results[i];
                        break;
                    }
                }
                if (trailer === null)
                for (let i = 0; i < data.videos.results.length; i++){
                    if (data.videos.results[i].name.includes("Official Trailer")){
                        trailer = data.videos.results[i];
                        break;
                    }
                }
                setVideo(trailer)
            })
      }, [])

      function closeVideo(){
        setFullScreen(false)
      }

      console.log(video)

   return (
    <div className="videoPlayer">
        <button className="videoPlayer--exit" onClick={closeVideo}>Click Me</button>
        {video.key && fullScreen && <iframe width={800} height={500}
            src={`https://www.youtube.com/embed/${video.key}`}>
        </iframe>}
    </div>
)
}

