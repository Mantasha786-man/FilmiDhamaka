import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tag, Button, message } from 'antd';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import { GetAllBookings, ConfirmBooking } from '../../apiscalls/Bookings';
import moment from 'moment';

function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const handleConfirmBooking = async (bookingId) => {
    try {
      dispatch(ShowLoading());
      const response = await ConfirmBooking(bookingId);
      if (response.success) {
        message.success(response.message);
        getBookings(); // Refresh the list
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const columns = [
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Movie',
      dataIndex: 'movieName',
      key: 'movieName',
    },
    {
      title: 'Theater',
      dataIndex: 'theaterName',
      key: 'theaterName',
    },
    {
      title: 'Date & Time',
      key: 'showInfo',
      render: (record) => (
        <span>
          {moment(record.showDate).format('MMM Do YYYY')} at {moment(record.showTime, "HH:mm").format("hh:mm A")}
        </span>
      ),
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats) => seats.join(', '),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `₹${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'confirmed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Booking Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => moment(date).format('MMM Do YYYY, h:mm A'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        record.status === 'pending' && (
          <Button 
            type="primary" 
            onClick={() => handleConfirmBooking(record._id)}
          >
            Confirm
          </Button>
        )
      ),
    },
  ];

  return (
    <div>
      <Table 
        columns={columns} 
        dataSource={bookings} 
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default BookingsList;
