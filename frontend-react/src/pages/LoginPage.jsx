import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasProcessedToken, setHasProcessedToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // รับ token จาก URL และ login (ใช้ location.search)
  useEffect(() => {
    if (hasProcessedToken) return; // ป้องกัน execute ซ้ำ

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        login({
          userId: payload.id,
          username: payload.username,
          role: payload.role,
          token,
          picture: payload.picture // รองรับรูปจาก Google
        });
        setHasProcessedToken(true); // ป้องกัน loop
        // redirect ทันทีตาม role
        let dash = '/user';
        if (payload.role === 3) dash = '/admin';
        else if (payload.role === 2) dash = '/staff';
        navigate(dash);
      } catch (e) {
        console.error('JWT decode error:', e);
      }
    }
  }, [login, navigate, location.search, hasProcessedToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      // backend ส่ง { userId, username, role, token }
      login({
        userId: res.data.userId,
        username: res.data.username,
        role: res.data.role,
        token: res.data.token
      });
      let dash = '/user';
      if (res.data.role === 3) dash = '/admin';
      else if (res.data.role === 2) dash = '/staff';
      await Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        html: `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div style='margin-bottom:8px;'>กำลังเข้าสู่หน้าแดชบอร์ด...</div>
          <div class='swal2-spinner' style='display:inline-block;width:32px;height:32px;border:4px solid #a5a5a5;border-top:4px solid #6c63ff;border-radius:50%;animation:spin 1s linear infinite;'></div>
        </div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          const style = document.createElement('style');
          style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`;
          document.head.appendChild(style);
        }
      });
      navigate(dash);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เข้าสู่ระบบไม่สำเร็จ', text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
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
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative z-20">
        <div className="flex flex-col items-center mb-6">
          <img src="/images/mfu-logo.png" alt="MFU Logo" className="w-10 h-16 mb-2" />
          <h1 className="text-2xl font-bold text-[#a6192e]">MFU Borrow System</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e]"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e]"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#a6192e] p-1"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              aria-label="Show password"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </button>
          </div>
          <div className="flex justify-end -mt-2 mb-2">
            <button type="button" className="text-xs text-mfu-red hover:underline focus:outline-none" onClick={() => navigate('/forgot-password')}>ลืมรหัสผ่าน</button>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#a6192e] text-white py-2 rounded hover:bg-[#bfa14a] transition-colors font-semibold"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400">หรือ</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2 hover:bg-gray-100 transition-colors font-semibold text-gray-700 mb-2"
          onClick={() => window.location.href = 'http://localhost:3001/api/auth/google'}
          type="button"
        >
          <FcGoogle className="text-2xl" />
          <span>เข้าสู่ระบบด้วย Google</span>
        </button>
        <div className="mt-4 text-center">
          <span>ยังไม่มีบัญชี?</span>
          <button className="text-[#a6192e] underline ml-1" onClick={() => navigate('/register')}>สมัครสมาชิก</button>
        </div>
      </div>
    </div>
  );
} 