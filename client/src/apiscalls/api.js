const BASE_URL = "https://filmi-dhamaka.vercel.app";

export const api = {
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  register: async (data) => {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getMovies: async () => {
    const res = await fetch(`${BASE_URL}/api/movies`);
    return res.json();
  },

  getTheatres: async () => {
    const res = await fetch(`${BASE_URL}/api/theatres`);
    return res.json();
  },

  bookTicket: async (data) => {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};