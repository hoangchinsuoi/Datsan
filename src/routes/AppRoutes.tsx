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
import Dashboard from '../pages/Admin/Dashboard';
import AdminFields from '../pages/Admin/ManageFields';
import AdminBookings from '../pages/Admin/Reports';
import AdminUsers from '../pages/Admin/Users';
import AdminReviews from '../pages/Admin/Reviews';
import AdminSettings from '../pages/Admin/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/field/:id" element={<FieldDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/fields" element={<AdminFields />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
