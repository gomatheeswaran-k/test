const express = require('express');
const cors = require('cors');
const connectDB = require('./server/database/db');
const router = require('./server/routes/Router');

const app = express();

//Enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Use the routes in the main application
app.use('/', router);

// Start the server
const port = 3001; // Choose the desired port number

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});