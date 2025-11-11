import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('token');

  // トークンが存在すれば、子ルート（<Outlet />）を表示
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;