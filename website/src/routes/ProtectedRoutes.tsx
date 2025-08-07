import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../components';
import { 
  Book, 
  Checkout, 
  BookingConfirmation, 
  MyBookings, 
  Profile, 
  Invoice 
} from '../pages';

export const ProtectedRoutes: React.FC = () => (
  <>
    <Route 
      path="/book" 
      element={
        <ProtectedRoute>
          <Book />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/checkout" 
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/booking-confirmation" 
      element={
        <ProtectedRoute>
          <BookingConfirmation />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/my-bookings" 
      element={
        <ProtectedRoute>
          <MyBookings />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/invoice/:id" 
      element={
        <ProtectedRoute>
          <Invoice />
        </ProtectedRoute>
      } 
    />
  </>
);

export default ProtectedRoutes;
