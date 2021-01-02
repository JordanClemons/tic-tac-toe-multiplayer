import React from 'react';

const Square = ({value, onClick, yourTurn}) => {
    return(
        <div className={value ? `squares ${value} button-${yourTurn}` : `squares button-${yourTurn}`} onClick={onClick}>
            {value}
        </div>
    )
}

export default Square;