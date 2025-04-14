import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const RequireRole = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();


  // Whitelisted routes that don't require auth or complete profile
  const PUBLIC_ROUTES = ['/login', '/signup', '/about'];
  const INCOMPLETE_PROFILE_ALLOWED = ['/edit', ...PUBLIC_ROUTES];

  // Check if profile is complete (customize these fields as needed)
  const isProfileComplete = user && 
    user.profilePicture && 
    user.bio && 
    user.skills?.length > 0 && 
    user.college && 
    (user.leetcode || user.github);

  // Redirect to login if not authenticated
  if (!user && !PUBLIC_ROUTES.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to profile edit if profile is incomplete
  if (user && !user?.check && isProfileComplete && !INCOMPLETE_PROFILE_ALLOWED.includes(location.pathname)) {
    toast.info('Please complete your profile first. If it is already complete, please click on save changes.');
    return <Navigate to="/edit" state={{ from: location }} replace />;
  }

  // Redirect authenticated users away from auth pages
  if (user && ['/login', '/signup'].includes(location.pathname)) {
    return <Navigate to="/feed" replace />;
  }

  // Redirect from root based on auth status
  if (location.pathname === "/") {
    return <Navigate to={user ? "/feed" : "/login"} replace />;
  }

  return children;
};

export default RequireRole;