// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, isAdmin }) => {
  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;