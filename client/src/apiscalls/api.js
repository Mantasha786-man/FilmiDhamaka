import { axiosInstance } from './axiosConfig';

export const api = {
  login: async (data) => {
    const res = await axiosInstance.post('/api/users/login', data);
    return res.data;
  },

  register: async (data) => {
    const res = await axiosInstance.post('/api/users/register', data);
    return res.data;
  },

  getMovies: async () => {
    const res = await axiosInstance.get('/api/movies');
    return res.data;
  },

  getTheatres: async () => {
    const res = await axiosInstance.get('/api/theatres');
    return res.data;
  },

  bookTicket: async (data) => {
    const res = await axiosInstance.post('/api/bookings', data);
    return res.data;
  }
};
