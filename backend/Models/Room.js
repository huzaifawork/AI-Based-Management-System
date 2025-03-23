// Models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  roomType: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false }, // Image path (optional)
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
