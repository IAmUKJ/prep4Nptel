// Components/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    // Redirect to the signup page of the course (if available)
    const courseCode = location.pathname.split("/")[2];
    return <Navigate to={`/courses/${courseCode}/signup`} replace />;
  }

  return children;
};

export default PrivateRoute;
