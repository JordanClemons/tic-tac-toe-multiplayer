import React, {useState, useEffect}  from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faSyncAlt} from '@fortawesome/free-solid-svg-icons'
import io from 'socket.io-client';
import './play-page.css';

let socket;

function PlayPage() {

  const data = useLocation().data;
  const loadStatus = useLocation().loadStatus;
  console.log(data);

  const [status, setStatus] = useState("Thinking"); //Can either be waiting for player, or in-game, or thinking
  const [userLeft, setUserLeft] = useState(false);  //If user leaves, notify user left
  const [tooMany, setTooMany] = useState(false);  //If too many players already in lobby, notifies player

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
    if(status === "Play"){socket.emit('joinRoom', data);}
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

    socket.on('userLeft', () =>{
      setUserLeft(true);
    })

    socket.on('tooManyPlayers', () =>{
      setTooMany(true);
    })
    
    socket.on('testIncrement', testArray =>{
      setTestNumber(testArray);
    })
  }, [])

  if(tooMany){
    var username = data[0];
    return(
      <div className="toomany-body">
        <h1 className="waiting-header">Tic-Tac-Toe</h1>
        <h1 className="toomany-text">This lobby is full :(</h1>
        <Link to={{pathname:"/lobby", username:{username}}}><button className="toomany-button">Find a new game &nbsp;<FontAwesomeIcon icon={faSyncAlt}/></button></Link> 
      </div>
    )
  }
  if(userLeft){
    var username = data[0];
    return(
      <div className="userLeft-body">
        <h1 className="waiting-header">Tic-Tac-Toe</h1>
        <h1 className="userLeft-text">Player left :(</h1>
        <Link to={{pathname:"/lobby", username:{username}}}><button className="userLeft-button">Find a new game &nbsp;<FontAwesomeIcon icon={faSyncAlt}/></button></Link> 
      </div>
    )
  }
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
  if(data === undefined){
    return (
      <div>
        <Redirect to="/" />
      </div>
    );
  }
  return (
    <div>
      You shouldn't see this ever
    </div>
  );
}

export default PlayPage;