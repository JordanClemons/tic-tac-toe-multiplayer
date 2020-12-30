import React from 'react';
import Square from './square';

const Board = ({squares, onClick, yourTurn}) => {
    return(
        <div className="board">
            {squares.map((square, i) => (
                <Square key={i} value={square}  onClick={() => onClick(i)} yourTurn={yourTurn} />
            ))}
        </div>
    )
}

export default Board;