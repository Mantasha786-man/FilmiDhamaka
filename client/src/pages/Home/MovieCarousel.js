import React, { useState, useEffect } from 'react';
import './MovieCarousel.css';

const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const movies = [
    {
      id: 1,
      title: "Spider-Man",
      description: "An ex-army officer is on a mission to save his country from a dangerous terrorist threat, leading to an action-packed confrontation.",
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&h=600&fit=crop",
      rating: 4.8
    },
    {
      id: 2,
      title: "Betman",
      description: "A man is driven by a personal vendetta while upholding a promise made years ago, facing off against a monstrous outlaw.",
      image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1200&h=600&fit=crop",
      rating: 4.7
    },
    {
      id: 3,
      title: "The Dark Knight Rises",
      description: "A heartwarming tale of friends who embark on an arduous journey to fulfill their dreams, facing challenges and discovering life lessons.",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&h=600&fit=crop",
      rating: 4.5
    },
    {
      id: 4,
      title: "Tiger 3",
      description: "RAW agent Tiger faces his biggest challenge yet as he battles against time and enemies to protect his nation and family.",
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/02/1600x900/tiger_3_1693633096774_1693633097167.jpg",
      rating: 4.6
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [movies.length]);

  return (
    <div>
      <div className="carousel-container">
        <div className="carousel-wrapper">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${movie.image})` }}
            >
              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h2 className="movie-title">{movie.title}</h2>
                  <p className="movie-description">{movie.description}</p>
                  <div className="movie-rating">
                    <span className="stars">{'★'.repeat(Math.floor(movie.rating))}</span>
                    <span className="rating-text">{movie.rating}/5</span>
                  </div>
                  <button className="watch-now-btn">Watch Now</button>
                </div>
              </div>
            </div>
          ))}
          
          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button className="carousel-btn next-btn" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="carousel-indicators">
            {movies.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
