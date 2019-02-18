const express = require('express');
const router = express.Router();
const Mongo = require('../mongo');

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

router.get('/rooms', (req, res, next) => {
  (async () => {
    try {
      const mongo = new Mongo();
      const roomList = await mongo.getRoomList();
      res.json({ roomList });
    } catch(err) {
      next();
    }
  })();
});

module.exports = router;