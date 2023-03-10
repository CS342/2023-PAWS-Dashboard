import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute() {
   const { currentUser, isAdmin } = useAuth();

   return currentUser && isAdmin ? <Outlet /> : <Navigate to="/login" />;
}
