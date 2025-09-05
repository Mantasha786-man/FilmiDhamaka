import { message, Modal, Form, Input, Button as AntButton } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetShowById } from "../../apiscalls/theatres";
import moment from "moment";
import Button from "../../components/button";
import { CreateBooking, GetBookedSeats } from "../../apiscalls/Bookings";
import {
  MailOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

function BookShow() {
  const [show, setShow] = React.useState(null);
  const [selectedseats, setSelectedSeats] = React.useState([]);
  const [paymentModalVisible, setPaymentModalVisible] = React.useState(false);
  const [localBookedSeats, setLocalBookedSeats] = React.useState([]);
  const [form] = Form.useForm();
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.users);
  const showPaymentModal = () => {
    if (selectedseats.length === 0) {
      message.error("Please select at least one seat.");
      return;
    }
    setPaymentModalVisible(true);
    
  };

  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handlePaymentSubmit = async (values) => {
    const bookingData = {
      userId: user._id, // Use actual user ID from authentication
      showId: show._id,
      movieName: show.movie.title,
      theaterName: show.theatre.name,
      showTime: show.time,
      showDate: show.date,
      seats: selectedseats,
      totalAmount: selectedseats.length * show.ticketPrice,
      userEmail: values.email,
      status: 'pending', // Add status field
      paymentMethod: values.paymentMethod,
      cardNumber: values.cardNumber,
      expiryDate: values.expiryDate,
      cvv: values.cvv
    };

    try {
      dispatch(ShowLoading());
      const response = await CreateBooking(bookingData);
      if (response.success) {
        message.success(response.message);
        setPaymentModalVisible(false);
        setSuccessModalVisible(true);
        form.resetFields();
        // Add the booked seats to local state to mark them as booked
        setLocalBookedSeats([...localBookedSeats, ...selectedseats]);
        // Clear selected seats after booking
        setSelectedSeats([]);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getData = useCallback(async () => {
    try {
      dispatch(ShowLoading());

      // Fetch show details
      const showResponse = await GetShowById({ showId: params.id });
      if (!showResponse.success) {
        message.error(showResponse.message);
        dispatch(HideLoading());
        return;
      }

      // Fetch booked seats for this show
      const bookedSeatsResponse = await GetBookedSeats(params.id);
      if (bookedSeatsResponse.success) {
        // Update show data with latest booked seats
        const updatedShow = {
          ...showResponse.data,
          bookedSeats: bookedSeatsResponse.data.bookedSeats || []
        };
        setShow(updatedShow);
      } else {
        // If booked seats fetch fails, use show data as is
        setShow(showResponse.data);
      }

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handlePaymentModalOk = () => {
    form.validateFields()
      .then(values => {
        handlePaymentSubmit(values);
      })
      .catch(info => {
        console.log('Validation Failed:', info);
      });
  };

  const getSeats = () => {
    if (!show || !show.totalSeats) return null;
    const columns = 12;
    const totalSeats = show.totalSeats;

    return (
      <div className="seats-container">
        {Array.from({ length: totalSeats }).map((_, index) => {
          const seatNumber = index + 1;
          let seatClass = "seat";

          // Check if seat is selected
          if (selectedseats.includes(seatNumber)) {
            seatClass = "selected-seat";
          }

          // Check if seat is booked (from backend or local state)
          if ((show.bookedSeats && show.bookedSeats.includes(seatNumber)) || 
              localBookedSeats.includes(seatNumber)) {
            seatClass = "booked-seat";
          }


          return (
            <div
              key={seatNumber}
              className={seatClass}
              onClick={() => {
                // Don't allow selection of booked seats (from backend or local state)
                if ((show.bookedSeats && show.bookedSeats.includes(seatNumber)) || 
                    localBookedSeats.includes(seatNumber)) {
                  return;
                }

                if (selectedseats.includes(seatNumber)) {
                  setSelectedSeats(
                    selectedseats.filter((item) => item !== seatNumber)
                  );
                } else {
                  setSelectedSeats([...selectedseats, seatNumber]);
                }
              }}
            >
              <h1 className="text-sm">{seatNumber}</h1>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
    <Modal
      title="Payment Information"
      visible={paymentModalVisible}
      onCancel={() => setPaymentModalVisible(false)}
      footer={[
        <AntButton key="back" onClick={() => setPaymentModalVisible(false)}>
          Cancel
        </AntButton>,
        <AntButton key="submit" type="primary" onClick={handlePaymentModalOk}>
          Submit Payment
        </AntButton>,
      ]}
    >
      {/* Booking Summary inside Payment Modal */}
      <div style={{ 
        background: '#f0f8ff', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '2px solid #1890ff'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#1890ff' }}>Booking Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div><strong>Movie:</strong></div>
          <div>{show?.movie?.title}</div>
          
          <div><strong>Theater:</strong></div>
          <div>{show?.theatre?.name}</div>
          
          <div><strong>Date & Time:</strong></div>
          <div>
            {show?.date ? moment(show.date).format("MMM Do YYYY") : "N/A"} at {show?.time ? moment(show.time, "HH:mm").format("hh:mm A") : "N/A"}
          </div>
          
          <div><strong>Selected Seats:</strong></div>
          <div>{selectedseats.join(', ')}</div>
          
          <div><strong>Price per Seat:</strong></div>
          <div>₹{show?.ticketPrice}</div>
          
          <div><strong>Total Seats:</strong></div>
          <div>{selectedseats.length}</div>
          
          <div><strong>Total Amount:</strong></div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
            ₹{selectedseats.length * (show?.ticketPrice || 0)}
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[{ required: true, message: 'Please select a payment method!' }]}
        >
          <Input prefix={<CreditCardOutlined />} placeholder="e.g., Credit Card, Debit Card" />
        </Form.Item>
        <Form.Item
          label="Card Number"
          name="cardNumber"
          rules={[
            { required: true, message: 'Please input your card number!' },
            { pattern: /^[0-9]{16}$/, message: 'Card number must be 16 digits' }
          ]}
        >
          <Input prefix={<CreditCardOutlined />} type="number" placeholder="1234 5678 9012 3456" maxLength={16} />
        </Form.Item>
        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          rules={[
            { required: true, message: 'Please input your card expiry date!' },
            { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: 'Format: MM/YY' }
          ]}
        >
          <Input prefix={<CalendarOutlined />} placeholder="MM/YY" />
        </Form.Item>
        <Form.Item
          label="CVV"
          name="cvv"
          rules={[
            { required: true, message: 'Please input your CVV!' },
            { pattern: /^[0-9]{3,4}$/, message: 'CVV must be 3-4 digits' }
          ]}
        >
          <Input prefix={<SafetyCertificateOutlined />} type="number" placeholder="123" maxLength={4} />
        </Form.Item>
      </Form>
    </Modal>

    {/* Success Modal */}
    <Modal
      title="Booking Successful!"
      visible={successModalVisible}
      onCancel={() => setSuccessModalVisible(false)}
      footer={[
        <AntButton key="ok" type="primary" onClick={() => setSuccessModalVisible(false)}>
          OK
        </AntButton>,
      ]}
    >
      <div style={{ textAlign: 'center' }}>
        <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
        <p>Your booking has been submitted successfully!</p>
        <p><strong>Status: Pending Admin Approval</strong></p>
        <p>After admin approval, your booking will appear in the My Bookings section of the menu.</p>
      </div>
    </Modal>
    
    <div className="p-4">
      {/* Show information */}
      {show ? (
        <div className="flex justify-between card p-2 items-center mb-6">
          <div>
            <h1 className="text-xl gap-1">
              {show.theatre?.name || "Loading..."}
            </h1>
            <h1 className="text-sm">{show.theatre?.address || "Loading..."}</h1>
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase">
              {show.movie?.title || "Loading..."} ({show.movie?.language || ""})
            </h1>
          </div>
          <div className="text-right">
            <h1 className="text-md">
              {show.date
                ? moment(show.date).format("MMMM Do YYYY")
                : "Date not available"}
            </h1>
            <h1 className="text-sm font-semibold">
              {show.name || "Show Name"}
            </h1>
            <h1 className="text-sm text-gray-600">
              {show.time
                ? moment(show.time, "HH:mm").format("hh:mm A")
                : "Time not available"}
            </h1>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Loading show details...</div>
        </div>
      )}

      {/* Seats section */}
      {show && (
        <div className="card p-3 mt-1">
          <div>
            {getSeats()}
          </div>
          {selectedseats.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">
                Selected {selectedseats.length} seat{selectedseats.length > 1 ? 's' : ''}
              </p>
              <div className="flex justify-center">
                <Button title='Proceed to Payment' onClick={showPaymentModal} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}

export default BookShow;
