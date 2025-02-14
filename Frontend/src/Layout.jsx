import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LeftNavbar from './components/Explore/LeftNavbar';
import Navbar from './components/Home/Navbar';
import Footer from './components/Home/Footer';

const Layout = () => {
  const location = useLocation();

  // Hide the LeftNavbar on the home page
  const hideNavbar = location.pathname === '/' || location.pathname === '/ask' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="">
      {/* Conditionally render the LeftNavbar */}
      {!hideNavbar && <LeftNavbar />}
      <div className={`flex-grow ${hideNavbar ? '' : 'md:ml-80 ml-0'}`}> {/* Adjust margin based on screen size */}
        <Navbar />
        <Outlet /> {/* This renders the current route's component */}
        <Footer/>
      </div>
    </div>
  );
};

export default Layout;
