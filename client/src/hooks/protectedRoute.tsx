import React, { useContext, ReactNode } from 'react';
   import { Navigate, useLocation } from 'react-router-dom';
   import { AuthContext } from './authContext';

   interface ProtectedRouteProps {
       children: ReactNode;
   }

   const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
       const { user, isLoading } = useContext(AuthContext);
       const location = useLocation();

       if (isLoading) {
           return <div>Chargement...</div>; 
       }

       if (!user) {
           return <Navigate to="/authentification" state={{ from: location }} replace />;
       }

       return <>{children}</>;
   };

   export default ProtectedRoute;