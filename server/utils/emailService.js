const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'siddikimantasha644@gmail.com',
    pass: process.env.EMAIL_PASS || 'yeckhtknmbetabnw'
  }
});

// Function to send booking confirmation email
const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'siddikimantasha644@gmail.com',
      to: userEmail,
      subject: 'Booking Confirmation - Your Movie Ticket is Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Booking Confirmed!</h2>
          <p>Dear Customer,</p>
          <p>Your booking has been confirmed by the admin. Here are the details:</p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <h3>Booking Details:</h3>
            <p><strong>Movie:</strong> ${bookingDetails.movieName}</p>
            <p><strong>Theater:</strong> ${bookingDetails.theaterName}</p>
            <p><strong>Show Date:</strong> ${new Date(bookingDetails.showDate).toLocaleDateString()}</p>
            <p><strong>Show Time:</strong> ${bookingDetails.showTime}</p>
            <p><strong>Seats:</strong> ${bookingDetails.seats.join(', ')}</p>
            <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount}</p>
            <p><strong>Booking Date:</strong> ${new Date(bookingDetails.bookingDate).toLocaleString()}</p>
          </div>
          <p>Please arrive at the theater 15 minutes before the show time.</p>
          <p>Thank you for choosing our service!</p>
          <p>Best regards,<br>Movie Booking Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
};
// exportting the function..
module.exports = {
  sendBookingConfirmationEmail
};
