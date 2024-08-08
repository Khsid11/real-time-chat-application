const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let clients = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  clients++;
  io.emit('client-total', clients);

  socket.on('new-user', (username) => {
    socket.username = username;
    socket.broadcast.emit('message', {
      username: 'Admin',
      message: `${username} has joined the chat`,
      dateTime: new Date(),
      type: 'text'
    });
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    clients--;
    io.emit('client-total', clients);
    socket.broadcast.emit('message', {
      username: 'Admin',
      message: `${socket.username} has left the chat`,
      dateTime: new Date(),
      type: 'text'
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
