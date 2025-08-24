const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Show'
  },
  movieName: {
    type: String,
    required: true
  },
  theaterName: {
    type: String,
    required: true
  },
  showTime: {
    type: String,
    required: true
  },
  showDate: {
    type: Date,
    required: true
  },
  seats: {
    type: [String],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending' // pending, confirmed, cancelled
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  userEmail: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
