const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Allow CORS for all origins (frontend: localhost:3000)
app.use(cors());

// Parse JSON body
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/movies';
console.log('Using MongoDB URI:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.log('MongoDB connection error:', err.message);
  console.log('Please make sure MongoDB is running on your local machine');
});

// Import routes
const userRoutes = require('./routes/usersRoute');
const movieRoutes = require('./routes/moviesRoute');
const theatreRoute=require('./routes/theatreRoute');
const bookingsRoute = require('./routes/bookingsRoute');
app.use('/api/users', userRoutes);
app.use('/api/movies',movieRoutes);
app.use('/api/theatres',theatreRoute);
app.use('/api/bookings', bookingsRoute);

// Start server
const PORT = process.env.PORT || 5000;
__dirname = path.resolve();
//render deployement
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
