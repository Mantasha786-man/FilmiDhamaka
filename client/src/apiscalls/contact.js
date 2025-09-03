const { axiosInstance } = require('./axiosConfig');

export const submitContact = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/contacts/submit-contact', payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAllContacts = async () => {
  try {
    const response = await axiosInstance.get('/api/contacts/get-all-contacts');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
