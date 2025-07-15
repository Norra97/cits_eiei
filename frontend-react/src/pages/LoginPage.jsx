import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasProcessedToken, setHasProcessedToken] = useState(false);

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
      } catch (e) {
        console.error('JWT decode error:', e);
      }
    }
  }, [login]);

  // redirect หลัง login สำเร็จ
  useEffect(() => {
    console.log('Current user context:', user);
    if (user) {
      const role = Number(user.role); // แปลงเป็นตัวเลขเสมอ
      if (role === 3) navigate('/admin');
      else if (role === 2) navigate('/staff');
      else navigate('/user');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/login', { username, password });
      // backend ส่ง { userId, username, role, token }
      login({
        userId: res.data.userId,
        username: res.data.username,
        role: res.data.role,
        token: res.data.token
      });
      if (res.data.role === 3) navigate('/admin');
      else if (res.data.role === 2) navigate('/staff');
      else navigate('/user');
    } catch (err) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
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
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
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