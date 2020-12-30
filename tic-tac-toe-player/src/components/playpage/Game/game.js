import React, {useState} from 'react';
import './game.css'
import io from 'socket.io-client';
import Board from './board';

const Game = (handleClick, history, stepNumber, winner, xo) =>{
    

    const submitMove = () =>{
        console.log("Submitted");
    };


    return(
        <div className="board-container">
            <h1 className="board-header">Tic-Tac-Toe</h1>
            <Board squares={history[stepNumber]} onClick={handleClick}/>
            <div className="info-wrapper">
                
                <h3 className="turn-text">{winner ? "Winner: " + winner : "It's " + xo + "'s turn"}</h3>
            </div>
        </div>
    )
}

export default Game;