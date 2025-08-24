import React, { useEffect } from 'react';
import { message, Row, Col, Card, Tooltip, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { GetAllMovies } from '../../apiscalls/movies';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Movies page component - saari movies ko display karta hai aur search/filter functionality provide karta hai
// This component displays all movies with search and filter capabilities
function Movies() {
  // Redux dispatch function for state management
  const dispatch = useDispatch();
  // React Router navigation hook
  const navigate = useNavigate();
  
  // State variables:
  const [movies, setMovies] = React.useState([]); // Stores all movies fetched from API
  const [searchQuery, setSearchQuery] = React.useState(''); // Stores search query input
  const [filteredMovies, setFilteredMovies] = React.useState([]); // Stores filtered movies based on search/genre

  // API se saari movies fetch karta hai
  // Fetches all movies from the backend API
  const getData = async () => {
    try {
      dispatch(ShowLoading()); // Show loading indicator
      const response = await GetAllMovies(); // API call to get all movies
      if (response && response.success) {
        setMovies(response.data || []); // Set movies data if successful
      } else {
        message.error(response?.message || "Failed to fetch movies"); // Show error message
      }
      dispatch(HideLoading()); // Hide loading indicator
    } catch (error) {
      dispatch(HideLoading()); // Hide loading indicator on error
      message.error(error?.message || "An error occurred while fetching movies"); // Show error message
    }
  };

  // useEffect hook: Runs once when component mounts to fetch movies data
  useEffect(() => {
    getData();
  }, []);

  // useEffect hook: Filters movies based on search query
  // Runs whenever searchQuery or movies state changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies); // Show all movies if search query is empty
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) // Filter movies by title
      );
      setFilteredMovies(filtered); // Set filtered movies
    }
  }, [searchQuery, movies]);

  // Available movie genres for filtering
  const genres = [
    "All",        // Show all movies
    "Action",     // Action genre
    "Adventure",  // Adventure genre
    "Comedy",     // Comedy genre
    "Drama",      // Drama genre
    "Romance",    // Romance genre
    "Horror",     // Horror genre
    "Fantasy",    // Fantasy genre
    "Animation",  // Animation genre
    "Musical",    // Musical genre
    "Biography",  // Biography genre
    "Historical", // Historical genre
    "Crime",      // Crime genre
    "Family",     // Family genre
    "Sports",     // Sports genre
    "Documentary" // Documentary genre
  ];

  // Handles genre filter selection
  const handleGenreClick = (genre) => {
    if (genre === "All") {
      setFilteredMovies(movies); // Show all movies when "All" is selected
    } else {
      const filtered = movies.filter(movie => movie.genre.includes(genre)); // Filter by selected genre
      setFilteredMovies(filtered); // Set filtered movies
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
                xs={6}      // 2 columns on extra small screens
                sm={4}      // 3 columns on small screens  
                md={3}      // 4 columns on medium screens
                lg={2}      // 6 columns on large screens
                xl={2}      // 6 columns on extra large screens
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
                xs={12}      // 2 columns on extra small screens
                sm={8}       // 3 columns on small screens
                md={6}       // 4 columns on medium screens
                lg={4}       // 5 columns on large screens
                xl={4}       // 5 columns on extra large screens
                style={{ padding: '8px' }}
              >
                <Tooltip title="Click to book tickets for this movie" placement="top">
                  <Card
                    hoverable
                    style={{ width: '100%', height: 300 }}
                    cover={
                      <img 
                        alt={movie.title} 
                        src={movie.poster} 
                        style={{ height: 250, objectFit: 'cover' }}
                      />
                    }
                    onClick={() => navigate(`/movie/${movie._id}`)}
                  >
                    <Card.Meta
                      title={movie.title}
                      // description={
                      //   <div>
                      //     <p className="text-sm text-gray-600">{movie.genre}</p>
                      //     <p className="text-sm text-gray-600">{movie.language}</p>
                      //     <p className="text-sm text-gray-600">
                      //       {moment(movie.releaseDate).format("MMMM Do YYYY")}
                      //     </p>
                    //     </div>
                    //   }
                    />
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
