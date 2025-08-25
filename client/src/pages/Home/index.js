import React, { useEffect, useCallback } from "react";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies } from "../../apiscalls/movies";
import MovieCarousel from "./MovieCarousel";

function Home() {
  const dispatch = useDispatch();
  const [movies, setMovies] = React.useState([]);
  
  const getData = useCallback(async () => {
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
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);
  
  return (
    <div>
      <MovieCarousel />
    </div>
  );
}
export default Home;
