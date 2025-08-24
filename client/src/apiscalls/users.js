import { axiosInstance } from './axiosConfig';

export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response;
  } catch (error) {
    return error.response;
  }
};

 //get current user
export const GetCurrentUser = async () =>{
  try{
    const response=await axiosInstance.get("/api/users/get-current-user");
    return response.data;
  }catch(error){
    return error;
  }
}
