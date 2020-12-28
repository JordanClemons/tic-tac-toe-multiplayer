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
    console.log('We have a new connection!');
  
    socket.join("lobby");

    socket.on('addRoom', data =>{
        waitingRooms = [data, ...waitingRooms];
        console.log(waitingRooms);
    })

    socket.on('requestRooms', () =>{
        io.emit('rooms', waitingRooms);
    })
  
    socket.on('disconnect', () => {
      console.log('User has left');
    })
  });

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});