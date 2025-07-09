import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function AllOverview() {
  return <div className="p-4">สรุปภาพรวมทั้งหมด (placeholder)</div>;
}
function ManageUsers() {
  return <div className="p-4">จัดการผู้ใช้ (placeholder)</div>;
}
function ManageItems() {
  return <div className="p-4">จัดการอุปกรณ์ (placeholder)</div>;
}

const links = [
  { to: '', label: 'ดูทั้งหมด' },
  { to: 'users', label: 'จัดการผู้ใช้' },
  { to: 'items', label: 'จัดการอุปกรณ์' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  if (!user || user.role !== 3) return <Navigate to="/" />;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="MFU Admin" links={links} onLogout={logout} />
      <Routes>
        <Route path="" element={<AllOverview />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="items" element={<ManageItems />} />
      </Routes>
    </div>
  );
} 