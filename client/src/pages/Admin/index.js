import React, { useState } from 'react';
import PageTitle from '../../components/PageTitle'
import { Tabs } from 'antd';
import MoviesList from './MoviesList';
import TheatresList from './TheatresList';
import BookingsList from './BookingsList';
import ContactMessagesList from './ContactMessagesList';
import Dashboard from './Dashboard';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <PageTitle title="Admin"/>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.TabPane tab="Dashboard" key="dashboard">
          <Dashboard onTabChange={handleTabChange} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Movies" key="movies">
            <MoviesList />
        </Tabs.TabPane>
         <Tabs.TabPane tab="Theatres" key="theatres">
           <TheatresList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Bookings" key="bookings">
          <BookingsList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Contact Messages" key="contacts">
          <ContactMessagesList />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Admin
