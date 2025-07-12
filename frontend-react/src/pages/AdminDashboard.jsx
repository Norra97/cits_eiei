import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ManageUsers from '../components/AdminFunction/ManageUsers';
import ManageItems from '../components/AdminFunction/ManageItems';
import Reports from '../components/AdminFunction/Reports';
import { useEffect, useState } from 'react';

function AllOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: null,
    equipment: null,
    borrowed: null,
    pending: null,
    broken: null,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // เพิ่มฟังก์ชันแปลงวันที่ (ไม่เอาปี)
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { month: '2-digit', day: '2-digit' });
  };

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    const headers = { Authorization: `Bearer ${user.token}` };
    Promise.all([
      fetch('http://localhost:3001/api/users', { headers }).then(r => r.json()),
      fetch('http://localhost:3001/api/equipment', { headers }).then(r => r.json()),
      fetch('http://localhost:3001/api/borrow/all-history', { headers }).then(r => r.json()),
    ]).then(([users, equipment, allHistory]) => {
      const borrowed = allHistory.filter(h => h.Status === 'Borrowed').length;
      const pending = allHistory.filter(h => h.Status === 'Pending').length;
      const broken = equipment.filter(e => e.Status === 'ชำรุด' || e.Status === 'เสีย' || e.Status === 'เสียหาย').length;
      setStats({
        users: users.length,
        equipment: equipment.length,
        borrowed,
        pending,
        broken,
      });
      // กิจกรรมล่าสุด: เอา 5 รายการล่าสุดจาก allHistory (เรียงตามวันที่ถ้ามี)
      const sorted = [...allHistory].sort((a, b) => new Date(b.Borrowdate || b.createdAt) - new Date(a.Borrowdate || a.createdAt));
      setRecent(sorted.slice(0, 5).map(h => ({
        time: formatDate(h.Borrowdate || h.createdAt),
        desc: `${h.Borrowname || h.username || 'ไม่ทราบ'} ยืม ${h.Assetid || h.item || ''} (${h.Status})`,
      })));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [user]);

  const statList = [
    { label: 'ผู้ใช้ทั้งหมด', value: stats.users, icon: 'fa-user' },
    { label: 'อุปกรณ์ทั้งหมด', value: stats.equipment, icon: 'fa-laptop' },
    { label: 'อุปกรณ์ที่ถูกยืม', value: stats.borrowed, icon: 'fa-arrow-up-right-from-square' },
    { label: 'คำขอยืมที่รออนุมัติ', value: stats.pending, icon: 'fa-clock' },
    { label: 'อุปกรณ์ชำรุด', value: stats.broken, icon: 'fa-triangle-exclamation' },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">สรุปภาพรวมระบบ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
        {statList.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-center border border-gray-100 hover:shadow-md transition">
            <div className="mb-2 text-mfu-gold">
              <i className={`fa-solid ${s.icon} text-2xl`}></i>
            </div>
            <div className="text-3xl font-bold text-mfu-gold">{loading || s.value === null ? <span className="animate-pulse">-</span> : s.value}</div>
            <div className="text-gray-500 mt-1 text-center text-sm">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold mb-3 text-gray-700">กิจกรรมล่าสุด</h3>
        {loading ? <div className="text-gray-400 animate-pulse">กำลังโหลด...</div> : (
          <ul className="divide-y divide-gray-100">
            {recent.map((r, i) => (
              <li key={i} className="py-3 flex items-center text-sm text-gray-600">
                <span className="w-16 text-gray-400 font-mono text-xs">{r.time}</span>
                <span className="ml-3">{r.desc}</span>
              </li>
            ))}
            {recent.length === 0 && <li className="py-3 text-gray-400">ไม่มีข้อมูล</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

const links = [
  { to: '', label: 'ดูทั้งหมด' },
  { to: 'users', label: 'จัดการผู้ใช้' },
  { to: 'items', label: 'จัดการอุปกรณ์' },
  { to: 'reports', label: 'รายงาน' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  if (!user || user.role !== 3) return <Navigate to="/" />;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="MFU Admin" links={links} onLogout={logout} />
      <Routes>
        <Route path="" element={<AllOverview />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="items" element={<ManageItems />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </div>
  );
} 