import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function UserAccountNewInt() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // ย้าย useState ทั้งหมดมาไว้ก่อน return เงื่อนไข
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phone, setPhone] = useState(user?.phonenum || '');
  const [department, setDepartment] = useState(user?.department || '');

  // debug log
  console.log('UserAccountNewInt.jsx', { user, loading });

  // redirect ถ้าข้อมูลครบ
  React.useEffect(() => {
    if (!user) return;
    if (
      user.username &&
      user.role &&
      user.useremail &&
      user.phonenum &&
      user.department &&
      user.password // password hash ต้องมีค่า
    ) {
      console.log('Redirect: user ข้อมูลครบ ไป /user/account');
      navigate('/user/account', { replace: true });
    }
  }, [user, navigate]);

  if (loading) {
    console.log('Loading...');
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }
  if (!user) {
    console.log('User is null');
    return <div className="text-center mt-10 text-red-500">กรุณาเข้าสู่ระบบใหม่อีกครั้ง หรือ login ใหม่</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !department || !newPassword || !confirmPassword) {
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
    // DEBUG: log user context
    console.log('USER DEBUG:', user);
    if (!user || !user.token) {
      Swal.fire({ icon: 'error', title: 'ไม่พบ token', text: 'กรุณา login ใหม่อีกครั้ง' });
      return;
    }
    try {
      // ป้องกัน useremail, username, role หาย: ถ้าไม่มีค่าให้ดึงจาก localStorage
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
      // เตรียม payload สำหรับอัปเดต user
      const updatePayload = {
        phonenum: phone,
        department: department,
        username: username,
        role: role
      };
      if (useremail) updatePayload.useremail = useremail;
      await axios.put(`/api/users/${user.userId}`, updatePayload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      await axios.post('/api/users/set-password', {
        newPassword,
        phone
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      await Swal.fire({ icon: 'success', title: 'ตั้งรหัสผ่านสำเร็จ', timer: 1200, showConfirmButton: false });
      navigate('/user', { replace: true });
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
        <h2 className="text-2xl font-bold mb-6 text-center text-mfu-red">กรุณากรอกข้อมูลให้ครบถ้วน (User)</h2>
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
            <label className="block mb-1 font-semibold">เลือกสำนักวิชา / หน่วยงาน</label>
            <select
              id="department"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mfu-red bg-white text-black appearance-none"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              required
            >
              <option value="" disabled>เลือกสำนักวิชา / หน่วยงาน</option>
              <optgroup label="สำนักวิชา">
                <option value="สำนักวิชาศิลปศาสตร์">สำนักวิชาศิลปศาสตร์</option>
                <option value="สำนักวิชาวิทยาศาสตร์">สำนักวิชาวิทยาศาสตร์</option>
                <option value="สำนักวิชาการจัดการ">สำนักวิชาการจัดการ</option>
                <option value="สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์">สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์</option>
                <option value="สำนักวิชาอุตสาหกรรมเกษตร">สำนักวิชาอุตสาหกรรมเกษตร</option>
                <option value="สำนักวิชานิติศาสตร์">สำนักวิชานิติศาสตร์</option>
                <option value="สำนักวิชาวิทยาศาสตร์เครื่องสำอาง">สำนักวิชาวิทยาศาสตร์เครื่องสำอาง</option>
                <option value="สำนักวิทยาศาสตร์สุขภาพ">สำนักวิทยาศาสตร์สุขภาพ</option>
                <option value="สำนักวิชาพยาบาลศาสตร์">สำนักวิชาพยาบาลศาสตร์</option>
                <option value="สำนักวิชาเวชศาสตร์ชะลอวัยและฟื้นฟูสุขภาพ">สำนักวิชาเวชศาสตร์ชะลอวัยและฟื้นฟูสุขภาพ</option>
                <option value="สำนักวิชาแพทยศาสตร์">สำนักวิชาแพทยศาสตร์</option>
                <option value="สำนักวิชาทันตแพทยศาสตร์">สำนักวิชาทันตแพทยศาสตร์</option>
                <option value="คลินิกทันตกรรม สำนักวิชาทันตแพทยศาสตร์">คลินิกทันตกรรม สำนักวิชาทันตแพทยศาสตร์</option>
                <option value="สำนักวิชานวัตกรรมสังคม">สำนักวิชานวัตกรรมสังคม</option>
                <option value="สำนักวิชาจีนวิทยา">สำนักวิชาจีนวิทยา</option>
                <option value="สำนักวิชาการแพทย์บูรณาการ">สำนักวิชาการแพทย์บูรณาการ</option>
              </optgroup>
              <optgroup label="ศูนย์">
                <option value="ศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี">ศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี</option>
                <option value="ศูนย์เทคโนโลยีสารสนเทศ">ศูนย์เทคโนโลยีสารสนเทศ</option>
                <option value="ศูนย์บรรณสารและสื่อการศึกษา">ศูนย์บรรณสารและสื่อการศึกษา</option>
                <option value="ศูนย์บริการวิชาการ">ศูนย์บริการวิชาการ</option>
                <option value="ศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง">ศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง</option>
                <option value="สำนักงานเลขานุการศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง">สำนักงานเลขานุการศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง</option>
                <option value="โรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง">โรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง</option>
              </optgroup>
              <optgroup label="สถาบัน">
                <option value="สถาบันวิจัยและนวัตกรรมแห่งมหาวิทยาลัยแม่ฟ้าหลวง">สถาบันวิจัยและนวัตกรรมแห่งมหาวิทยาลัยแม่ฟ้าหลวง</option>
                <option value="สถาบันศิลปวัฒนธรรมและอารยธรรมลุ่มน้ำโขง">สถาบันศิลปวัฒนธรรมและอารยธรรมลุ่มน้ำโขง</option>
              </optgroup>
              <optgroup label="สำนักงานวิชาการ">
                <option value="ส่วนทะเบียนและประมวลผล">ส่วนทะเบียนและประมวลผล</option>
                <option value="ส่วนพัฒนานักศึกษา">ส่วนพัฒนานักศึกษา</option>
                <option value="ส่วนพัฒนาความสัมพันธ์ระหว่างประเทศ">ส่วนพัฒนาความสัมพันธ์ระหว่างประเทศ</option>
                <option value="ส่วนประกันคุณภาพการศึกษาและพัฒนาหลักสูตร">ส่วนประกันคุณภาพการศึกษาและพัฒนาหลักสูตร</option>
              </optgroup>
              <optgroup label="สำนักงานบริหารกลาง">
                <option value="ส่วนสารบรรณและอำนวยการ">ส่วนสารบรรณและอำนวยการ</option>
                <option value="ส่วนการเจ้าหน้าที่">ส่วนการเจ้าหน้าที่</option>
                <option value="ส่วนการเงินและบัญชี">ส่วนการเงินและบัญชี</option>
                <option value="ส่วนพัสดุ">ส่วนพัสดุ</option>
              </optgroup>
              <optgroup label="หน่วยงานพิเศษ">
                <option value="ศูนย์ภาษาและวัฒนธรรมจีนสิรินธร">ศูนย์ภาษาและวัฒนธรรมจีนสิรินธร</option>
                <option value="ศูนย์ความเป็นเลิศทางด้านการวิจัยเชื้อรา">ศูนย์ความเป็นเลิศทางด้านการวิจัยเชื้อรา</option>
              </optgroup>
            </select>
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