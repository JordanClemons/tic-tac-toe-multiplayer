import React, {useState, useEffect}  from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
import io from 'socket.io-client';
import './play-page.css';

let socket;

function PlayPage() {

  const data = useLocation().data;
  const loadStatus = useLocation().loadStatus;
  console.log(data);

  const [status, setStatus] = useState("Thinking"); //Can either be waiting for player, or in-game, or thinking

  const [testNumber, setTestNumber] = useState(0);
  const testIncrement = () =>{
    var testArray = [testNumber, data[1]];
    socket.emit('testIncrement', testArray);
  }

  useEffect(() =>{
    console.log(loadStatus);
    setStatus(loadStatus);
    console.log(status);
    socket=io('http://localhost:5000', {transports: ['websocket']});

  return () => {
    socket.disconnect();
    socket.off();
  }

}, ['http://localhost:5000'])

  useEffect(() =>{
    if(status === "Waiting"){socket.emit('addRoom', data);} //Sends unique code and username to backend
    if(status === "Play"){socket.emit('joinRoom', data[1]);}
  }, [status])

  useEffect(() =>{
    socket.on('joinRoom', checkCode =>{
      if(checkCode === data[1]){
        socket.emit('joinRoomWaiter', data[1]);
        setStatus("Play");
      }
    });

    socket.on('joinRoomWaiter', code =>{
      if(code === data[1]){socket.emit('joinRoomConfirm', code);}
    })
    
    socket.on('testIncrement', testArray =>{
      setTestNumber(testArray);
    })
  }, [])

  if(status === "Waiting"){
    return(
      <div className="waiting-body">
        <h1 className="waiting-header">Tic-Tac-Toe</h1>
        <div className="waiting-container">
          <div className="waiting-spinner"><FontAwesomeIcon icon={faSpinner} class="fa-spin"/></div>
          <div className="waiting-text-container">
            <h1>Waiting for player to join</h1>
            <h1>Code: {data[1]}</h1>
          </div>
        </div>
      </div>
    )
  }
  if(status === "Play"){
    return(
      <div>
        <h1>{testNumber}</h1>
        <button onClick={ () => testIncrement()}>Increment</button>
      </div>
    )
  }
  return (
    <div>
      Play
    </div>
  );
}

export default PlayPage;