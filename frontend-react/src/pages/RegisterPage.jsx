import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'รหัสผ่านไม่ตรงกัน', text: 'โปรดตรวจสอบรหัสผ่านอีกครั้ง' });
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/register', { username, email, password, phone, department });
      Swal.fire({ icon: 'success', title: 'สมัครสมาชิกสำเร็จ', text: 'กรุณาเข้าสู่ระบบ' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: msg });
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
          <h1 className="text-2xl font-bold text-[#a6192e]">สมัครสมาชิก</h1>
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
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e]"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e]"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#a6192e] p-1"
              onMouseDown={() => setShowConfirmPassword(true)}
              onMouseUp={() => setShowConfirmPassword(false)}
              onMouseLeave={() => setShowConfirmPassword(false)}
              aria-label="Show confirm password"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e]"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <select
            id="department"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a6192e] bg-white text-black appearance-none"
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
          <button
            type="submit"
            className="w-full bg-[#a6192e] text-white py-2 rounded hover:bg-[#bfa14a] transition-colors font-semibold"
          >
            สมัครสมาชิก
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>มีบัญชีอยู่แล้ว? </span>
          <button className="text-[#a6192e] underline" onClick={() => navigate('/login')}>เข้าสู่ระบบ</button>
        </div>
      </div>
    </div>
  );
} 