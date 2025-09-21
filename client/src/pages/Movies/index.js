import React, { useEffect } from 'react';
import { message, Row, Col, Card, Tooltip, Input } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { GetAllMovies } from '../../apiscalls/movies';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Movies page component - displays all movies with search/filter functionality
function Movies() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);

  const [movies, setMovies] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredMovies, setFilteredMovies] = React.useState([]);


  // Fetch all movies
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
      message.error(error?.message || "An error occurred while fetching movies");
    }
  };



  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  const genres = [
    "All", "Action", "Adventure", "Comedy", "Drama", "Romance", "Horror", "Fantasy",
    "Animation", "Musical", "Biography", "Historical", "Crime", "Family", "Sports", "Documentary"
  ];

  const handleGenreClick = (genre) => {
    if (genre === "All") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => movie.genre.includes(genre));
      setFilteredMovies(filtered);
    }
  };



  return (
    <div>
      <div className="mb-8 flex justify-center">
        <Input.Search
          placeholder="Search movies by name..."
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: 700,
            borderRadius: '12px',
            padding: '12px 16px',
            margin: '20px 0',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
          className="custom-search-input"
        />
      </div>

      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-6xl px-4">
          <Row gutter={[8, 8]} justify="center">
            {genres.map((genre) => (
              <Col
                key={genre}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                xl={2}
              >
                <button
                  onClick={() => handleGenreClick(genre)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#002E2A',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#004d40';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#002E2A';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {genre}
                </button>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <Row gutter={[16, 16]} justify="center">
          {filteredMovies.map((movie) => (
            <Col
              key={movie._id}
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={4}
              style={{ padding: '8px' }}
            >
              <Tooltip title="Click to book tickets for this movie" placement="top">
                <Card
                  hoverable
                  style={{ width: '100%', height: 340, display: 'flex', flexDirection: 'column' }}
                  cover={
                    <div style={{ position: 'relative' }}>
                      <img
                        alt={movie.title}
                        src={movie.poster}
                        style={{ height: 180, objectFit: 'cover', width: '100%' }}
                      />

                    </div>
                  }
                  onClick={() => navigate(`/movie/${movie._id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 14 }}>{movie.title}</h3>
                      <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{movie.genre}</p>
                      <p style={{ margin: '4px 0', fontSize: 12, color: '#666' }}>{movie.language}</p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{moment(movie.releaseDate).format("MMM Do YYYY")}</p>
                      <p style={{ margin: '4px 0', fontSize: 12, color: '#666' }}>Duration: {movie.duration || 'N/A'}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 12, color: '#444', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {movie.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#002E2A',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        width: '100%',
                        maxWidth: '120px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movie/${movie._id}`);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </Card>
              </Tooltip>
            </Col>
          ))}
        </Row>
      ) : searchQuery.trim() !== '' ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">No movies found with name "{searchQuery}"</p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">No movies available</p>
        </div>
      )}
    </div>
  );
}

export default Movies;