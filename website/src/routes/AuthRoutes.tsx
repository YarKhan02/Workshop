import React from 'react';
import { Route } from 'react-router-dom';
import { Login, Register } from '../pages';

export const AuthRoutes: React.FC = () => (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </>
);

export default AuthRoutes;
