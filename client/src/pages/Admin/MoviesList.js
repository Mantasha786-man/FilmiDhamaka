import React, { useEffect, useCallback } from "react";
import Button from "../../components/button";
import MovieForm from "./MovieForm";
import moment from "moment";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies, DeleteMovie } from "../../apiscalls/movies";

function MoviesList() {
  const [movies, setMovies] = React.useState([]);
  const [showMovieFormModal, setShowMovieFormModal] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [formType, setFormType] = React.useState("add");
  const dispatch = useDispatch();

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
      message.error(error?.message || "An error occurred while fetching movies");
    }
  }, [dispatch]);

  const handleDelete = async (movieId) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteMovie({
        movieId,
      });
      if (response && response.success) {
        message.success(response.message || "Movie deleted successfully");
        getData();
      } else {
        message.error(response?.message || "Failed to delete movie");
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error?.message || "An error occurred while deleting movie");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
    },
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, record) => {
        return <img src={record.poster} alt="poster" width={60} height={60} className="br-1" />;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, record) => {
        return moment(record.releaseDate).format("DD-MM-YYYY");
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            <i 
              className="ri-delete-bin-line"
              onClick={() => {
                handleDelete(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedMovie(record);
                setFormType("edit");
                setShowMovieFormModal(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <div className="flex justify-end mb-1">
        <Button
          title="Add Movie"
          variant="outlined"
          onClick={() => {
            setFormType("add");
            setSelectedMovie(null);
            setShowMovieFormModal(true);
          }}
        />
      </div>

      <Table columns={columns} dataSource={movies} rowKey="_id" />

      <MovieForm
        showMovieFormModal={showMovieFormModal}
        setShowMovieFormModal={setShowMovieFormModal}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
        formType={formType}
        getData={getData}
      />
    </div>
  );
}

export default MoviesList;
