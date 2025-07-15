import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function UserAccount() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({ icon: 'error', title: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'รหัสผ่านใหม่ไม่ตรงกัน' });
      return;
    }
    if (newPassword.length < 6) {
      Swal.fire({ icon: 'error', title: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
      return;
    }
    try {
      await axios.post('/api/user/change-password', {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-mfu-red">ตั้งค่าบัญชี (User)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-mfu-red"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">รหัสผ่านใหม่</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-mfu-red"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-mfu-red"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
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