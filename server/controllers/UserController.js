// controllers/UserController.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('./../model/Users');
const authMiddleware = require('../middleware/Middleware');


// Apply middleware to all routes in this controller
router.use(authMiddleware);

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await Users.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  const newUser = req.body;
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  // Replace the plain text password with the hashed one
  newUser.password = hashedPassword;

  try {
    const createdUser = await Users.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

// Update an existing user
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;

  try {
    const user = await Users.findByIdAndUpdate(id, updatedUser, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating user' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const usersCount = await Users.countDocuments();

    if (usersCount <= 1) {
      return res.status(400).json({ message: 'At least one master User required to perform this action' });
    }

    const deletedUser = await Users.findByIdAndDelete(id);
    if (deletedUser) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error: error});
  }
});


module.exports = router;

