import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function UserAccountNew() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const [phone, setPhone] = useState(user?.phonenum || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !newPassword || !confirmPassword) {
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
      await axios.post('/api/users/set-password', {
        newPassword,
        phone
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      await Swal.fire({ icon: 'success', title: 'ตั้งรหัสผ่านสำเร็จ', timer: 1200, showConfirmButton: false });
      window.location.href = '/user/account';
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.response?.data?.message || 'ตั้งรหัสผ่านไม่สำเร็จ' });
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
        <h2 className="text-2xl font-bold mb-6 text-center text-mfu-red">ตั้งรหัสผ่านใหม่ (User)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-mfu-red"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
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
            ยืนยัน
          </button>
        </form>
      </div>
    </div>
  );
} 