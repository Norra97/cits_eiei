import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export default function LinkAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [googleInfo, setGoogleInfo] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setGoogleInfo(decoded);
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Token ไม่ถูกต้อง', text: 'กรุณาลองใหม่' });
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleLink = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/link-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_id: googleInfo.google_id,
          email: googleInfo.email,
          student_code: input.trim(),
          picture: googleInfo.picture,
        })
      });
      const data = await res.json();
      if (res.ok) {
        let role = data.role;
        if (!role) role = 1;
        let dash = '/user';
        if (role === 3) dash = '/admin';
        else if (role === 2) dash = '/staff';
        console.log('[LinkAccount] Redirecting to:', dash, 'with role:', role, 'data:', data);
        window.location.href = dash;
      } else {
        Swal.fire({ icon: 'error', title: 'ผูกบัญชีไม่สำเร็จ', text: data.message || 'เกิดข้อผิดพลาด' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: e.message });
    } finally {
      setLoading(false);
    }
  };

  if (!googleInfo) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">ผูกบัญชี Google กับบัญชีมหาวิทยาลัย</h2>
        <div className="flex flex-col items-center mb-4">
          {googleInfo.picture && <img src={googleInfo.picture} alt="Google profile" className="w-16 h-16 rounded-full mb-2" />}
          <div className="font-semibold">{googleInfo.username}</div>
          <div className="text-gray-500 text-sm">{googleInfo.email}</div>
        </div>
        <form onSubmit={handleLink} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">รหัสนักศึกษา หรืออีเมลมหาวิทยาลัย</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="ID or Email"
              required
            />
          </div>
          <button
            className="w-full bg-mfu-gold text-white py-2 rounded font-semibold hover:opacity-90 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >{loading ? 'กำลังผูกบัญชี...' : 'ผูกบัญชี'}</button>
        </form>
        <button
          className="w-full bg-gray-300 text-gray-700 py-2 rounded font-semibold mt-4 hover:bg-gray-400 transition"
          type="button"
          onClick={async () => {
            if (!googleInfo) return;
            try {
              const res = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  username: googleInfo.username,
                  email: googleInfo.email,
                  phone: 'external',
                  department: 'external',
                  password: '' // ส่ง password ว่าง
                })
              });
              const data = await res.json();
              console.log('[LinkAccount] Data:', data, 'res.ok:', res.ok);
              if (res.ok) {
                // save user info to localStorage (simulate login) ถ้ามี token/role
                if (data.token && data.role) {
                  localStorage.setItem('user', JSON.stringify({
                    userId: data.userId,
                    username: googleInfo.username,
                    role: data.role,
                    token: data.token,
                    picture: googleInfo.picture
                  }));
                  login({
                    userId: data.userId,
                    username: googleInfo.username,
                    role: data.role,
                    token: data.token,
                    picture: googleInfo.picture
                  });
                }
                let role = data.role;
                if (!role) role = 1;
                let dash = '/user';
                if (role === 3) dash = '/admin';
                else if (role === 2) dash = '/staff';
                console.log('[LinkAccount] Redirecting to:', dash, 'with role:', role, 'data:', data);
                window.location.href = dash;
              } else {
                console.log('[LinkAccount] Not OK:', data);
                Swal.fire({ icon: 'error', title: 'สร้างบัญชีไม่สำเร็จ', text: data.message || 'เกิดข้อผิดพลาด' });
              }
            } catch (e) {
              console.error('[LinkAccount] ERROR:', e);
              Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: e.message });
            }
          }}
        >ไม่ใช่บุคลากรหรือนักศึกษาในมหาวิทยาลัย</button>
      </div>
    </div>
  );
} 