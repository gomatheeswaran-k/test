const express = require('express');
const router = express.Router();
const Room = require('../model/Room');
const authMiddleware = require('../middleware/Middleware');


// Apply middleware to all routes in this controller
router.use(authMiddleware);

// Get all rooms
router.get('/', async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching rooms' });
    }
  });
  
  // Get a specific room by ID
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await Room.findById(id);
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
    const newRoom = req.body;
  
    try {
      const createdRoom = await Room.create(newRoom);
      res.status(201).json(createdRoom);
    } catch (error) {
      res.status(400).json({ message: 'Error creating room' });
    }
  });
  
  // Update an existing room
  router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedRoom = req.body;
  
    try {
      const room = await Room.findByIdAndUpdate(id, updatedRoom, { new: true });
      if (room) {
        res.json(room);
      } else {
        res.status(404).json({ message: 'Room not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error updating room' });
    }
  });
  
  // Delete a room
  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const deletedRoom = await Room.findByIdAndDelete(id);
      if (deletedRoom) {
        res.json({ message: 'Room deleted' });
      } else {
        res.status(404).json({ message: 'Room not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error deleting room'});
    }
  });
  
  module.exports = router;