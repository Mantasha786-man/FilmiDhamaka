
import { axiosInstance } from './axiosConfig';

// Make payment (updated for mock system)
export const MakePayment = async (amount) => {
    try {
        const response = await axiosInstance.post("/api/bookings/make-payment", {
            amount: amount
        });
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Payment failed"
        };
    }
}

// Create booking
export const CreateBooking = async (bookingData) => {
    try {
        const response = await axiosInstance.post("/api/bookings/create-booking", bookingData);
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Booking creation failed"
        };
    }
}

// Get all bookings (for admin)
export const GetAllBookings = async () => {
    try {
        const response = await axiosInstance.get('/api/bookings/all-bookings');
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Failed to get all bookings"
        };
    }
}

// Get user bookings
export const GetUserBookings = async () => {
    try {
        const response = await axiosInstance.get('/api/bookings/user-bookings');
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Failed to get user bookings"
        };
    }
}

// Confirm booking
export const ConfirmBooking = async (bookingId) => {
    try {
        const response = await axiosInstance.post(`/api/bookings/confirm-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Failed to confirm booking"
        };
    }
}

// Get booking details
export const GetBooking = async (bookingId) => {
    try {
        const response = await axiosInstance.get(`/api/bookings/booking/${bookingId}`);
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Failed to get booking details"
        };
    }
}

// Get booked seats for a specific show
export const GetBookedSeats = async (showId) => {
    try {
        const response = await axiosInstance.get(`/api/bookings/booked-seats/${showId}`);
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Failed to get booked seats"
        };
    }
}

// Cancel booking
export const CancelBooking = async (bookingId) => {
    try {
        const response = await axiosInstance.post(`/api/bookings/cancel-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Failed to cancel booking"
        };
    }
}

// Admin cancel booking
export const AdminCancelBooking = async (bookingId) => {
    try {
        const response = await axiosInstance.post(`/api/bookings/admin-cancel-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Failed to cancel booking"
        };
    }
}

