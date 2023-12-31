// Route.js

const express = require('express');
const router = express.Router();


const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');
const roomController = require('../controllers/RoomController');
const bookingController = require('../controllers/BookingController');

// Register the Controller routes
router.use('/users', userController);
router.use('/auth', authController);
router.use('/rooms', roomController);
router.use('/book-room', bookingController);

module.exports = router;