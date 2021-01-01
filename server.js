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
  

    socket.on('addRoom', data =>{
        waitingRooms = [data, ...waitingRooms];
        userCode= data;
        socket.join(data[1]);
    })

    socket.on('requestRooms', () =>{
        io.to(socket.id).emit('rooms', waitingRooms);
    })

    socket.on('joinRoom', code =>{
      var room = io.sockets.adapter.rooms[code[1]];
      if(room.length >= 2){io.to(socket.id).emit('tooManyPlayers');}
      else{
        socket.join(code[1]);
        if(userCode === undefined){
          userCode=code;
        }

        var otherUsername ="";
        console.log(waitingRooms);
        console.log(code);
        for(var x = 0; x < waitingRooms.length; x++){
          if(waitingRooms[x][1] === code[1]){
            otherUsername= waitingRooms[x][0];
          }
        }

        var clients = io.sockets.adapter.rooms[code[1]].sockets;
        for (var clientId in clients ) {
          if(clientId !== socket.id){
            io.to(clientId).emit('youAreHost', code);
          }
     }

        var newUserAndCode = [otherUsername, code[1]];
        io.to(socket.id).emit('youAreGuest', newUserAndCode);
        var indexToRemove = -1;
        for(var x = 0; x < waitingRooms.length; x++){
          if(waitingRooms[x][1] ===  userCode[1]){
            indexToRemove = x;
          }
        }
        if(indexToRemove !== -1){waitingRooms.splice(indexToRemove, 1);}
      }
    })

    socket.on('youAreHost', data =>{
        io.to(data[1]).emit('youAreHost', data[0]);
    })

    socket.on('joinRoomWaiter', code =>{
      io.emit('joinRoomWaiter', code);
    })

    socket.on('joinRoomConfirm', code =>{
      var indexToRemove = waitingRooms.indexOf(userCode);
      if(indexToRemove !== -1){waitingRooms.splice(indexToRemove, 1);}
      socket.join(code[1]);
    })

    socket.on('testIncrement', testArray =>{
      var increment = testArray[0] + 1;
      var newArray = [increment, testArray[1]]
      io.to(testArray[1][1]).emit('testIncrement', newArray);
    })

    socket.on('submitMove', data =>{
      //io.to(data[1]).emit('submitMove', data);
      var clients = io.sockets.adapter.rooms[data[1]].sockets;
      for (var clientId in clients ) {
        if(clientId !== socket.id){
          io.to(clientId).emit('submitMove', data);
        }
      }
    })
  
    socket.on('disconnect', () => {
      console.log(userCode + ' has left');
      if(userCode !== undefined){socket.to(userCode[1]).emit("userLeft");}
      var indexToRemove = waitingRooms.indexOf(userCode);
      if(indexToRemove !== -1){waitingRooms.splice(indexToRemove, 1);}
    })
  });

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});