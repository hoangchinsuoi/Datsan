import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Search from '../pages/Search';
import FieldDetail from '../pages/FieldDetail';
import Booking from '../pages/Booking';
import MyBookings from '../pages/Reviews';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import PaymentResult from '../pages/PaymentResult';
import Dashboard from '../pages/Admin/Dashboard';
import AdminFields from '../pages/Admin/ManageFields';
import AdminBookings from '../pages/Admin/Reports';
import AdminUsers from '../pages/Admin/Users';
import AdminReviews from '../pages/Admin/Reviews';
import AdminSettings from '../pages/Admin/Settings';
import AdminChat from '../pages/Admin/Chat';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Privacy, Terms, Hospitality, Contact } from '../pages/InfoPages';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/field/:id" element={<FieldDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/hospitality" element={<Hospitality />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/fields" element={<ProtectedRoute requireAdmin><AdminFields /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ProtectedRoute requireAdmin><AdminReviews /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/chat" element={<ProtectedRoute requireAdmin><AdminChat /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
