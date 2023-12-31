const mongoose = require('mongoose');

const BookingListsSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  bookedBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BookingLists = mongoose.model('BookingLists', BookingListsSchema);

module.exports = BookingLists;
