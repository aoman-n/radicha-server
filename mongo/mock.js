const model = require('./model');
const User = model.User;
const Room = model.Room;
const Message = model.Message;

/* モックデータの投入 */
(async() => {
  // user情報の保存
  const user1 = new User({
    socket_id: 'piyopiyo',
    name: 'takada'
  });
  const user2 = new User({
    socket_id: 'hogehoge',
    name: 'komeda'
  })
  await user1.save();
  await user2.save();
  // room情報の保存
  const generalRoom = new Room({
    name: 'general',
    users: [
      {
        socket_id: 'piyopiyo',
        name: 'takada'
      },
      {
        socket_id: 'hogehoge',
        name: 'komeda' 
      }
    ]
  });
  const nextRoom = new Room({
    name: 'next',
    users: []
  });
  const savedGeneralRoom = await generalRoom.save();
  await nextRoom.save();

  // message情報の保存
  const message1 = new Message({
    user: 'aoba',
    text: 'こんにちは',
    room_id: savedGeneralRoom._id
  })
  const message2 = new Message({
    user: 'tanaka',
    text: 'おはよう',
    room_id: savedGeneralRoom._id
  })
  await message1.save();
  await message2.save();

})();