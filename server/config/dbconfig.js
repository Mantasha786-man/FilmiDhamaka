const mongoose = require('mongoose');
// Import URL from environment variables
const MONGO_URL = process.env.MONGO_URL ;

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err.message);
    });

mongoose.set('strictQuery', false);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log("MongoDB connection established");
});

connection.on('error', (err) => {
    console.log("MongoDB connection error:", err.message);
});

connection.on('disconnected', () => {
    console.log("MongoDB connection disconnected");
});

module.exports = connection;
