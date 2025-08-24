import React from 'react';
import { Modal, Button } from 'antd';

const BookingPopup = ({ visible, onClose, onConfirm, selectedDate, availableShowDates }) => {
  return (
    <>
      {/* Blur overlay */}
      {visible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 999,
          }}
        />
      )}
      
      <Modal
        title="Booking Confirmation"
        visible={visible}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onConfirm} disabled={new Date(selectedDate) < new Date()}>
            Confirm Booking
          </Button>,
        ]}
        style={{ zIndex: 1000 }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '16px', marginBottom: '15px', fontWeight: 'bold' }}>
            Welcome to the movie booking page!
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Shows are available for the following dates:
          </p>
          
          {availableShowDates && availableShowDates.length > 0 ? (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>
                Available Show Dates:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[...new Set(availableShowDates)].map((date, index) => (
                  <li key={index} style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                    • {date}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
              No shows available for this movie. Please check back later.
            </p>
          )}
          
          {new Date(selectedDate) < new Date() && (
            <p style={{ fontSize: '14px', color: 'red', marginTop: '15px' }}>
              The selected date has passed. You cannot book shows for this date.
            </p>
          )}
          
          <p style={{ fontSize: '14px', color: '#666', marginTop: '15px', marginBottom: '15px' }}>
            Please select a date and show time to proceed with your booking.
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Click "Confirm Booking" when you're ready to select your seats.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default BookingPopup;
