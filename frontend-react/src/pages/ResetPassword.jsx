import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ResetPassword() {
  const { userid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || '';
  const useremail = location.state?.useremail || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleShowNewDown = () => setShowNew(true);
  const handleShowNewUp = () => setShowNew(false);
  const handleShowConfirmDown = () => setShowConfirm(true);
  const handleShowConfirmUp = () => setShowConfirm(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'รหัสผ่านไม่ตรงกัน' });
      return;
    }
    // Password policy: 8-16, at least 1 upper, 1 lower, 1 digit, no special chars
    const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!policy.test(newPassword)) {
      Swal.fire({ icon: 'error', title: 'รหัสผ่านไม่ตรงตามเงื่อนไข' });
      return;
    }
    try {
      await axios.post(`/api/auth/reset-password/${userid}`, { newPassword });
      Swal.fire({ icon: 'success', title: 'เปลี่ยนรหัสผ่านสำเร็จ' }).then(() => navigate('/login'));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.response?.data?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <div className="mb-2 text-gray-700">Username: <span className="font-semibold">{username}</span></div>
        <div className="mb-4 text-gray-700">Email: <span className="font-semibold">{useremail}</span></div>
        <div className="mb-4 text-left">
          <div className="font-semibold mb-1">Password Policy Recommendations</div>
          <ul className="list-disc ml-6 text-sm text-gray-600">
            <li>Your password must be between 8 and 16 characters.</li>
            <li>Your password must contain at least one uppercase letter.</li>
            <li>Your password must contain at least one lowercase letter.</li>
            <li>Your password must contain at least one number digit.</li>
            <li>The password must not include special characters.</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e]"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onMouseDown={handleShowNewDown}
              onMouseUp={handleShowNewUp}
              onMouseLeave={handleShowNewUp}
              tabIndex={-1}
            >
              {'👁️'}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e]"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onMouseDown={handleShowConfirmDown}
              onMouseUp={handleShowConfirmUp}
              onMouseLeave={handleShowConfirmUp}
              tabIndex={-1}
            >
              {'👁️'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[#06023b] text-white py-2 rounded font-semibold text-lg hover:bg-[#1a1a5e] transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
} 