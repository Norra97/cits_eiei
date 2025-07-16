// -----------------------------
// ReturnItem: หน้าสำหรับแจ้งคืนอุปกรณ์ (placeholder)
// -----------------------------
import React from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

export default function ReturnItem({ items = [] }) {
  const { user } = useAuth();
  const [selected, setSelected] = React.useState(null); // Reqid of item to return
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [localItems, setLocalItems] = React.useState(items);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleReturn = async (item) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`http://localhost:3001/api/borrow/return/${item.Reqid}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      Swal.fire({
        icon: 'success',
        title: `คืนอุปกรณ์ "${item.Assetname}" สำเร็จ!`,
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      setLocalItems(localItems.filter(i => i.Reqid !== item.Reqid));
      setSelected(null);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการคืน กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  // หา items ที่ถูก reject
  const rejectedItems = localItems.filter(item => item.Status === 'RePending');

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-mfu-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6m-6 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v10a4 4 0 004 4h6a4 4 0 004-4z" /></svg>
        แจ้งคืนอุปกรณ์
      </h2>
      {/* แจ้งเตือนพิเศษเมื่อถูก reject */}
      {rejectedItems.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 rounded">
          <div className="font-semibold mb-1 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
            การคืนอุปกรณ์ของคุณถูกปฏิเสธ กรุณาตรวจสอบและแจ้งคืนใหม่
          </div>
          <ul className="list-disc pl-6">
            {rejectedItems.map(item => (
              <li key={item.Reqid}>
                <span className="font-bold">{item.Assetname}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {localItems.length === 0 ? (
        <div className="text-gray-500 bg-white rounded shadow p-6 text-center">ไม่มีรายการที่ยืมอยู่</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-mfu-red text-white">
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">ชื่ออุปกรณ์</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">รหัส</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">วันที่ต้องคืน</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">เหตุผล</th>
                <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider rounded-tr-lg">คืน</th>
              </tr>
            </thead>
            <tbody>
              {localItems.map(item => (
                <tr
                  key={item.Reqid}
                  className="hover:bg-mfu-gold/10 transition"
                >
                  <td className="px-6 py-4 border-b font-medium flex items-center gap-2">
                    <svg className="w-5 h-5 text-mfu-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6m-6 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v10a4 4 0 004 4h6a4 4 0 004-4z" /></svg>
                    {item.Assetname}
                  </td>
                  <td className="px-6 py-4 border-b text-gray-700">{item.Assetcode}</td>
                  <td className="px-6 py-4 border-b text-gray-700">
                    {item.ReturnDate ? (
                      <span className="font-semibold text-mfu-red">{new Date(item.ReturnDate).toLocaleDateString()}</span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 border-b text-gray-700">
                    {item.Comment ? item.Comment : '-'}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {(item.Status === 'Approved' || item.Status === 'RePending') && (
                      <button
                        className="bg-mfu-gold hover:bg-mfu-red text-white font-bold py-2 px-4 rounded shadow"
                        onClick={() => setSelected(item.Reqid)}
                        disabled={loading}
                      >
                        คืน
                      </button>
                    )}
                    {/* ยืนยันคืน */}
                    {selected === item.Reqid && (
                      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={e => {
                        if (e.target === e.currentTarget) setSelected(null);
                      }}>
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
                          <button className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-3xl font-extrabold" onClick={() => setSelected(null)}>&times;</button>
                          <h3 className="text-lg font-bold mb-2">ยืนยันการคืนอุปกรณ์</h3>
                          <p className="mb-4">คุณต้องการคืน "{item.Assetname}" ใช่หรือไม่?</p>
                          <div className="flex gap-2 justify-center">
                            <button
                              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                              onClick={() => setSelected(null)}
                              disabled={loading}
                            >ยกเลิก</button>
                            <button
                              className="px-4 py-2 bg-mfu-red text-white rounded hover:bg-mfu-gold"
                              onClick={() => handleReturn(item)}
                              disabled={loading}
                            >{loading ? 'กำลังคืน...' : 'ยืนยัน'}</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 