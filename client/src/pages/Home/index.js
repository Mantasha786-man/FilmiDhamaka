import React, { useEffect } from "react";
import { Col, message, Row, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies } from "../../apiscalls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import MovieCarousel from "./MovieCarousel";


function Home() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [movies, setMovies] = React.useState([]);
  
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllMovies();
      if (response && response.success) {
        setMovies(response.data || []);
      } else {
        message.error(response?.message || "Failed to fetch movies");
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(
        error?.message || "An error occurred while fetching movies"
      );
    }
  };

  useEffect(() => {
    getData();
  }, []);
  
  return (
    <div>
      <MovieCarousel />

    </div>
  );
}
export default Home;
