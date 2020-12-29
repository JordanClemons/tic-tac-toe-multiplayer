import React, {useState} from 'react';
import {calculateWinner} from './helper.js';
import './game.css'
import Board from './board';

const Game = () =>{
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXisNext] = useState(true);
    const winner = calculateWinner(history[stepNumber]);
    const xo = xIsNext ? "X" : "O";

    const handleClick = (i) =>{
        const historyPoint = history.slice(0, stepNumber + 1);
        const current = historyPoint[stepNumber];
        const squares = [...current];
        //return if won or occupies
        if(winner || squares[i]) return;
        //select square
        squares[i] = xo;
        setHistory([...historyPoint, squares]);
        setStepNumber(historyPoint.length);
        setXisNext(!xIsNext);
    };


    return(
        <div className="board-container">
            <h1 className="board-header">Tic-Tac-Toe</h1>
            <Board squares={history[stepNumber]} onClick={handleClick} />
            <div className="info-wrapper">
                
                <h3 className="turn-text">{winner ? "Winner: " + winner : "It's " + xo + "'s turn"}</h3>
            </div>
        </div>
    )
}

export default Game;