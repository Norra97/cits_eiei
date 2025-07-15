import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CalendarBar from '../components/UserFunction/CalendarBar';
import ApproveRequests from '../components/StaffFunction/ApproveRequests';
import ConfirmReturn from '../components/StaffFunction/ConfirmReturn';
import StaffAccount from './StaffAccount';

function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // สำหรับ CalendarBar
  const [assetCount, setAssetCount] = useState(0);
  const [pendingBorrowCount, setPendingBorrowCount] = useState(0);
  const [pendingReturnCount, setPendingReturnCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/equipment?ts=${Date.now()}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAssetCount(data.length);
      })
      .catch(() => {
        setAssetCount(0);
      });
    fetch(`/api/borrow/all-history?ts=${Date.now()}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        // รออนุมัติให้ยืม (Pending)
        const pendingBorrow = data.filter(r => r.Status === 'Pending');
        setPendingBorrowCount(pendingBorrow.length);
        // รออนุมัติการคืน (RePending)
        const pendingReturn = data.filter(r => r.Status === 'RePending');
        setPendingReturnCount(pendingReturn.length);
        // รายการล่าสุด (แสดง 5 รายการล่าสุด ทุกสถานะ)
        const sorted = [...data].sort((a, b) => new Date(b.Borrowdate) - new Date(a.Borrowdate));
        setRecentRequests(sorted.slice(0, 5));
        // สำหรับ CalendarBar (คืนอุปกรณ์)
        setItems(data.filter(r => r.Status === 'Approved'));
      })
      .catch(() => {
        setPendingBorrowCount(0);
        setPendingReturnCount(0);
        setRecentRequests([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto pt-0 px-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-mfu-gold text-2xl font-bold">{loading ? '-' : assetCount}</div>
          <div className="text-gray-600">อุปกรณ์ทั้งหมด</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-mfu-gold text-2xl font-bold">{loading ? '-' : pendingBorrowCount}</div>
          <div className="text-gray-600">รออนุมัติให้ยืม</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-mfu-gold text-2xl font-bold">{loading ? '-' : pendingReturnCount}</div>
          <div className="text-gray-600">รออนุมัติการคืน</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 w-full">
          <CalendarBar items={items} />
        </div>
        <div className="md:w-1/2 w-full flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold mb-2">คำขอยืมล่าสุด</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-mfu-red text-white">
                    <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">ผู้ขอ</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">อุปกรณ์</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">วันที่</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-lg">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-4">กำลังโหลด...</td></tr>
                  ) : recentRequests.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-4">ไม่มีข้อมูล</td></tr>
                  ) : recentRequests.map(req => (
                    <tr key={req.Reqid} className="hover:bg-mfu-gold/10 transition">
                      <td className="px-4 py-2 border-b">{req.username || req.Borrowname}</td>
                      <td className="px-4 py-2 border-b">{req.Assetname || req.Assetid}</td>
                      <td className="px-4 py-2 border-b">{req.Borrowdate ? new Date(req.Borrowdate).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2 border-b">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow ${req.Status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : req.Status === 'Approved' ? 'bg-green-200 text-green-800' : req.Status === 'Returned' ? 'bg-gray-200 text-gray-800' : req.Status === 'RePending' ? 'bg-orange-200 text-orange-800' : 'bg-red-200 text-red-800'}`}>{req.Status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const links = [
  { to: '', label: 'แดชบอร์ด' },
  { to: 'approve', label: 'อนุมัติคำขอยืม' },
  { to: 'return', label: 'ยืนยันการคืน' },
];

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  if (!user || user.role !== 2) return <Navigate to="/" />;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="MFU Staff" links={links} onLogout={logout} />
      <div className="max-w-5xl mx-auto pt-24 px-2">
        {/* ไม่มี AnnouncementBar สำหรับ staff */}
        {window.location.pathname === '/staff/account' ? (
          <div className="mt-2">
            <StaffAccount />
          </div>
        ) : (
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="approve" element={<ApproveRequests />} />
            <Route path="return" element={<ConfirmReturn />} />
            <Route path="account" element={null} />
          </Routes>
        )}
      </div>
    </div>
  );
} 