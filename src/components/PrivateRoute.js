import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminWarning from './AdminWarning';

export default function PrivateRoute() {
   const { currentUser, isAdmin } = useAuth();

   return currentUser ? 
            isAdmin ? <Outlet /> : <AdminWarning /> 
                  : <Navigate to="/login" />;
}