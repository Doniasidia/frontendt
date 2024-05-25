import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace 'http://localhost:3000' with your Socket.IO server URL

// Connect to the Socket.IO server
socket.on('connect', () => {
  console.log('Connected to server');
});

// Handle custom events from the server
socket.on('message', (data) => {
  console.log('Message from server:', data);
});

// Emit events to the server
socket.emit('chatMessage', 'Hello, server!');

// Disconnect from the server
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});


export default socket;
