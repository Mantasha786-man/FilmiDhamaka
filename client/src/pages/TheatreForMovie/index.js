import React, { useEffect, useState } from "react";
import BookingPopup from "../../components/BookingPopup";
import { message, Tooltip } from "antd";
import { useDispatch } from "react-redux";
 import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetMovieById } from "../../apiscalls/movies";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { GetAllTheatreByMovie, GetAllShowsByMovie } from "../../apiscalls/theatres";

import "./index.css";

function TheatresForMovie() {
  //get date from query string
  const tempDate = new URLSearchParams(window.location.search).get("date");
  const [date, setDate] = useState(tempDate || moment().format("YYYY-MM-DD"));

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const params = useParams();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetMovieById(params.id);
      if (response && response.success) {
        setMovie(response.data);
      } else {
        message.error(response?.message || "Failed to fetch movie details");
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error?.message || "An error occurred while fetching movie details");
    }
  };

  const getTheatres = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllShowsByMovie({ movie: params.id });
      if (response && response.success) {
        setTheatres(response.data || []);
      } else {
        message.error(response?.message || "Failed to fetch shows");
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error?.message || "An error occurred while fetching shows");
    }
  };

  useEffect(() => {
    getData();
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      getTheatres();
    }
  }, [date, params.id]);

  // Show popup automatically when component loads
  useEffect(() => {
    setIsPopupVisible(true);
  }, []);

  const handleShowClick = (show) => {
    setSelectedShow(show);
    navigate(`/book-show/${show._id}`);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
    setSelectedShow(null);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
  };

  const handlePopupConfirm = () => {
    if (selectedShow) {
      navigate(`/book-show/${selectedShow._id}`);
    } else {
      message.info("Please select a show time first before confirming.");
    }
    handlePopupClose();
  };

  const availableShowDates = theatres.flatMap(theatre =>
    theatre.shows.map(show => {
      // Extract the actual show date from the show object
      return moment(show.date).format("MMMM Do YYYY");
    })
  ).filter((date, index, self) => self.indexOf(date) === index); // Ensure unique dates

  // Filter theatres to only show shows for the selected date
  const filteredTheatres = theatres.map(theatre => ({
    ...theatre,
    shows: theatre.shows.filter(show => moment(show.date).format("YYYY-MM-DD") === date)
  })).filter(theatre => theatre.shows.length > 0);

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading movie details...</div>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* movie information */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl uppercase">
            {movie.title} ({movie.language})
          </h1>
          <h1 className="text-md">Duration: {movie.duration} Mins</h1>
          <h1 className="text-md">
            Release Date: {moment(movie.releaseDate).format("MMMM Do YYYY")}
          </h1>
          <h1 className="text-md">Genre: {movie.genre}</h1>
        </div>
        <div>
          <Tooltip title="Select a date to see available show times" placement="top">
            <h1 className="text-md">Today Date</h1>
          </Tooltip>
          <input
            type="date"
            min={moment().format("YYYY-MM-DD")}
            value={date}
            onChange={handleDateChange}
            className="border p-1 rounded"
          />
        </div>
      </div>
      <hr />

      {/* movie theatres */}
      <div className="mt-1 flex flex-col gap-1">
        <h1 className="text-xl uppercase">Theatres</h1>
      </div>

      <div className="mt-1">
        {theatres.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-500">
              No theatres available for this movie on{" "}
              {moment(date).format("MMMM Do YYYY")}
            </p>
          </div>
        ) : (
          theatres.map((theatre) => (
            <div key={theatre._id} className="card p-2 mb-2">
              <h1 className="text-md uppercase">{theatre.name}</h1>
              <h1 className="text-sm">Address: {theatre.address}</h1>
              <div className="divider"></div>
              <h1 className="text-sm font-semibold mb-2 show-time-title">Show Time</h1>
              <div className="flex gap-2">
                {theatre.shows
                  .sort(
                    (a, b) => moment(a.time, "HH:mm") - moment(b.time, "HH:mm")
                  )
                  .map((show) => {
                    const isPastShow = moment(show.date).isBefore(moment(), 'day');
                    return (
                      <Tooltip
                        title={isPastShow ? "This show is not available" : "Click to book seats for this show"}
                        placement="top"
                      >
                        <div
                          className={`card p-1 text-sm ${isPastShow ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
                          onClick={() => {
                            if (!isPastShow) {
                              handleShowClick(show);
                            } else {
                              message.info("This show is not available. Please select an available show.");
                            }
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <h1 className="text-xs font-semibold">
                              {moment(show.time, "HH:mm").format("h:mm A")}
                            </h1>
                            <span className={`text-xs font-medium ${isPastShow ? 'past-show-status' : 'available-status'}`}>
                              ({isPastShow ? 'Past Show' : 'Available'})
                            </span>
                          </div>
                        </div>
                      </Tooltip>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Popup */}
      <BookingPopup
        visible={isPopupVisible}
        onClose={handlePopupClose}
        onConfirm={handlePopupConfirm}
        selectedDate={moment(date).format("MMMM Do YYYY")}
        availableShowDates={availableShowDates}
      />
    </div>
  );
}

export default TheatresForMovie;
