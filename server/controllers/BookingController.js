const express = require('express');
const router = express.Router();
const BookRoom = require('../model/BookingLists');
const Users = require('../model/Users');
const Rooms = require('../model/Room');
const moment = require('moment');
const authMiddleware = require('../middleware/Middleware');
const { isBefore, isAfter, isSameDay, isWithinInterval } = require('date-fns');

// Apply middleware to all routes in this controller
router.use(authMiddleware);

// Get all bookings with associated user information and room names
router.get('/', async (req, res) => {
  try {
    const { role, userId } = req.user; // Assuming req.user contains user details from token
    let bookings;

    if (role === 'admin') {
      bookings = await BookRoom.find();
    } else {
      bookings = await BookRoom.find({ bookedBy: userId });
    }

    const bookingsWithUserAndRoom = await Promise.all(
      bookings.map(async (booking) => {
        const { roomId, bookedBy, ...bookingData } = booking.toObject();
        const user = await Users.findById(bookedBy);
        const room = await Rooms.findById(roomId);
        const userName = user ? user.username : 'Unknown';
        const roomName = room ? room.roomName : 'Unknown';
        return { ...bookingData, userName, roomName };
      })
    );

    res.json(bookingsWithUserAndRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings with user and room information' });
  }
});

router.get('/get-date-time', async (req, res) => {
  try{
    const data = await BookRoom.find({}, 'fromDate toDate startTime endTime');
    res.json(data);
  } catch(error){
    res.status(400).json({message: 'Error in getting data'});
  }
})

  // Get a specific room by ID
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await BookRoom.findById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  });
  
  // Create a new room
  
  router.post('/', async (req, res) => {
    const newBooking = req.body;
    const { roomId, fromDate, toDate, startTime, endTime } = newBooking;
  
    try {
      // Get existing bookings for the room
      const existingBookings = await BookRoom.find({ roomId });
  
      // Check for conflicts
      const conflict = existingBookings.some((booking) => {
        const bookingStartDate = new Date(booking.fromDate);
        const bookingEndDate = new Date(booking.toDate);
        const newBookingStartDate = new Date(fromDate);
        const newBookingEndDate = new Date(toDate);
  
        // Check if the dates are the same
        const datesAreSame = isSameDay(newBookingStartDate, bookingStartDate);
  
        let dateOverlap = false;
        if (datesAreSame) {
          // Check for date overlap
          dateOverlap = !(
            isAfter(newBookingStartDate, bookingEndDate) || isBefore(newBookingEndDate, bookingStartDate)
          );
        }
  
        let timeOverlap = false;
        
        if (datesAreSame && dateOverlap) {
          // Check for time overlap
          // Convert time strings to minutes from midnight
        const startTimeMinutes = getMinutesFromMidnight(startTime);
        const endTimeMinutes = getMinutesFromMidnight(endTime);
        const bookingStartTimeMinutes = getMinutesFromMidnight(booking.startTime);
        const bookingEndTimeMinutes = getMinutesFromMidnight(booking.endTime);

          // Check for time overlap
          timeOverlap = !(
            endTimeMinutes <= bookingStartTimeMinutes || startTimeMinutes >= bookingEndTimeMinutes
          );
        }
        
        return dateOverlap && timeOverlap;
      });
      
      if (conflict) {
        return res.status(400).json({ message: 'Room already booked for this time' });
      }
  
      // No conflict, create the new booking
      const createdRoom = await BookRoom.create(newBooking);
      res.status(201).json(createdRoom);
    } catch (error) {
      res.status(400).json({ message: 'Error creating Booking' });
    }
  });

  // Function to convert time string to minutes from midnight
function getMinutesFromMidnight(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
  
  // Update an existing room
  router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedBooking = req.body;
  
    try {
      const room = await BookRoom.findByIdAndUpdate(id, updatedBooking, { new: true });
      if (room) {
        res.json(room);
      } else {
        res.status(404).json({ message: 'Booking not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error updating room' });
    }
  });
  
  // Delete a room
  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const deletedRoom = await BookRoom.findByIdAndDelete(id);
      if (deletedRoom) {
        res.json({ message: 'Booking deleted' });
      } else {
        res.status(404).json({ message: 'Booking not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error deleting room'});
    }
  });
  
  module.exports = router;