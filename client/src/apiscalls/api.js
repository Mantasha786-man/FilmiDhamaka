import { axiosInstance } from './axiosConfig';

export const api = {
  login: async (data) => {
    const response = await axiosInstance.post('/api/users/login', data);
    return response.data;
  },

  register: async (data) => {
    const response = await axiosInstance.post('/api/users/register', data);
    return response.data;
  },

  getMovies: async () => {
    const response = await axiosInstance.get('/api/movies');
    return response.data;
  },

  getTheatres: async () => {
    const response = await axiosInstance.get('/api/theatres');
    return response.data;
  },

  bookTicket: async (data) => {
    const response = await axiosInstance.post('/api/bookings', data);
    return response.data;
  }
};
