const mongoose = require('mongoose');

const connectDB = () => {
    // Connection URL for MongoDB Atlas
    const uri = "mongodb+srv://aravind:cactus098@cactusconferencecheckin.pakmmqm.mongodb.net/?retryWrites=true&w=majority";
    // const uri = "mongodb://aravind:cactus098@main-shard-00-00-03xkr.mongodb.net:27017,main-shard-00-01-03xkr.mongodb.net:27017,main-shard-00-02-03xkr.mongodb.net:27017/main?ssl=true&replicaSet=Main-shard-0&authSource=admin&retryWrites=true"
    // Create the Mongoose connection
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to MongoDB Atlas');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
      });
  };

  module.exports = connectDB;