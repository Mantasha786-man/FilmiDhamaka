const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlistModel');
const User = require('../models/userModel');
const Movie = require('../models/moiveModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Add movie to wishlist
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.userId;

    // Validate input
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required'
      });
    }

    // Check if already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      'userDetails.userId': userId,
      'movieDetails.movieId': movieId
    });
    if (existingWishlistItem) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in wishlist'
      });
    }

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch movie details
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Validate movie has required fields
    if (!movie.title || !movie.description || !movie.duration || !movie.genre || !movie.language || !movie.poster) {
      return res.status(400).json({
        success: false,
        message: 'Movie data is incomplete. Please contact administrator.'
      });
    }

    const wishlistItem = new Wishlist({
      userDetails: {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      movieDetails: {
        movieId: movie._id,
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        genre: movie.genre,
        language: movie.language,
        releaseDate: movie.releaseDate || new Date(),
        poster: movie.poster
      }
    });

    await wishlistItem.save();

    res.status(201).json({
      success: true,
      message: 'Movie added to wishlist successfully',
      data: wishlistItem
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding movie to wishlist',
      error: error.message
    });
  }
});

// Remove movie from wishlist
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.userId;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required'
      });
    }

    const wishlistItem = await Wishlist.findOneAndDelete({
      'userDetails.userId': userId,
      'movieDetails.movieId': movieId
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in wishlist'
      });
    }

    res.json({
      success: true,
      message: 'Movie removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing movie from wishlist',
      error: error.message
    });
  }
});

// Get user's wishlist
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const wishlist = await Wishlist.find({ 'userDetails.userId': userId })
      .sort({ addedAt: -1 });

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
});

// Check if movie is in wishlist
router.get('/check/:movieId', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.userId;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required'
      });
    }

    const wishlistItem = await Wishlist.findOne({
      'userDetails.userId': userId,
      'movieDetails.movieId': movieId
    });

    res.json({
      success: true,
      isInWishlist: !!wishlistItem
    });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist',
      error: error.message
    });
  }
});

module.exports = router;
