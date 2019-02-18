const appEvents = require('./app');
const directMessageEvents = require('./directMessage');
const roomEvents = require('./room');

const ioEvents = io => {
  io.on('connection', socket => {
    console.log('client connected');
    appEvents(io, socket);
    roomEvents(io, socket);
    directMessageEvents(io, socket);
  })
}

const init = app => {
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  ioEvents(io);
  return server;
}

module.exports = init;