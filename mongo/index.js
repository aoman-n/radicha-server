const model = require('./model');

class Mongo {

  constructor() {
    this.User = model.User;
    this.Room = model.Room;
    this.Message = model.Message;
  }

  async getRoomList() {
    const rooms = await this.Room.find({}, { _id: 0, 'name': 1 });
    return rooms.map(room => room.name);
  }

  async createRoom(roomname, username) {
    const room = new this.Room({
      name: roomname,
      users: [],
    })
    return room.save();
  }

  async addUser(userData) {
    const user = new this.User(userData);
    return await user.save();
  }

  async findRoom(roomname) {
    return await this.Room.findOne({ name: roomname });
  }

  async joinRoom(username, roomname) {
    const roomData = await this.Room.findOne({ name: roomname });
    const user = await this.User.findOne({ name: username });
    roomData.users.push(user._id);
    return await roomData.save();
  }

  async fetchRoomData(roomname) {
    return await this.Room.
      findOne({ name: roomname }).
      populate('users')
  }

  async fetchMessages(roomId) {
    return await this.Message.find({ room_id: roomId });
  }

  async addMessage(roomname, user, text) {
    const currentRoom = await this.Room.findOne({ name: roomname });
    const message = new this.Message({
      text,
      user,
      room_id: currentRoom._id
    })
    return await message.save();
  }

  async leaveRoom(username, roomname) {
    const roomData = await this.Room.findOne({ name: roomname });
    const user = await this.User.findOne({ name: username });
    roomData.users.some((v, i) => {
      if (v.toString() === user._id.toString()) {
        roomData.users.splice(i, 1);
      }
    });
    return await roomData.save();
  }

  async removeUser(username) {
    return await this.User.deleteOne({ name: username });
  }

  async removeRoom(roomname) {
    return await this.Room.deleteOne({ name: roomname });
  }

}

module.exports = Mongo;