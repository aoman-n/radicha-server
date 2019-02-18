const Mongo = require('../mongo');
const mongo = new Mongo();
const util = require('./util');

const roomEvents = (io, socket) => {

  socket.on('create room', async(roomname) => {
    const room = await mongo.createRoom(roomname, socket.username);
    io.emit('add room', room.name);
    socket.emit('created room', room.name);
  });

  socket.on('join', async(data) => {
    const { username, roomname } = data;
    const userData = { socket_id: socket.id, name: username };
    const existRoom = await mongo.findRoom(roomname);
    if (existRoom === null) {
      socket.emit('not found room');
      return;
    }
    const { room, id } = socket;
    if (room) {
      socket.to(room).emit('chat message', { user: '', text: `${username} さんが退出しました。` });
      socket.to(room).emit('leave user', id);
      socket.leave(room);
      await util.runLeaveRoom(username, room);
      delete socket.room;
      delete socket.username;
    }
    socket.join(roomname);
    socket.username = username;
    socket.room = roomname;
    await mongo.joinRoom(username, roomname);
    const roomData = await mongo.fetchRoomData(roomname);
    const messages = await mongo.fetchMessages(roomData._id);
    socket.to(roomname).emit('user join', userData);
    socket.emit('initialize room data', { users: roomData.users, messages });
    socket.emit('chat message', { user: '', text: `${username} として入室しました。` });
  });

  socket.on('chat message', async(text) => {
    const { username, room } = socket;
    await mongo.addMessage(room, username, text);
    const msg = { user: username, text }
    socket.to(room).emit('chat message', msg);
  });

  socket.on('remove room', async(roomname) => {
    // ルームマスターであるかsocket_idを使ってチェック
    const roomData = await mongo.fetchRoomData(roomname);
    if (roomData.users[0].socket_id === socket.id) {
      await mongo.removeRoom(roomname);
    }
    io.in(roomname).emit('eject from room');
    io.emit('removed room', roomname);
  });

  socket.on('leave the room', async() => {
    const { room } = socket;
    socket.leave(room);
    delete socket.room;
  });

}

module.exports = roomEvents