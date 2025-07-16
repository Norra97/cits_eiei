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
    unavailable: null,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [pendingAssets, setPendingAssets] = useState([]);

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
      const broken = equipment.filter(e => e.Assetstatus === 'Broken').length;
      const unavailable = equipment.filter(e => e.Assetstatus === 'Disable').length;
      setStats({
        users: users.length,
        equipment: equipment.length,
        borrowed,
        pending,
        broken,
        unavailable,
      });
      setAssets(equipment);
      // กิจกรรมล่าสุด: เอา 5 รายการล่าสุดจาก allHistory (เรียงตามวันที่ถ้ามี)
      const sorted = [...allHistory].sort((a, b) => {
        const dateA = new Date(a.Borrowdate || a.createdAt || 0);
        const dateB = new Date(b.Borrowdate || b.createdAt || 0);
        return dateB - dateA;
      });
      setRecent(sorted.slice(0, 5).map(h => ({
        time: formatDate(h.Borrowdate || h.createdAt || ''),
        desc: `${h.Borrowname || h.username || 'ไม่ทราบ'} ยืม ${h.Assetname || h.Assetcode || h.Assetid || ''} (${h.Status})`,
      })));
      // Prepare pending asset list for tooltip
      const pendingAssets = allHistory.filter(h => h.Status === 'Pending').map(h => {
        const asset = equipment.find(e => e.Assetid === h.Assetid);
        return asset ? (asset.Assetname || asset.Assetcode) : `ID:${h.Assetid}`;
      });
      setPendingAssets(Array.from(new Set(pendingAssets)));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [user]);

  // Prepare asset lists for tooltips
  const assetLists = {
    equipment: assets.map(a => a.Assetname || a.Assetcode),
    borrowed: assets.filter(a => a.Assetstatus === 'Borrowed').map(a => a.Assetname || a.Assetcode),
    unavailable: assets.filter(a => a.Assetstatus === 'Disable').map(a => a.Assetname || a.Assetcode),
    broken: assets.filter(a => a.Assetstatus === 'Broken').map(a => a.Assetname || a.Assetcode),
    pending: pendingAssets,
  };

  const statList = [
    { label: 'ผู้ใช้ทั้งหมด', value: stats.users, icon: 'fa-user', tooltip: null },
    { label: 'อุปกรณ์ทั้งหมด', value: stats.equipment, icon: 'fa-laptop', tooltip: assetLists.equipment },
    { label: 'อุปกรณ์ที่ถูกยืม', value: stats.borrowed, icon: 'fa-arrow-up-right-from-square', tooltip: assetLists.borrowed },
    { label: 'คำขอยืมที่รออนุมัติ', value: stats.pending, icon: 'fa-clock', tooltip: assetLists.pending },
    { label: 'อุปกรณ์ชำรุด', value: stats.broken, icon: 'fa-triangle-exclamation', tooltip: assetLists.broken },
    { label: 'อุปกรณ์ที่ไม่พร้อมใช้งาน', value: stats.unavailable, icon: 'fa-ban', tooltip: assetLists.unavailable },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">สรุปภาพรวมระบบ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-5 mb-10">
        {statList.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-center border border-gray-100 hover:shadow-md transition relative"
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="mb-2 text-mfu-gold">
              <i className={`fa-solid ${s.icon} text-2xl`}></i>
            </div>
            <div className="text-3xl font-bold text-mfu-gold">{loading || s.value === null ? <span className="animate-pulse">-</span> : s.value}</div>
            <div className="text-gray-500 mt-1 text-center text-sm">{s.label}</div>
            {s.tooltip && hoveredCard === i && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-white border border-gray-200 rounded shadow-lg px-4 py-2 min-w-[180px] max-h-60 overflow-y-auto text-sm text-gray-700 whitespace-pre-line">
                {s.tooltip.length === 0 ? (
                  <div className="text-gray-400">ไม่มีข้อมูล</div>
                ) : (
                  <ul className="list-disc pl-5">
                    {s.tooltip.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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