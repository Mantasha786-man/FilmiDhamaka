const express = require('express');
const Booking = require('../models/bookingModel');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new booking
router.post('/create-booking', async (req, res) => {
    try {
        const bookingData = req.body;
        const newBooking = new Booking(bookingData);
        await newBooking.save();

        res.status(201).json({ success: true, message: 'Booking created successfully', data: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Booking creation failed', error: error.message });
    }
});

// Get all bookings (for admin)
router.get('/all-bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookingDate: -1 });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get bookings', error: error.message });
    }
});

// Get user bookings
router.get('/user-bookings', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // Get actual user ID from auth middleware
        const bookings = await Booking.find({ userId }).sort({ bookingDate: -1 });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get bookings', error: error.message });
    }
});

// Confirm booking
router.post('/confirm-booking/:bookingId', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'confirmed';
        await booking.save();

        res.status(200).json({ success: true, message: 'Booking confirmed', data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to confirm booking', error: error.message });
    }
});

module.exports = router;
