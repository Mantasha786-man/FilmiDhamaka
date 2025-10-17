const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { sendBookingConfirmationEmail, sendBookingCancellationEmail } = require('../utils/emailService');

// Create a new booking
router.post('/create-booking', async (req, res) => {
    try {
        const bookingData = req.body;

        // Import Show model for seat validation
        const Show = require('../models/showModel');

        // Check if the show exists
        const show = await Show.findById(bookingData.showId);
        if (!show) {
            return res.status(404).json({ success: false, message: 'Show not found' });
        }

        // Check if any of the requested seats are already booked
        const conflictingSeats = bookingData.seats.filter(seat =>
            show.bookedSeats.includes(seat.toString())
        );

        if (conflictingSeats.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Seats ${conflictingSeats.join(', ')} are already booked. Please select different seats.`
            });
        }

        // Temporarily reserve seats by adding them to bookedSeats
        // This prevents race conditions during concurrent bookings
        const updatedBookedSeats = [...show.bookedSeats, ...bookingData.seats.map(seat => seat.toString())];
        await Show.findByIdAndUpdate(bookingData.showId, { bookedSeats: updatedBookedSeats });

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

// Get booked seats for a specific show
router.get('/booked-seats/:showId', async (req, res) => {
    try {
        const Show = require('../models/showModel');
        const show = await Show.findById(req.params.showId);

        if (!show) {
            return res.status(404).json({ success: false, message: 'Show not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                bookedSeats: show.bookedSeats || [],
                totalSeats: show.totalSeats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get booked seats', error: error.message });
    }
});

// Cancel booking and release seats
router.post('/cancel-booking/:bookingId', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Only allow cancellation of pending bookings
        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending bookings can be cancelled' });
        }

        const Show = require('../models/showModel');
        const show = await Show.findById(booking.showId);

        if (show) {
            // Remove the seats from bookedSeats array
            const updatedBookedSeats = show.bookedSeats.filter(seat =>
                !booking.seats.includes(seat.toString())
            );
            await Show.findByIdAndUpdate(booking.showId, { bookedSeats: updatedBookedSeats });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
    }
});

// Confirm booking
router.post('/confirm-booking/:bookingId', async (req, res) => {
    try {
        // Validate bookingId
        if (!req.params.bookingId || !mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
            return res.status(400).json({ success: false, message: 'Invalid booking ID' });
        }

        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Check if already confirmed
        if (booking.status === 'confirmed') {
            return res.status(400).json({ success: false, message: 'Booking is already confirmed' });
        }

        booking.status = 'confirmed';
        await booking.save();

        // Send confirmation email
        await sendBookingConfirmationEmail(booking.userEmail, booking);

        res.status(200).json({ success: true, message: 'Booking confirmed successfully', data: booking });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm booking', error: error.message });
    }
});

// Admin cancel booking (for admin to cancel any booking)
router.post('/admin-cancel-booking/:bookingId', async (req, res) => {
    try {
        // Validate bookingId
        if (!req.params.bookingId || !mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
            return res.status(400).json({ success: false, message: 'Invalid booking ID' });
        }

        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Check if already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
        }

        // Release seats if booking was confirmed
        if (booking.status === 'confirmed') {
            const Show = require('../models/showModel');
            const show = await Show.findById(booking.showId);
            if (show) {
                // Remove the seats from bookedSeats array
                const updatedBookedSeats = show.bookedSeats.filter(seat =>
                    !booking.seats.includes(seat.toString())
                );
                await Show.findByIdAndUpdate(booking.showId, { bookedSeats: updatedBookedSeats });
            }
        }

        booking.status = 'cancelled';
        await booking.save();

        // Send cancellation email
        await sendBookingCancellationEmail(booking.userEmail, booking);

        res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
    }
});

module.exports = router;
