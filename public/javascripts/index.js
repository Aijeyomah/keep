/* eslint-disable no-undef */
const socket = io('http://localhost:8080');
socket.on('connect', () => {
  console.log('[connected');

  socket.emit('send user id', '82c96a01-8e0a-4e7f-a165-0cf281b3d14d');
  socket.on('notify user', (task) => {
    console.log(task, 'your task is due');
  });
  socket.emit('disconnect');
});
