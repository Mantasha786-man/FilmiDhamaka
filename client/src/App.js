import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import './index.css';
import TheatresForMovie from './pages/TheatreForMovie';
import BookShow from './pages/BookShow';
import Movies from './pages/Movies';
import About from './pages/About';
import Service from './pages/Service';
import Contact from './pages/Contact';
import Review from './pages/Review';
// Main App component - saari routing aur navigation handle karta hai
// This is the root component that handles routing and navigation for the entire Movie Booking System
import React, { useEffect, useState } from 'react';

function App() {
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        setRefreshCount(prevCount => prevCount + 1);
    }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* BrowserRouter: React Router ka main component jo routing enable karta hai */}
      <BrowserRouter>
        <main className="flex-1">
          <Routes>
            {/* Protected Routes: Inhe access karne ke liye user logged in hona chahiye */}
            <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/movies' element={<ProtectedRoute><Movies /></ProtectedRoute>} />
            <Route path='/about' element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path='/service' element={<ProtectedRoute><Service /></ProtectedRoute>} />
            <Route path='/contact' element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path='/review' element={<ProtectedRoute><Review /></ProtectedRoute>} />
            <Route path='/movie/:id' element={<ProtectedRoute><TheatresForMovie /></ProtectedRoute>} />
            <Route path='/book-show/:id' element={<ProtectedRoute><BookShow /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
        {window.location.pathname !== '/login' && window.location.pathname !== '/register' && <Footer />}
      </BrowserRouter>
    </div>
  );
}

export default App;

