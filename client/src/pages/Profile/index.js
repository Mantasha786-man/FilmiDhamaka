import React, { useEffect, useState } from 'react';
import { Tabs, Table, Tag, message } from 'antd';
import PageTitle from '../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import { GetUserBookings } from '../../apiscalls/Bookings';
import moment from 'moment';

function Profile() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

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
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const columns = [
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
          {moment(record.showDate).format('MMM Do YYYY')} at {record.showTime}
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
  ];

  return (
    <div>
      <PageTitle title="Profile"/>
      <Tabs defaultActiveKey='1'>
        <Tabs.TabPane tab="Bookings" key="1">
          <Table 
            columns={columns} 
            dataSource={bookings} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Profile
