import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

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
    if (!token) return; // ถ้าไม่มี token ไม่ต้องทำอะไร

    try {
      const payload = JSON.parse(base64UrlDecode(token.split('.')[1]));
      login({
        userId: payload.id,
        username: payload.username,
        role: payload.role,
        token,
        picture: payload.picture
      });
      setHasProcessedToken(true); // set flag
      // ลบ token ออกจาก URL และ redirect ไปหน้า dashboard ตาม role
      const role = Number(payload.role);
      if (role === 3) {
        window.history.replaceState({}, document.title, '/admin');
        navigate('/admin', { replace: true });
      } else if (role === 2) {
        window.history.replaceState({}, document.title, '/staff');
        navigate('/staff', { replace: true });
      } else {
        window.history.replaceState({}, document.title, '/user');
        navigate('/user', { replace: true });
      }
    } catch (e) {
      console.error('JWT decode error:', e);
    }
    // eslint-disable-next-line
  }, [login, location.search, hasProcessedToken, navigate]);

  // redirect หลัง login สำเร็จ
  useEffect(() => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a6192e] to-[#bfa14a]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
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
        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            onClick={() => window.location.href = 'http://localhost:3001/api/auth/google'}
            className="bg-white border text-black px-4 py-2 rounded flex items-center gap-2 shadow hover:bg-gray-100"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: 20 }} />
            Login with Google
          </button>
        </div>
        <div className="mt-4 text-center">
          <span>ยังไม่มีบัญชี?</span>
          <button className="text-[#a6192e] underline ml-1" onClick={() => navigate('/register')}>สมัครสมาชิก</button>
        </div>
      </div>
    </div>
  );
} 