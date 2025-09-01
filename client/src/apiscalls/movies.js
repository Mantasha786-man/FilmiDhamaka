import { axiosInstance } from './axiosConfig';

//Add a movie
export const AddMovie=async(payload)=>{
    try{
        const response=await axiosInstance.post('/api/movies/add-movie',payload);
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message || "An error occurred"
        };
    }
}

//get all  movies
export const GetAllMovies=async()=>{
    try{
        const response=await axiosInstance.get('/api/movies/get-all-movies');
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to fetch movies"
        };
    }
}

//update a movie
export const  UpdateMovie=async (payload)=>{
    try{
        const response=await axiosInstance.post('/api/movies/update-movie',payload);
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to update movie"
        };
    }
}

//delete a movie
export const  DeleteMovie=async(payload)=>{
    try{
        const response=await axiosInstance.post('/api/movies/delete-movie',payload);
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to delete movie"
        };
    }
}

//get movie by id

export const GetMovieById=async(id)=>{
    try{
        const response=await axiosInstance.get(`/api/movies/get-movie-by-id/${id}`);
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to get movie by id"
        };
    }
}

//rate a movie
export const RateMovie=async(payload)=>{
    try{
        const response=await axiosInstance.post('/api/movies/rate-movie',payload);
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to rate movie"
        };
    }
}

//get movie rating data
export const GetMovieRating=async(id)=>{
    try{
        const response=await axiosInstance.get(`/api/movies/get-movie-rating/${id}`);
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to get movie rating"
        };
    }
}
