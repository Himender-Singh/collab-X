import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LeftNavbar from './components/Explore/LeftNavbar';
import Navbar from './components/Home/Navbar';
import Footer from './components/Home/Footer';
import AiBot from './components/Global/AiBot';

const Layout = () => {
  const location = useLocation();

  // Hide the LeftNavbar on the home page, error page, and specific routes
  const hideNavbar = 
    location.pathname === '/' || 
    location.pathname === '/code-editor' || 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname.includes('*') || 
    location.pathname === '/error'; // Assuming '/error' is the path for the error page

  return (
    <div className="">
      {/* Conditionally render the LeftNavbar */}
      {!hideNavbar && <LeftNavbar />}
      <div className={`flex-grow ${hideNavbar ? '' : 'md:ml-80 ml-0'}`}> {/* Adjust margin based on screen size */}
        <Navbar />
        <Outlet /> {/* This renders the current route's component */}
        <Footer />
        <AiBot/>
      </div>
    </div>
  );
};

export default Layout;
