const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow CORS for all origins (frontend: localhost:3000)
app.use(cors());

// Parse JSON body
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movies')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

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
const port = process.env.PORT || 6000;

const path=require('path');
__dirname=path.resolve();

//render deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client','build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Server running on port ${port}`));