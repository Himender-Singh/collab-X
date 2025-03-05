import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireRole = ({ children }) => {
  const { user } = useSelector((store) => store.auth); // Access the user from Redux store
  const location = useLocation();

  // If the user is logged in and tries to access the root URL, redirect to the feed page
  if (user && location.pathname === "/") {
    return <Navigate to="/feed" replace />;
  }

  // If the user is not logged in and tries to access a protected route (except the root), redirect to the login page
  if (!user && location.pathname !== "/") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Otherwise, render the children (the requested component)
  return children;
};

export default RequireRole;