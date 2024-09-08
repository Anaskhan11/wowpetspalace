import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = ({ isAuthenticated }) => {
  if (isAuthenticated === null) {
    // Authentication status not yet determined, show loading or blank state
    return <></>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
