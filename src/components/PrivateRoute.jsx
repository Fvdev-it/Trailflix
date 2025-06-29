import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  return children;
};

export default PrivateRoute;
