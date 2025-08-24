import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/PageTitle';

// Hardcoded testimonials data - These are pre-defined reviews that show by default
const testimonials = [
  {
    name: "Raj Mehta",
    position: "Movie Buff",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "FilmiDhamaka is my go-to app for booking tickets. It's fast, easy, and always updated.",
    bg: "#6a1b9a",
    color: "#fff"
  },
  {
    name: "Anjali Sharma",
    position: "Film Critic",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "The UI is super clean and responsive. Booking tickets has never been so smooth!",
    bg: "#263238",
    color: "#fff"
  },
  {
    name: "Vikram Joshi",
    position: "Student",
    image: "https://randomuser.me/api/portraits/men/61.jpg",
    text: "Affordable prices and great seat selection. Highly recommend!",
    bg: "#ffffff",
    color: "#000"
  },
  {
    name: "Sneha Rao",
    position: "Film Lover",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I booked 3 movie tickets in under a minute. Incredible!",
    bg: "#1a237e",
    color: "#fff"
  },
  {
    name: "Yusuf Khan",
    position: "Cinema Enthusiast",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    text: "Real-time updates on shows, timings, and theatres are a big win!",
    bg: "#eceff1",
    color: "#000"
  }
];

// Main Review component that handles user reviews functionality
function Review() {
  // Get current user from Redux store to check if user is logged in
  const { user } = useSelector((state) => state.users);
  
  // State for storing user-submitted reviews and current review text
  const [userReviews, setUserReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');

  // Load user reviews from localStorage when component mounts
  useEffect(() => {
    const savedReviews = localStorage.getItem('filmidhamaka_user_reviews');
    if (savedReviews) {
      setUserReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Function to handle review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    // Create new review object with user data
    const newReview = {
      name: user.name,
      position: "Customer",
      image: "https://randomuser.me/api/portraits/lego/1.jpg", // Default avatar
      text: reviewText.trim(),
      bg: "#2196f3",
      color: "#fff",
      isUserReview: true,
      timestamp: new Date().toISOString(),
      id: Date.now() // Unique ID for delete functionality
    };

    // Update state and localStorage with new review
    const updatedReviews = [...userReviews, newReview];
    setUserReviews(updatedReviews);
    localStorage.setItem('filmidhamaka_user_reviews', JSON.stringify(updatedReviews));
    setReviewText('');
  };

  // Function to delete a user review
  const handleDeleteReview = (reviewId) => {
    const updatedReviews = userReviews.filter(review => review.id !== reviewId);
    setUserReviews(updatedReviews);
    localStorage.setItem('filmidhamaka_user_reviews', JSON.stringify(updatedReviews));
  };

  const allReviews = [...testimonials, ...userReviews];

  return (
    <div>
      {/* Review Form for logged-in users */}
      {user && (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Share Your Experience</h3>
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review about FilmiDhamaka..."
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                minHeight: '100px',
                resize: 'vertical',
                fontSize: '1rem'
              }}
              required
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {!user && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Login to share your experience with FilmiDhamaka!</p>
        </div>
      )}

      <TestimonialSection 
        reviews={allReviews} 
        onDeleteReview={handleDeleteReview}
        currentUser={user}
      />
    </div>
  )
}
const styles = {
  section: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: '#f4f4f4'
  },
  card: {
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.3s ease',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  userImage: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '1rem'
  },
  userName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  userRole: {
    fontSize: '0.85rem',
    color: '#ccc'
  },
  reviewText: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginTop: '0.5rem'
  }
};

// TestimonialSection component - Displays all reviews including user-submitted ones
const TestimonialSection = ({ reviews, onDeleteReview, currentUser }) => {
  return (
    <section style={styles.section}>
      {reviews.map((review, idx) => (
        <div
          key={idx}
          style={{
            ...styles.card,
            backgroundColor: review.bg,
            color: review.color,
            position: 'relative' // For positioning delete button
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {/* Delete button - Only shown for user's own reviews when logged in */}
          {review.isUserReview && currentUser && (
            <button
              onClick={() => onDeleteReview(review.id)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete this review"
            >
              ×
            </button>
          )}
          
          <div style={styles.userInfo}>
            <img src={review.image} alt={review.name} style={styles.userImage} />
            <div>
              <h4 style={styles.userName}>{review.name}</h4>
              <small style={styles.userRole}>{review.position}</small>
            </div>
          </div>
          <p style={styles.reviewText}>"{review.text}"</p>
          
          {/* User Review badge */}
          {review.isUserReview && (
            <small style={{ 
              fontSize: '0.75rem', 
              color: 'rgba(255,255,255,0.7)', 
              marginTop: '0.5rem',
              display: 'block'
            }}>
              User Review
            </small>
          )}
        </div>
      ))}
    </section>
  );
};

export default Review;
