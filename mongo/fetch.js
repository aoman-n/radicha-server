const model = require('./model');
const User = model.User;
const Room = model.Room;
const Message = model.Message;

const findRoomName = 'general';

(async() => {

  const room = await Room.findOne({ name: findRoomName });
  console.log(room);
  const roomId = room._id;

  const messages = await Message.find({ room_id: roomId });
  console.log(messages);

})();