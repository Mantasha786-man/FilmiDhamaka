const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow CORS for all origins (frontend: localhost:3000 and netlify)
app.use(cors({
  origin: ['https://filmidhamaka.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON body
app.use(express.json());

// Connect to MongoDB with increased timeout
mongoose.connect('mongodb+srv://siddikianjum321:Mantasha12@cluster0.wsnrb0q.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/usersRoute');
const movieRoutes = require('./routes/moviesRoute');
const theatreRoute=require('./routes/theatreRoute');
const bookingsRoute = require('./routes/bookingsRoute');
const contactRoute = require('./routes/contactRoute');
const wishlistRoute = require('./routes/wishlistRoute');
app.use('/api/users', userRoutes);
app.use('/api/movies',movieRoutes);
app.use('/api/theatres',theatreRoute);
 app.use('/api/bookings', bookingsRoute);
app.use('/api/contacts', contactRoute);
app.use('/api/wishlist', wishlistRoute);

app.get('/', (req, res) => {
  res.json({
    success:true,
    message: 'backend is running',
    timestamp: new Date()
  });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


