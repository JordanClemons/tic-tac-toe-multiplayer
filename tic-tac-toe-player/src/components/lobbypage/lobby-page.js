import React, {useState, useEffect}  from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useLocation} from "react-router-dom";
import io from 'socket.io-client';
import './lobby-page.css';

//Components
import RoomCard from './roomcard';

let socket;

function PlayPage() {

  const username = useLocation().username;
  console.log(username);

  const [rooms, setRooms] = useState([]);

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

  return (
    <div className="lobby-body">
      <div className="lobby-container">
          <h1 className="lobby-header">Available Games</h1>
          <div className="rooms">
              {rooms.map((room) => (
                  <RoomCard owner={room[0]} code={room[1]}></RoomCard>
              ))}
          </div>
      </div>
    </div>
  );
}

export default PlayPage;