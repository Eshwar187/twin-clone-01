import { Navigate, Outlet } from 'react-router-dom';

const isAuthed = () => !!localStorage.getItem('token');

const ProtectedRoute = () => {
  return isAuthed() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
