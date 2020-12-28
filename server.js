const express = require('express');
const cors = require('cors');
const socketio = require('socket.io')
const http = require('http');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);

//io
var waitingRooms = [];
io.on('connection', (socket) => {
    var userCode;
    console.log('We have a new connection!');
  
    socket.join("lobby");

    socket.on('addRoom', data =>{
        waitingRooms = [data, ...waitingRooms];
        userCode= data;
        console.log(waitingRooms);
        console.log("test1");
    })

    socket.on('requestRooms', () =>{
        io.to(socket.id).emit('rooms', waitingRooms);
        console.log("test2");
    })

    socket.on('joinRoom', code =>{
      socket.leave("lobby");
      socket.join(code);
      io.emit('joinRoom', code);
      console.log("test3");
    })

    socket.on('joinRoomWaiter', code =>{
      io.emit('joinRoomWaiter', code);
      console.log("test6");
    })

    socket.on('joinRoomConfirm', code =>{
      var indexToRemove = waitingRooms.indexOf(userCode);
      if(indexToRemove !== -1){waitingRooms.splice(indexToRemove, 1);}
      console.log(indexToRemove);
      socket.leave("lobby");
      socket.join(code);
      console.log("test7");
    })

    socket.on('testIncrement', testArray =>{
      io.to(testArray[1]).emit('testIncrement', testArray[0]+1);
      console.log("test4");
    })
  
    socket.on('disconnect', () => {
      var indexToRemove = waitingRooms.indexOf(userCode);
      if(indexToRemove !== -1){waitingRooms.splice(indexToRemove, 1);}
      console.log(userCode + ' has left');
      console.log("test5");
    })
  });

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});