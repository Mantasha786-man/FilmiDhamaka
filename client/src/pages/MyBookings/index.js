import React, { useEffect, useState } from 'react';
import { message, Card, Row, Col, Tag, Spin } from 'antd';
import PageTitle from '../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import { GetUserBookings } from '../../apiscalls/Bookings';
import { GetAllMovies } from '../../apiscalls/movies';
import moment from 'moment';
import jsPDF from 'jspdf';
import './MyBookings.css';


const { Meta } = Card;

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getMovies = async () => {
    try {
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
  };

  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetUserBookings();
      if (response.success) {
        // Only show confirmed bookings, not pending ones
        const confirmedBookings = response.data.filter(booking => booking.status === 'confirmed');
        setBookings(confirmedBookings);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
    getMovies();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'blue';
    }
  };

  const generateTicketPDF = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Movie Ticket', 105, 15, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Movie: ${booking.movieName}`, 20, 30);
    doc.text(`Theater: ${booking.theaterName}`, 20, 40);
    doc.text(`Date: ${moment(booking.showDate).format('MMM Do YYYY')}`, 20, 50);
    doc.text(`Time: ${moment(booking.showTime, "HH:mm").format("hh:mm A")}`, 20, 60);
    doc.text(`Seats: ${booking.seats.join(', ')}`, 20, 70);
    doc.text(`Amount: ₹${booking.totalAmount}`, 20, 80);
    doc.text(`Booked on: ${moment(booking.bookingDate).format('MMM Do YYYY, h:mm A')}`, 20, 90);
    doc.text(`Status: ${booking.status.toUpperCase()}`, 20, 100);

    doc.setLineWidth(0.5);
    doc.line(20, 105, 190, 105);

    doc.setFontSize(10);
    doc.text('Thank you for booking with us!', 105, 115, null, null, 'center');

    doc.save(`Ticket_${booking._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <PageTitle title="My Bookings"/>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h2>No bookings found</h2>
          <p>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <Row gutter={[16, 16]} className="bookings-grid">
          {bookings.map((booking) => (
            <Col xs={24} sm={12} md={8} lg={6} key={booking._id}>
              <Card
                className="booking-card"
                hoverable
                cover={
                  (() => {
                    const movie = movies.find(m => m.title === booking.movieName);
                    if (movie && movie.poster) {
                      return (
                        <img
                          src={movie.poster}
                          alt={booking.movieName}
                          style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                        />
                      );
                    } else {
                      return (
                        <div className="movie-poster-placeholder">
                          <i className="ri-movie-2-line"></i>
                          <h3>{booking.movieName}</h3>
                        </div>
                      );
                    }
                  })()
                }
              >
                <Meta
                  title={
                    <div className="booking-header">
                      <span className="movie-title">{booking.movieName}</span>
                      <Tag color={getStatusColor(booking.status)} className="status-tag">
                        {booking.status.toUpperCase()}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="booking-details">
                      <div className="detail-item">
                        <i className="ri-building-line" style={{ color: '#002E2A' }}></i>
                        <span>Theater: {booking.theaterName}</span>
                      </div>

                      <div className="detail-item">
                        <i className="ri-calendar-event-line" style={{ color: '#002E2A' }}></i>
                        <span>Date: {moment(booking.showDate).format('MMM Do YYYY')}</span>
                      </div>

                      <div className="detail-item">
                        <i className="ri-time-line" style={{ color: '#002E2A' }}></i>
                        <span>Time: {moment(booking.showTime, "HH:mm").format("hh:mm A")}</span>
                      </div>

                      <div className="detail-item">
                        <i className="ri-chair-line" style={{ color: '#002E2A' }}></i>
                        <span>Seats: {booking.seats.join(', ')}</span>
                      </div>

                      <div className="detail-item">
                        <i className="ri-money-rupee-circle-line" style={{ color: '#002E2A' }}></i>
                        <span className="amount">Amount: ₹{booking.totalAmount}</span>
                      </div>

                      <div className="detail-item">
                        <i className="ri-calendar-check-line" style={{ color: '#002E2A' }}></i>
                        <span>Booked on: {moment(booking.bookingDate).format('MMM Do YYYY, h:mm A')}</span>
                      </div>
                      <button
                        style={{
                          marginTop: '10px',
                          display: 'block',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          backgroundColor: '#002E2A',
                          border: '1px solid #002E2A',
                          color: '#fff',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        onClick={() => generateTicketPDF(booking)}
                      >
                        Download Ticket
                      </button>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default MyBookings;
