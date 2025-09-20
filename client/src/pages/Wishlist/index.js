import React, { useEffect, useState } from 'react';
import { message, Row, Col, Card, Empty, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { GetUserWishlist } from '../../apiscalls/wishlist';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import WishlistIcon from '../../components/WishlistIcon';

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);

  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getWishlistData = async () => {
    try {
      setLoading(true);
      dispatch(ShowLoading());
      const response = await GetUserWishlist();
      if (response && response.success) {
        setWishlistMovies(response.data || []);
      } else {
        message.error(response?.message || "Failed to fetch wishlist");
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error?.message || "An error occurred while fetching wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlistData();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#002E2A',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          My Wishlist
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '16px'
        }}>
          Your favorite movies in one place
        </p>
      </div>

      {wishlistMovies.length > 0 ? (
        <Row gutter={[16, 16]} justify="center">
          {wishlistMovies.map((item) => (
            <Col
              key={item._id}
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={4}
              style={{ padding: '8px' }}
            >
              <Card
                hoverable
                style={{
                  width: '100%',
                  height: 340,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={item.movieId?.title}
                      src={item.movieId?.poster}
                      style={{ height: 180, objectFit: 'cover', width: '100%' }}
                    />
                    <WishlistIcon movieId={item.movieId?._id} />
                  </div>
                }
                onClick={() => handleMovieClick(item.movieId?._id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 14 }}>{item.movieId?.title}</h3>
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{item.movieId?.genre}</p>
                    <p style={{ margin: '4px 0', fontSize: 12, color: '#666' }}>{item.movieId?.language}</p>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{moment(item.movieId?.releaseDate).format("MMM Do YYYY")}</p>
                    <p style={{ margin: '4px 0', fontSize: 12, color: '#666' }}>Duration: {item.movieId?.duration || 'N/A'}</p>
                  </div>
                </div>

                <div style={{ marginTop: 8, fontSize: 12, color: '#444', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.movieId?.description}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#888',
                    fontStyle: 'italic'
                  }}>
                    Added {moment(item.createdAt).format("MMM Do, YYYY")}
                  </span>
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#002E2A',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '11px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMovieClick(item.movieId?._id);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Empty
            description={
              <div>
                <h3 style={{ color: '#002E2A', marginBottom: '16px' }}>
                  Your wishlist is empty
                </h3>
                <p style={{ color: '#666', fontSize: '16px' }}>
                  Start exploring movies and add your favorites to the wishlist!
                </p>
                <button
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#002E2A',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginTop: '16px'
                  }}
                  onClick={() => navigate('/movies')}
                >
                  Browse Movies
                </button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}

export default Wishlist;
