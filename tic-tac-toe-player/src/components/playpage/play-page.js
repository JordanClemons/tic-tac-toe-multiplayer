import React, {useState, useEffect}  from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faSyncAlt} from '@fortawesome/free-solid-svg-icons'
import io from 'socket.io-client';
import './play-page.css';

import {calculateWinner} from './Game/helper.js';
import Board from './Game/board';
import './Game/game.css'

let socket;

function PlayPage() {

  const data = useLocation().data;
  const username = data[0];
  const loadStatus = useLocation().loadStatus;

  const [status, setStatus] = useState("Thinking"); //Can either be waiting for player, or in-game, or thinking
  const [userLeft, setUserLeft] = useState(false);  //If user leaves, notify user left
  const [tooMany, setTooMany] = useState(false);  //If too many players already in lobby, notifies player
  const [XO, setXO] = useState("O"); //Host is O
  const [otherPlayer, setOtherPlayer] = useState("");
  const [yourTurn, setYourTurn] = useState(true);

  const [testNumber, setTestNumber] = useState(0);
  const testIncrement = () =>{
    var testArray = [testNumber, data];
    socket.emit('testIncrement', testArray);
  }

  //GAME STUFF-----------------------------------------------
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXisNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const winner = calculateWinner(squares);
    // const winner = calculateWinner(history[stepNumber]);

    const handleClick = (i) =>{
        const historyPoint = history.slice(0, stepNumber + 1);
        const current = historyPoint[stepNumber];
        //return if won or occupies
        if(winner || squares[i]) return;
        //select square
        var sq = squares;
        sq[i] = XO;
        setSquares(sq);
        setHistory([...historyPoint, squares]);
        setStepNumber(historyPoint.length);
        var moveInfo = [data[0], data[1], XO, i];
        socket.emit('submitMove', moveInfo);
    };

    const handleClickOther = (x,y) =>{
      const historyPoint = history.slice(0, stepNumber + 1);
      const current = historyPoint[stepNumber];
      var sq = squares;
      
      console.log(XO);
      sq[y] = x;
      setSquares(sq);
      //return if won or occupies
      if(winner) return;
      // //select square
      // // squares[y] = XO;
      setHistory([...historyPoint, squares]);
      setStepNumber(historyPoint.length);
      setYourTurn(true);
  };
    //--------------------------------------------

  useEffect(() =>{
    setStatus(loadStatus);
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
        socket.emit('joinRoomWaiter', data);
        setStatus("Play");
      }
    });

    socket.on('joinRoomWaiter', code =>{
      if(code[1] === data[1]){
        socket.emit('joinRoomConfirm', code);
      }
      if(code[0] !== data[0]){
        console.log("Don't equal)");
        setOtherPlayer(code[0]);
      }
    })

    socket.on('userLeft', () =>{
      setUserLeft(true);
    })

    socket.on('tooManyPlayers', () =>{
      setTooMany(true);
    })

    socket.on('youAreGuest' , (data) =>{
      console.log("both :(");
      setYourTurn(false);
      setXO("X");
      socket.emit('youAreHost', data);
    })

    socket.on('youAreHost', (code) =>{
      if(data[0] !== code[0]){
      }
    })

    socket.on('submitMove', dataTurn =>{
      if(dataTurn[0] !== data[0]){
        //dataTurn is name, roomId, and value of X or O,  and last move number

        handleClickOther(dataTurn[2], dataTurn[3]);
      }
      else{setYourTurn(false);}
    })
    
    socket.on('testIncrement', testArray =>{
      console.log("Test increment");
      setTestNumber(testArray[0]);
      if(testArray[1][0] === data[0]){
        console.log("Here");
        setYourTurn(false);
      }
      else{setYourTurn(true);}
    })
  }, [])

  console.log(winner);
  if(tooMany){
    return(
      <div className="toomany-body">
        <h1 className="waiting-header">Tic-Tac-Toe</h1>
        <h1 className="toomany-text">This lobby is full :(</h1>
        <Link to={{pathname:"/lobby", username:{username}}}><button className="toomany-button">Find a new game &nbsp;<FontAwesomeIcon icon={faSyncAlt}/></button></Link> 
      </div>
    )
  }
  if(userLeft){
    return(
      <div className="userLeft-body">
        <h1 className="waiting-header">Tic-Tac-Toe</h1>
        <h1 className="userLeft-text">Player left :(</h1>
        <Link to={{pathname:"/lobby", username:username}}><button className="userLeft-button">Find a new game &nbsp;<FontAwesomeIcon icon={faSyncAlt}/></button></Link> 
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
        <div className="board-container">
            <h1 className="board-header">Tic-Tac-Toe</h1>
            <Board squares={squares} onClick={handleClick} yourTurn={yourTurn}/>
            <div className="info-wrapper">
            <h1 className={`yourTurnText-${winner}`}>{yourTurn ? "It's your turn" : "It's " + otherPlayer + "'s turn"}</h1>
            <h1 className={`winner-${winner}`}>{winner} wins!</h1>
                {/* <h3 className="turn-text">{winner ? "Winner: " + winner : "It's " +  + "'s turn"}</h3> */}
            </div>
        </div>
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