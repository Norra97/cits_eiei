import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Reports() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    fetch('http://localhost:3001/api/borrow/all-history', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // ฟิลเตอร์ข้อมูลตาม search
  const filtered = history.filter(h => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (h.Borrowname && h.Borrowname.toLowerCase().includes(q)) ||
      (h.Assetid && h.Assetid.toString().toLowerCase().includes(q))
    );
  });

  // แปลงวันที่
  const formatDate = d => d ? new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-';

  // ฟังก์ชัน export CSV
  const exportCSV = () => {
    const header = ['วันที่ยืม', 'ชื่อผู้ใช้', 'รหัสอุปกรณ์', 'สถานะ', 'วันที่คืน'];
    const rows = filtered.map(h => [
      formatDate(h.Borrowdate),
      h.Borrowname,
      h.Assetid,
      h.Status,
      formatDate(h.ReturnDate)
    ]);
    const csv = [header, ...rows].map(r => r.map(x => '"' + (x ?? '') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">รายงานการยืม-คืนอุปกรณ์</h2>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full max-w-xs focus:ring-2 focus:ring-mfu-gold outline-none"
          placeholder="ค้นหาชื่อผู้ใช้หรือรหัสอุปกรณ์..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="bg-mfu-gold text-white px-4 py-2 rounded font-semibold hover:opacity-90 transition text-sm"
          onClick={exportCSV}
        >
          Export CSV
        </button>
      </div>
      {loading ? (
        <div className="text-gray-400 animate-pulse">กำลังโหลด...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm text-sm border border-gray-100">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">วันที่ยืม</th>
                <th className="py-3 px-4 text-left font-semibold">ชื่อผู้ใช้</th>
                <th className="py-3 px-4 text-left font-semibold">รหัสอุปกรณ์</th>
                <th className="py-3 px-4 text-left font-semibold">สถานะ</th>
                <th className="py-3 px-4 text-left font-semibold">วันที่คืน</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-mfu-gold/10 transition">
                  <td className="py-2.5 px-4 text-gray-800">{formatDate(h.Borrowdate)}</td>
                  <td className="py-2.5 px-4 text-gray-800">{h.Borrowname}</td>
                  <td className="py-2.5 px-4 text-gray-800">{h.Assetid}</td>
                  <td className="py-2.5 px-4 text-gray-700">{h.Status}</td>
                  <td className="py-2.5 px-4 text-gray-600">{formatDate(h.ReturnDate)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-6">ไม่พบข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 