import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { AddToWishlist, RemoveFromWishlist, CheckWishlistStatus } from '../apiscalls/wishlist';

const WishlistIcon = ({ movieId, size = 20, className = '' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check wishlist status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await CheckWishlistStatus(movieId);
        if (response.success) {
          setIsInWishlist(response.isInWishlist);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    if (movieId) {
      checkStatus();
    }
  }, [movieId]);

  const handleWishlistClick = async (e) => {
    e.stopPropagation(); // Prevent card click event

    if (loading) return;

    setLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await RemoveFromWishlist(movieId);
        if (response.success) {
          setIsInWishlist(false);
          message.success('Removed from wishlist');
        } else {
          message.error(response.message || 'Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await AddToWishlist(movieId);
        if (response.success) {
          setIsInWishlist(true);
          message.success('Added to wishlist');
        } else {
          message.error(response.message || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleWishlistClick}
      className={`wishlist-icon ${className}`}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1
      }}
    >
      {isInWishlist ? (
        <HeartFilled
          style={{
            fontSize: size,
            color: '#ff4d4f',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }}
        />
      ) : (
        <HeartOutlined
          style={{
            fontSize: size,
            color: 'rgba(255,255,255,0.8)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
      )}
    </div>
  );
};

export default WishlistIcon;
