import { axiosInstance } from './axiosConfig';

// Add movie to wishlist
export const AddToWishlist = async (movieId) => {
  try {
    const response = await axiosInstance.post('/api/wishlist/add', {
      movieId
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Something went wrong' };
  }
};

// Remove movie from wishlist
export const RemoveFromWishlist = async (movieId) => {
  try {
    const response = await axiosInstance.post('/api/wishlist/remove', {
      movieId
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Something went wrong' };
  }
};

// Get user's wishlist
export const GetUserWishlist = async () => {
  try {
    const response = await axiosInstance.get('/api/wishlist/user');
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Something went wrong' };
  }
};

// Check if movie is in wishlist
export const CheckWishlistStatus = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/api/wishlist/check/${movieId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Something went wrong' };
  }
};
