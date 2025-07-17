import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function UserAccount() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- เพิ่ม useEffect สำหรับ redirect user เมลนอกมหาลัยที่ยังไม่มี password ---
  useEffect(() => {
    if (!user || user.role !== 1) return;
    if (
      user.useremail &&
      !user.useremail.endsWith('@mfu.ac.th') &&
      !user.useremail.endsWith('@lamduan.mfu.ac.th')
    ) {
      fetch('/api/users/has-password', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.hasPassword === false) {
            navigate('/user/accountnew', { replace: true });
          }
        });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({ icon: 'error', title: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'รหัสผ่านไม่ตรงกัน' });
      return;
    }
    // Password policy: 8-16, at least 1 upper, 1 lower, 1 digit, no special chars
    const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!policy.test(newPassword)) {
      Swal.fire({ icon: 'error', title: 'รหัสผ่านใหม่ไม่ตรงตามเงื่อนไข', text: 'รหัสผ่านต้องมี 8-16 ตัวอักษร ประกอบด้วยตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข ห้ามมีอักขระพิเศษ' });
      return;
    }
    try {
      // เพิ่มการอัปเดตข้อมูล user หลัก (username, role, useremail) ก่อนเปลี่ยนรหัสผ่าน
      let useremail = user?.useremail;
      let username = user?.username;
      let role = user?.role;
      if (!useremail || !username || !role) {
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (!useremail) useremail = parsed.useremail;
            if (!username) username = parsed.username;
            if (!role) role = parsed.role;
          }
        } catch {}
      }
      await axios.put(`/api/users/${user.userId}`,
        {
          username: username,
          role: role,
          useremail: useremail,
          phonenum: user?.phonenum
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      await axios.post('/api/users/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      Swal.fire({ icon: 'success', title: 'เปลี่ยนรหัสผ่านสำเร็จ' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Password Policy Banner */}
      <div className="w-full max-w-md mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow text-left">
        <div className="font-semibold text-gray-800 mb-2">Password Policy Recommendations</div>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Your password must be between 8 and 16 characters.</li>
          <li>Your password must contain at least one uppercase letter.</li>
          <li>Your password must contain at least one lowercase letter.</li>
          <li>Your password must contain at least one number digit.</li>
          <li>The password must not include special characters.</li>
        </ul>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-mfu-red">ตั้งค่าบัญชี (User)</h2>
        {/* ปุ่มยกเลิกผูกบัญชี Google */}
        <button
          className="w-full bg-gray-200 text-mfu-red py-2 rounded font-semibold mb-4 hover:bg-gray-300 transition"
          type="button"
          onClick={async () => {
            try {
              await axios.post('/api/auth/unlink-google', {}, { headers: { Authorization: `Bearer ${user.token}` } });
              Swal.fire({ icon: 'success', title: 'ยกเลิกผูกบัญชี Google สำเร็จ', timer: 1200, showConfirmButton: false });
              // อัปเดต localStorage (ลบ google_id)
              const newUser = { ...user };
              delete newUser.google_id;
              delete newUser.googleId;
              localStorage.setItem('user', JSON.stringify(newUser));
              setTimeout(() => window.location.reload(), 1200);
            } catch (err) {
              Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.response?.data?.message || 'ยกเลิกไม่สำเร็จ' });
            }
          }}
        >
          ยกเลิกผูกบัญชี Google
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">รหัสผ่านปัจจุบัน</label>
            <div className="relative flex items-center">
              <input
                type={showCurrent ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-mfu-red"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onMouseDown={() => setShowCurrent(true)}
                onMouseUp={() => setShowCurrent(false)}
                onMouseLeave={() => setShowCurrent(false)}
                tabIndex={-1}
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold">รหัสผ่านใหม่</label>
            <div className="relative flex items-center">
              <input
                type={showNew ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-mfu-red"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onMouseDown={() => setShowNew(true)}
                onMouseUp={() => setShowNew(false)}
                onMouseLeave={() => setShowNew(false)}
                tabIndex={-1}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold">ยืนยันรหัสผ่านใหม่</label>
            <div className="relative flex items-center">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-mfu-red"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onMouseDown={() => setShowConfirm(true)}
                onMouseUp={() => setShowConfirm(false)}
                onMouseLeave={() => setShowConfirm(false)}
                tabIndex={-1}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-mfu-red text-white py-2 rounded hover:bg-mfu-gold transition-colors font-semibold"
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </form>
      </div>
    </div>
  );
} 