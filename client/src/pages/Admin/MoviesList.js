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
        // Filter out null/undefined movies and ensure data integrity
        const validMovies = (response.data || []).filter(movie => movie && movie._id);
        setMovies(validMovies);
      } else {
        message.error(response?.message || "Failed to fetch movies");
        setMovies([]); // Ensure movies is always an array
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error?.message || "An error occurred while fetching movies");
      setMovies([]); // Ensure movies is always an array
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
      render: (text, record) => {
        // Add null checking for the title field
        return record?.title || "N/A";
      },
    },
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, record) => {
        // Add null checking for poster and record
        if (!record?.poster) {
          return <div className="w-[60px] h-[60px] bg-gray-200 flex items-center justify-center text-xs">No Image</div>;
        }
        return <img src={record.poster} alt="poster" width={60} height={60} className="br-1" />;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, record) => {
        // Add null checking for description
        return record?.description || "N/A";
      },
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text, record) => {
        // Add null checking for duration
        return record?.duration || "N/A";
      },
    },
    {
      title: "Genre",
      dataIndex: "genre",
      render: (text, record) => {
        // Add null checking for genre
        return record?.genre || "N/A";
      },
    },
    {
      title: "Language",
      dataIndex: "language",
      render: (text, record) => {
        // Add null checking for language
        return record?.language || "N/A";
      },
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, record) => {
        // Add null checking for release date
        if (!record?.releaseDate) {
          return "N/A";
        }
        try {
          return moment(record.releaseDate).format("DD-MM-YYYY");
        } catch (error) {
          return "Invalid Date";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        // Add null checking for record and _id
        if (!record?._id) {
          return null;
        }
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
