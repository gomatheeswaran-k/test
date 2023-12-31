const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true
  },
  noOfSeats: {
    type: Number,
    required: true,
  },
  isVideoConf: {
    type: Boolean,
    default: false,
    required: true
  },
  isProjector: {
    type: Boolean,
    default: false,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
