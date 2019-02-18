const Mongo = require('./index');
const mongo = new Mongo();

(async() => {

  // add user
  const user = new mongo.User({
    name: 'testuser',
    socket_id: 'testIdId'
  });
  await user.save();
  const addedUsers = await mongo.User.find();

  // remove user
  await mongo.removeUser('testuser');
  const removedUsers = await mongo.User.find();

  // remove users in general room
  const roomData = await mongo.Room.findOne({ name: 'general' });
  roomData.users = [];
  await roomData.save();

  // get room list
  const roomList = await mongo.getRoomList();

  const room = await mongo.fetchRoomData('aobaroom');

})();


