import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MdCheckCircle } from 'react-icons/md';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/forgot-password', { username });
      // Redirect to reset password page with userid
      const { userid, username: foundUsername, useremail } = res.data;
      navigate(`/reset-password/${userid}`, { state: { username: foundUsername, useremail } });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.response?.data?.message || 'ไม่สามารถส่งคำขอได้' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ minHeight: '100vh' }}>
      <img
        src="http://localhost:3001/images/mfubackgroud.jpg"
        alt="MFU Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.6)' }}
      />
      <div className="absolute inset-0 bg-black opacity-30 z-10" />
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative z-20 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-[#22223b] text-center">Forgot Password</h2>
        <div className="mb-4 text-gray-500 text-center">Enter Username</div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e] text-center"
            placeholder="Student Code or Staff Code"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#06023b] text-white py-2 rounded font-semibold flex items-center justify-center gap-2 text-lg hover:bg-[#1a1a5e] transition-colors"
          >
            <MdCheckCircle className="inline-block mr-1 text-xl" /> Submit
          </button>
        </form>
        <button
          className="w-full mt-4 bg-blue-400 text-white py-2 rounded font-semibold text-lg hover:bg-blue-500 transition-colors"
          onClick={() => navigate('/login')}
        >
          Return to sign-in
        </button>
      </div>
    </div>
  );
} 