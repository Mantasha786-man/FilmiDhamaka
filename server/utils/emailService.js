const nodemailer = require('nodemailer');

// Create transporter with SMTP configuration
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

// Send booking confirmation email
const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Booking Confirmed - FilmiDhamaka',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Booking Confirmed!</h2>
        <p>Dear Customer,</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Movie:</strong> ${bookingDetails.movieName}</p>
          <p><strong>Theater:</strong> ${bookingDetails.theaterName}</p>
          <p><strong>Date:</strong> ${new Date(bookingDetails.showDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${bookingDetails.showTime}</p>
          <p><strong>Seats:</strong> ${bookingDetails.seats.join(', ')}</p>
          <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount}</p>
        </div>
        <p>Thank you for choosing FilmiDhamaka!</p>
        <p>Best regards,<br>FilmiDhamaka Team</p>
      </div>
    `
  };

  try {
    console.log('Attempting to send confirmation email to:', userEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', userEmail, 'Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending confirmation email:', error.message);
    console.error('Error details:', error);
  }
};

// Send booking cancellation email
const sendBookingCancellationEmail = async (userEmail, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Booking Cancelled - FilmiDhamaka',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f44336;">Booking Cancelled</h2>
        <p>Dear Customer,</p>
        <p>Your booking has been cancelled. Here are the details:</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Movie:</strong> ${bookingDetails.movieName}</p>
          <p><strong>Theater:</strong> ${bookingDetails.theaterName}</p>
          <p><strong>Date:</strong> ${new Date(bookingDetails.showDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${bookingDetails.showTime}</p>
          <p><strong>Seats:</strong> ${bookingDetails.seats.join(', ')}</p>
          <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount}</p>
        </div>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>FilmiDhamaka Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent to:', userEmail, 'Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail
};
