import React, {useState, useEffect}  from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import io from 'socket.io-client';
import './lobby-page.css';

//Components
import RoomCard from './roomcard';

let socket;

function PlayPage() {

  const username = useLocation().username;
  console.log(username);

  const [rooms, setRooms] = useState([]);
  const [redirectCode, setRedirectCode] = useState(-1);   //Set to the room code we are entering then redirects to it

  useEffect(() =>{
    socket=io('localhost:5000', {transports: ['websocket']});
    socket.emit('requestRooms'); //Requests the list of available rooms

  return () => {
    socket.disconnect();
    socket.off();
  }

}, ['localhost:5000'])

useEffect(() =>{
    //Recieve all the rooms (only happens once on load)
    socket.on('rooms', rooms =>{
      setRooms(rooms);
    });
  }, []);

  //Refreshes the list of rooms
  const refreshRooms = () => {
    socket.emit('requestRooms'); //Requests the list of available rooms
  }

  //If we redirect
  if(redirectCode !== -1){
    return(
      <Redirect to={{pathname:"/play", loadStatus:"Play", data:[username, redirectCode]}}></Redirect>
    )
  }
  if(username === undefined){
    return (
      <div>
        <Redirect to="/" />
      </div>
    );
  }
  //If there is no rooms
  if(rooms.length === 0){
    return(
      <div className="lobby-body">
      <div className="lobby-container">
          <h1 className="lobby-header">Available Games</h1>
          <h1 className="nogames-noti">No games open right now.</h1>
          <button className="refresh-button" onClick={() => refreshRooms()}><FontAwesomeIcon icon={faSyncAlt}  size="4x" /></button>
      </div>
    </div>
    )
  }
  return (
    <div className="lobby-body">
      <div className="lobby-container">
          <h1 className="lobby-header">Available Games</h1>
          <button className="refresh-button" onClick={() => refreshRooms()}><FontAwesomeIcon icon={faSyncAlt}  size="3x" /></button>
          <div className="rooms">
              {rooms.map((room) => (
                  <RoomCard owner={room[0]} code={room[1]} setRedirectCode={setRedirectCode}></RoomCard>
              ))}
          </div>
      </div>
    </div>
  );
}

export default PlayPage;