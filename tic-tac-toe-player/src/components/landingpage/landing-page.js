import React, {useState, useEffect, useRef}  from 'react';
import './landing-page.css';

function LandingPage() {

    const [joinPopup, setJoinPopup] = useState(false);
    const [createPopup, setCreatePopup] = useState(false);

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
      };

    //Enables join popup
    const enableJoin = () => {
        setJoinPopup(!joinPopup);
    }
    //Enables create popup
    const enableCreate = () => {
        setCreatePopup(!createPopup);
    }

    useEffect(() => {
        document.addEventListener("mousedown", closePopup);
    
        return () => {
          document.removeEventListener("mousedown", closePopup);
        };
      }, []);

  return (
    <div className="landing-body">
      <div className="landing-container">
          <h1>Tic-Tac-Toe</h1>
          <button className="landing-button" onClick={() => enableJoin()}>Join Game</button>
          <button className="landing-button" onClick={() => enableCreate()}>Create Game</button>
      </div>
      <div className={`join-popup popupVisible-${joinPopup}`}>
          <div ref={node} className="join-container">
            <input className="join-username" placeholder="Username"></input>
            <input className="join-code" placeholder="Enter code"></input>
            <button className="join-button-popup">Join</button>
          </div>
      </div>
      <div className={`create-popup popupVisible-${createPopup}`}>
        <div ref={node2} className="create-container">
            <input className="create-username" placeholder="Username"></input>
            <button className="create-button-popup">Create</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;