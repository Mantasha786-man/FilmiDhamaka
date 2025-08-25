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
mongoose.connect('mongodb+srv://siddikianjum321:Mantasha12@cluster0.wsnrb0q.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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

app.use('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false
  });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
