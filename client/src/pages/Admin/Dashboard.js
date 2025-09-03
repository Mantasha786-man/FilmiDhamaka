import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, message } from 'antd';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../apiscalls/axiosConfig';
import {
  MovieIcon,
  TheatreIcon,
  BookingIcon,
  ContactIcon
} from './DashboardIcons';
import './Dashboard.css';

function Dashboard({ onTabChange }) {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheatres: 0,
    totalBookings: 0,
    totalContacts: 0,
    pendingBookings: 0
  });
  // Removed recentMovies state as per user request
  const dispatch = useDispatch();

  const fetchStats = async () => {
    try {
      dispatch(ShowLoading());

      // Fetch movies count and details
      const moviesResponse = await axiosInstance.get('/api/movies/get-all-movies');
      const moviesData = moviesResponse.data;
      const totalMovies = moviesData.success ? moviesData.data.length : 0;
      // Removed recentMovies fetching as per user request

      // Fetch theatres count
      const theatresResponse = await axiosInstance.get('/api/theatres/get-all-theatres');
      const theatresData = theatresResponse.data;
      const totalTheatres = theatresData.success ? theatresData.data.length : 0;

      // Fetch bookings count
      const bookingsResponse = await axiosInstance.get('/api/bookings/all-bookings');
      const bookingsData = bookingsResponse.data;
      const totalBookings = bookingsData.success ? bookingsData.data.length : 0;
      const pendingBookings = bookingsData.success ?
        bookingsData.data.filter(booking => booking.status === 'pending').length : 0;

      // Fetch contacts count
      const contactsResponse = await axiosInstance.get('/api/contacts/get-all-contacts');
      const contactsData = contactsResponse.data;
      const totalContacts = contactsData.success ? contactsData.data.length : 0;

      setStats({
        totalMovies,
        totalTheatres,
        totalBookings,
        totalContacts,
        pendingBookings
      });

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to load dashboard statistics');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);



  return (
    <div className="dashboard-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin control panel</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Movies"
              value={stats.totalMovies}
              prefix={<MovieIcon />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Theatres"
              value={stats.totalTheatres}
              prefix={<TheatreIcon />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Bookings"
              value={stats.totalBookings}
              prefix={<BookingIcon />}
              valueStyle={{ color: '#faad14' }}
            />
            {stats.pendingBookings > 0 && (
              <div className="text-sm text-orange-600 mt-2">
                {stats.pendingBookings} pending confirmation
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Contact Messages"
              value={stats.totalContacts}
              prefix={<ContactIcon />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Movies Section */}

      {/* Recent Activity Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Recent Activity</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Pending Bookings" className="activity-card">
              <div className="text-center py-8">
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {stats.pendingBookings}
                </div>
                <p className="text-gray-600 mb-4">Bookings waiting for confirmation</p>
                <Button
                  type="primary"
                  onClick={() => onTabChange('bookings')}
                >
                  View All Bookings
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="New Messages" className="activity-card">
              <div className="text-center py-8">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {stats.totalContacts}
                </div>
                <p className="text-gray-600 mb-4">Contact messages received</p>
                <Button
                  type="primary"
                  onClick={() => onTabChange('contacts')}
                >
                  View Messages
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Dashboard;
