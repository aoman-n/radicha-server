const Mongo = require('../../mongo');
const mongo = new Mongo();

const logout = async(socket) => {
  const { room, username, id } = socket;
  if (room) {
    delete socket.room;
    socket.leave(room);
    await runLeaveRoom(username, room);
    const message = { user: '', text: `${username} さんが退出しました。` };
    socket.to(room).emit('chat message', message);
    socket.to(room).emit('leave user', id);
  }
  delete socket.username;
  await mongo.removeUser(username);
}

const runLeaveRoom = async(username, room) => {
  const roomData = await mongo.leaveRoom(username, room);
  if (roomData.users.length === 0) {
    await mongo.removeRoom(room);
    io.emit('removed room', room);
  }
}

module.exports = {
  logout,
  runLeaveRoom,
}