import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ManageUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ username: '', role: 1, department: '', useremail: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ดึงข้อมูลผู้ใช้
  const fetchUsers = () => {
    if (!user?.token) return;
    setLoading(true);
    fetch('http://localhost:3001/api/users', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [user]);

  // เมื่อเลือก user ให้ set form
  useEffect(() => {
    if (selectedUser) {
      setForm({
        username: selectedUser.username || '',
        role: selectedUser.role || 1,
        department: selectedUser.department || '',
        useremail: selectedUser.useremail || '',
        phonenum: selectedUser.phonenum || '',
      });
      setError('');
    }
  }, [selectedUser]);

  // ฟังก์ชันบันทึก
  const handleSave = async () => {
    setSaving(true);
    setError('');
    if (showPasswordFields && newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      setSaving(false);
      return;
    }
    try {
      const body = showPasswordFields && newPassword ? { ...form, password: newPassword } : form;
      const res = await fetch(`http://localhost:3001/api/users/${selectedUser.userid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('แก้ไขไม่สำเร็จ');
      await Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูลสำเร็จ',
        showConfirmButton: false,
        timer: 1500
      });
      setSelectedUser(null);
      fetchUsers();
      setShowPasswordFields(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setError('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  // ฟิลเตอร์ข้อมูลตาม search
  const filteredUsers = users.filter(u => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.useremail && u.useremail.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">จัดการผู้ใช้</h2>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full max-w-xs focus:ring-2 focus:ring-mfu-gold outline-none"
          placeholder="ค้นหาชื่อ, อีเมล, แผนก..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-gray-400 animate-pulse">กำลังโหลด...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm text-sm border border-gray-100">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">ID</th>
                <th className="py-3 px-4 text-left font-semibold">ชื่อผู้ใช้</th>
                <th className="py-3 px-4 text-left font-semibold">บทบาท</th>
                <th className="py-3 px-4 text-left font-semibold">แผนก</th>
                <th className="py-3 px-4 text-left font-semibold">อีเมล</th>
                <th className="py-3 px-4 text-left font-semibold">เบอร์โทร</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.userid} className="border-b last:border-0 hover:bg-mfu-gold/10 transition cursor-pointer" onClick={() => setSelectedUser(u)}>
                  <td className="py-2.5 px-4 text-gray-800">{u.userid}</td>
                  <td className="py-2.5 px-4 text-gray-800">{u.username}</td>
                  <td className="py-2.5 px-4 text-gray-700">{u.role === 3 ? 'แอดมิน' : u.role === 2 ? 'เจ้าหน้าที่' : 'ผู้ใช้'}</td>
                  <td className="py-2.5 px-4 text-gray-600">{u.department || '-'}</td>
                  <td className="py-2.5 px-4 text-gray-600">{u.useremail || '-'}</td>
                  <td className="py-2.5 px-4 text-gray-600">{u.phonenum || '-'}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-6">ไม่พบข้อมูลผู้ใช้</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal ฟอร์มแก้ไข */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={e => {
          if (e.target === e.currentTarget) setSelectedUser(null);
        }}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-3xl font-extrabold" onClick={() => setSelectedUser(null)}>&times;</button>
            <h3 className="text-lg font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">ชื่อผู้ใช้</label>
                <input className="w-full border rounded px-3 py-2" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">บทบาท</label>
                <select className="w-full border rounded px-3 py-2" value={form.role} onChange={e => setForm(f => ({ ...f, role: Number(e.target.value) }))}>
                  <option value={1}>ผู้ใช้</option>
                  <option value={2}>เจ้าหน้าที่</option>
                  <option value={3}>แอดมิน</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">แผนก</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                >
                  <option value="">เลือกสำนักวิชา / หน่วยงาน</option>
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
                <label className="block text-sm mb-1">อีเมล</label>
                <input className="w-full border rounded px-3 py-2" value={form.useremail} onChange={e => setForm(f => ({ ...f, useremail: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">เบอร์โทร</label>
                <input className="w-full border rounded px-3 py-2" value={form.phonenum || ''} onChange={e => setForm(f => ({ ...f, phonenum: e.target.value }))} />
              </div>
              <button
                type="button"
                className="text-mfu-gold underline text-sm mt-2"
                onClick={() => setShowPasswordFields(v => !v)}
              >{showPasswordFields ? 'ยกเลิกเปลี่ยนรหัสผ่าน' : 'เปลี่ยนรหัสผ่าน'}</button>
              {showPasswordFields && (
                <>
                  <div>
                    <label className="block text-sm mb-1 mt-2">รหัสผ่านใหม่</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full border rounded px-3 py-2 pr-10"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mfu-gold"
                        onMouseDown={() => setShowNewPassword(true)}
                        onMouseUp={() => setShowNewPassword(false)}
                        onMouseLeave={() => setShowNewPassword(false)}
                        tabIndex={-1}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 mt-2">ยืนยันรหัสผ่านใหม่</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="w-full border rounded px-3 py-2 pr-10"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mfu-gold"
                        onMouseDown={() => setShowConfirmPassword(true)}
                        onMouseUp={() => setShowConfirmPassword(false)}
                        onMouseLeave={() => setShowConfirmPassword(false)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </>
              )}
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <button className="w-full bg-mfu-gold text-white py-2 rounded font-semibold mt-2 hover:opacity-90 disabled:opacity-60" onClick={handleSave} disabled={saving}>{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 