import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireRole = ({ children }) => {
  const { userProfile, user } = useSelector((store) => store.auth);

  // Check if the user role is defined and if they have a profile picture
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireRole;
