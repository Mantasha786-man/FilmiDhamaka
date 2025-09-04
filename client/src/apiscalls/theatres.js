import { axiosInstance } from './axiosConfig';

//add new theatre
export const AddTheatre = async (payload) => {
    try{
        const response = await axiosInstance.post('/api/theatres/add-theatre', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//get all theatres
export const GetAllTheatres = async () => {
    try{
        const response = await axiosInstance.get('/api/theatres/get-all-theatres');
        return response.data;
    }catch(error){
        return error.response;
    }
};

//update theatre
export const UpdateTheatre = async (payload) => {
    try{
        const response = await axiosInstance.put('/api/theatres/update-theatre', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//delete theatre
export const DeleteTheatre = async (payload) => {
    try{
        const response = await axiosInstance.post('/api/theatres/delete-theatre', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//add show
export const AddShow= async (payload) => {
    try{
        const response = await axiosInstance.post('/api/theatres/add-show', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//update show
export const UpdateShow = async (payload) => {
    try{
        const response = await axiosInstance.put('/api/theatres/update-show', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//get all shows by theatre
export const GetAllShowsByTheatre = async (payload) => {
    try{
        const response = await axiosInstance.post('/api/theatres/get-all-shows-by-theatre', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//delete Show
export const DeleteShow = async (payload) => {
    try{
        const response = await axiosInstance.post('/api/theatres/delete-show', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//get all theatres which have shows of a movie
export const GetAllTheatreByMovie = async (payload) => {
    try{
        const response = await axiosInstance.post('/api/theatres/get-all-theatres-by-movie', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//get all shows for a movie (without date filter)
export const GetAllShowsByMovie = async (payload) => {
    try{
        const response = await axiosInstance.post('/api/theatres/get-all-shows-by-movie', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};

//get show by id
export const GetShowById = async (payload) => {
    try{
        const response = await axiosInstance.post('/api/theatres/get-show-by-id', payload);
        return response.data;
    }catch(error){
        return error.response;
    }
};
