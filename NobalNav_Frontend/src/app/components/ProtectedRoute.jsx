
import { Navigate } from "react-router";

const ProtectedRoute = ({ children, isAuth }) => {
  return isAuth ? <>{children}</> : <Navigate to="/admin" />;
};

export default ProtectedRoute;