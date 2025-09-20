const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movies',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure a user can't add the same movie twice
wishlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
