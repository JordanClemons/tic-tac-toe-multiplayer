import React, {useState, useEffect}  from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useLocation} from "react-router-dom";
import io from 'socket.io-client';

let socket;

function PlayPage() {

  const data = useLocation().data;
  console.log(data);

  const [status, setStatus] = useState("Waiting"); //Can either be waiting for player, or in-game

  useEffect(() =>{
    socket=io('http://localhost:5000', {transports: ['websocket']});
    socket.emit('addRoom', data); //Sends unique code and username to backend

  return () => {
    socket.disconnect();
    socket.off();
  }

}, ['http://localhost:5000'])

  if(status === "Waiting"){
    return(
      <div>Waiting</div>
    )
  }
  return (
    <div>
      Play
    </div>
  );
}

export default PlayPage;