import React, {useState, useEffect, useRef}  from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from "react-router-dom";
import './landing-page.css';

function LandingPage() {

    const [joinPopup, setJoinPopup] = useState(false);
    const [createPopup, setCreatePopup] = useState(false);
    const [play, setPlay] = useState(false); //If true, goes to play and waits for player2
    const [lobby, setLobby] = useState(false); //If true, goes to lobby to pick a game
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");

    const node = useRef();
    const node2 = useRef();
    const closePopup = e => {
        if (node.current.contains(e.target) || node2.current.contains(e.target)) {
          // inside click
          return;
        }
        // outside click
        setJoinPopup(false);
        setCreatePopup(false);
        setUsername("");
      };

    //Enables join popup
    const enableJoin = () => {
        setJoinPopup(!joinPopup);
    }
    //Enables create popup
    const enableCreate = () => {
        setCreatePopup(!createPopup);
    }

    //Generated unique code and sets state to redirect to waiting
    const goToPlay = () =>{
        var unique = Math.round(Math.random() * 999999);    //Creates unique code
        setCode(unique);
        setPlay(true);
    }

    useEffect(() => {
        document.addEventListener("mousedown", closePopup);
    
        return () => {
          document.removeEventListener("mousedown", closePopup);
        };
      }, []);

    if(play === true){return(<Redirect to={{pathname:"/play", data:[username, code], loadStatus:"Waiting"}}></Redirect>);}
    if(lobby === true){return(<Redirect to={{pathname:"/lobby", username:username}}></Redirect>);}

  return (
    <div className="landing-body">
      <div className="landing-container">
          <h1>Tic-Tac-Toe</h1>
          <button className="landing-button" onClick={() => enableJoin()}>Join Game</button>
          <button className="landing-button" onClick={() => enableCreate()}>Create Game</button>
      </div>
      <div className={`join-popup popupVisible-${joinPopup}`}>
          <div ref={node} className="join-container">
            <input className="join-username" placeholder="Username" onChange={e => setUsername(e.target.value)} value={username}></input>
            <button className="join-button-popup" onClick={() => setLobby(true)}>Join</button>
          </div>
      </div>
      <div className={`create-popup popupVisible-${createPopup}`}>
        <div ref={node2} className="create-container">
            <input className="create-username" placeholder="Username" onChange={e => setUsername(e.target.value)} value={username}></input>
            <button className="create-button-popup" onClick={() => goToPlay()}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;