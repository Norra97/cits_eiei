import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ManageUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ username: '', role: 1, department: '', useremail: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

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
    try {
      const res = await fetch(`http://localhost:3001/api/users/${selectedUser.userid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('แก้ไขไม่สำเร็จ');
      setSelectedUser(null);
      fetchUsers();
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl" onClick={() => setSelectedUser(null)}>&times;</button>
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
                <input className="w-full border rounded px-3 py-2" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">อีเมล</label>
                <input className="w-full border rounded px-3 py-2" value={form.useremail} onChange={e => setForm(f => ({ ...f, useremail: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">เบอร์โทร</label>
                <input className="w-full border rounded px-3 py-2" value={form.phonenum || ''} onChange={e => setForm(f => ({ ...f, phonenum: e.target.value }))} />
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <button className="w-full bg-mfu-gold text-white py-2 rounded font-semibold mt-2 hover:opacity-90 disabled:opacity-60" onClick={handleSave} disabled={saving}>{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 