const Mongo = require('../mongo');
const mongo = new Mongo();
const util = require('./util');

const appEvents = (io, socket) => {

  socket.on('login', async(username) => {
    console.log('login emitを受信しました');
    socket.username = username;
    const userData = { socket_id: socket.id, name: username };
    try {
      await mongo.addUser(userData);
      console.log('login success');
      socket.emit('login succeed', username);
    } catch(e) {
      console.log(e);
      console.log('login error');
      socket.emit('login failed', username);
    }
  });

  socket.on('logout', () => {
    console.log('logout');
    util.logout(socket);
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
    util.logout(socket);
  });

}

module.exports = appEvents;