import React, { useEffect, useState, useCallback } from 'react';
import { Table, message } from 'antd';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import { getAllContacts } from '../../apiscalls/contact';
import moment from 'moment';

function ContactMessagesList() {
  const [contacts, setContacts] = useState([]);
  const dispatch = useDispatch();

  const getContacts = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllContacts();
      if (response.success) {
        setContacts(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (message) => (
        <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
          {message}
        </div>
      ),
    },
    {
      title: 'Submitted At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('MMM Do YYYY, h:mm A'),
    },
  ];

  return (
    <div>
      <h2>Contact Messages</h2>
      <Table
        columns={columns}
        dataSource={contacts}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default ContactMessagesList;
