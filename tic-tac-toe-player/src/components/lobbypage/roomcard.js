import React, {useState, useEffect}  from 'react';
import './roomcard.css'

function RoomCard({owner,code, setRedirectCode}) {



  return (
    <div className="roomcard-body">
        <button className="roomcard-container" onClick={() => setRedirectCode(code)}>
            <h1 className="roomcard-name">{owner}'s room</h1>
            <p1 className="roomcard-code">Code: {code}</p1>
        </button>
    </div>
  );
}

export default RoomCard;