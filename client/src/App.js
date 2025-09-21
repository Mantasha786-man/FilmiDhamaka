import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from "./pages/Home";
import Footer from './components/Footer'; // Footer component ko import karna
import Login from "./pages/Login";
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute'; // Protected routes ke liye component
import { AuthRedirect } from './components/AuthRedirect'; // Authentication redirect component
import "./stylesheets/alignments.css";
import "./stylesheets/coustom.css";
import "./stylesheets/formelements.css";
import "./stylesheets/sizes.css";
import "./stylesheets/theme.css";
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';
import './index.css';
import TheatresForMovie from './pages/TheatreForMovie';
import BookShow from './pages/BookShow';
import Movies from './pages/Movies';
import About from './pages/About';
import Contact from './pages/Contact';
import Review from './pages/Review';

// Main App component - saari routing aur navigation handle karta hai
// This is the root component that handles routing and navigation for the entire Movie Booking System
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function AppContent() {
  const location = useLocation();

  // Removed unused state and selector

  // Check if current route is login or register
  const shouldShowFooter = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          {/* Protected Routes: Inhe access karne ke liye user logged in hona chahiye */}
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/movies' element={<ProtectedRoute><Movies /></ProtectedRoute>} />
          <Route path='/about' element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path='/contact' element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path='/review' element={<ProtectedRoute><Review /></ProtectedRoute>} />

          <Route path='/movie/:id' element={<ProtectedRoute><TheatresForMovie /></ProtectedRoute>} />
          <Route path='/book-show/:id' element={<ProtectedRoute><BookShow /></ProtectedRoute>} />
          <Route path='/my-bookings' element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>} />

          {/* Public Routes: Inhe access karne ke liye user logged out hona chahiye */}
          <Route path='/login' element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } />
          <Route path='/register' element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          } />
        </Routes>
      </main>
      {/* Conditionally render Footer based on the current route */}
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
