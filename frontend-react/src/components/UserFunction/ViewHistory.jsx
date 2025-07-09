// -----------------------------
// ViewHistory: หน้าสำหรับดูประวัติการยืม (placeholder)
// -----------------------------
import React from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ViewHistory() {
  const { user } = useAuth();
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    axios.get('http://localhost:3001/api/borrow/history', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => setHistory(res.data))
      .catch(() => setError('เกิดข้อผิดพลาดในการโหลดข้อมูล'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-mfu-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6m-6 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v10a4 4 0 004 4h6a4 4 0 004-4z" /></svg>
        ประวัติการยืม-คืนอุปกรณ์
      </h2>
      {loading ? (
        <div className="text-gray-500">กำลังโหลด...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-gray-500 bg-white rounded shadow p-6 text-center">ไม่มีประวัติการยืม-คืน</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-mfu-red text-white">
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">ชื่ออุปกรณ์</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">รหัส</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">วันที่ยืม</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">วันที่ต้องคืน</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">สถานะ</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-lg">กิจกรรม</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.Reqid} className="hover:bg-mfu-gold/10 transition">
                  <td className="px-4 py-2 border-b font-medium">{item.Assetname}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{item.Assetcode}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{item.Borrowdate ? new Date(item.Borrowdate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{item.ReturnDate ? new Date(item.ReturnDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 border-b">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-mfu-gold/80 text-mfu-red shadow">{item.Status}</span>
                  </td>
                  <td className="px-4 py-2 border-b text-gray-700">{item.Activity || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 