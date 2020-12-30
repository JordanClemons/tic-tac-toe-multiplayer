import React from 'react';

const Square = ({value, onClick, yourTurn}) => {
    return(
        <button className={value ? `squares ${value} button-${yourTurn}` : `squares button-${yourTurn}`} onClick={onClick}>
            {value}
        </button>
    )
}

export default Square;