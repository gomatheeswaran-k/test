const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Users = require('./../model/Users');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Find the user by email
      const user = await Users.findOne({ email });

      // If the user is not found, return authentication failed
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      // If passwords don't match, return authentication failed
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Authentication succeeded, generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        'fECq9wPbwi73VcY9sFUW30ZC2b775Njz-emVihPm3142ZbxGcn76cfz29KqfSxCM', // Replace 'your-secret-key' with your actual secret key
        { expiresIn: '1h' } // Set token expiration time (e.g., 1 hour)
    );

    // Send the token in the response upon successful login
    res.status(200).json({ message: 'Authentication succeeded', user_data: user, token: token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;