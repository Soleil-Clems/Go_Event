import React, { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './authContext'; 

interface DeniedRouteProps {
  children: ReactNode;
}

const DeniedRoute: React.FC<DeniedRouteProps> = ({ children }) => {
  const { user } = useContext(AuthContext);

 
  if (user === undefined) {
    return <div>Loading...</div>;
 }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default DeniedRoute;
