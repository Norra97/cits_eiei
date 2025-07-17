import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import UserDashboard from './pages/UserDashboard';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordSent from './pages/ForgotPasswordSent';
import ResetPassword from './pages/ResetPassword';
import LinkAccount from './pages/LinkAccount';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/staff/*" element={<StaffDashboard />} />
          <Route path="/user/*" element={<UserDashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password/sent" element={<ForgotPasswordSent />} />
          <Route path="/reset-password/:userid" element={<ResetPassword />} />
          <Route path="/link-account" element={<LinkAccount />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
); 