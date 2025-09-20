const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  // User details (embedded)
  userDetails: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },

  // Movie details (embedded)
  movieDetails: {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'movies',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    genre: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    releaseDate: {
      type: Date,
      required: true
    },
    poster: {
      type: String,
      required: true
    }
  },

  // Metadata
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure a user can't add the same movie twice
wishlistSchema.index({ 'userDetails.userId': 1, 'movieDetails.movieId': 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
