import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-[#7d2f2c] border-b fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo + System Name */}
        <a href="#" className="flex items-center">
          <img src="/images/mfu-logo.png" alt="Logo" className="h-12 w-auto mr-3" />
          <div className="text-center">
            <div className="font-bold text-base sm:text-lg">Equipment Borrowing and Returning System</div>
            <div className="text-[13px] sm:text-sm font-bold text-[#806850]">MAE FAH LUANG UNIVERSITY</div>
          </div>
        </a>

        {/* User menu links (role 1) */}
        {user?.role === 1 && (
          <div className="flex space-x-4 ml-8">
            <a href="/user" className="text-white hover:text-mfu-gold font-semibold">แดชบอร์ด</a>
            <a href="/user/request" className="text-white hover:text-mfu-gold font-semibold">ส่งคำขอยืม</a>
            <a href="/user/return" className="text-white hover:text-mfu-gold font-semibold">แจ้งคืน</a>
            <a href="/user/history" className="text-white hover:text-mfu-gold font-semibold">ดูประวัติ</a>
          </div>
        )}

        {/* Staff menu links (role 2) */}
        {user?.role === 2 && (
          <div className="flex space-x-4 ml-8">
            <a href="/staff" className="text-white hover:text-mfu-gold font-semibold">แดชบอร์ด</a>
            <a href="/staff/approve" className="text-white hover:text-mfu-gold font-semibold">อนุมัติคำขอยืม</a>
            <a href="/staff/return" className="text-white hover:text-mfu-gold font-semibold">ยืนยันการคืน</a>
          </div>
        )}

        {/* Right side: Theme, Notification, Profile */}
        <div className="flex items-center space-x-2">
          {/* Profile dropdown */}
          <div className="relative">
            <img
              src="/images/profile.webp"
              alt="profile"
              className="h-9 w-9 rounded-full cursor-pointer border-2 border-mfu-gold"
              onClick={() => setShowProfile(v => !v)}
            />
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
                <div className="flex flex-col items-center p-4 border-b">
                  <img src="/images/profile.webp" alt="Profile" className="h-12 w-12 rounded-full mb-2" />
                  <p className="font-semibold">{user?.username || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{user?.userId || 'ID'}</p>
                </div>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={() => {/* redirect to profile */}}
                >
                  <i className="fa fa-user mr-2" /> Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={onLogout}
                >
                  <i className="fa fa-sign-out mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 