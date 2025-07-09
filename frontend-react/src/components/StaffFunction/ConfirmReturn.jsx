import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ConfirmReturn() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState({ open: false, req: null, comment: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [approveModal, setApproveModal] = useState({ open: false, req: null });

  // โหลดรายการรออนุมัติคืน
  const fetchRequests = () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    axios.get('/api/borrow/return-pending', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => setRequests(res.data))
      .catch(() => setError('เกิดข้อผิดพลาดในการโหลดข้อมูล'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, [user]);

  // ยืนยันการคืน
  const handleApprove = async () => {
    if (!approveModal.req) return;
    setActionLoading(true);
    setSuccessMsg('');
    try {
      await axios.post(`/api/borrow/confirm-return/${approveModal.req.Reqid}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSuccessMsg('ยืนยันการคืนเรียบร้อย');
      setApproveModal({ open: false, req: null });
      fetchRequests();
    } catch {
      setError('เกิดข้อผิดพลาดในการยืนยันการคืน');
    } finally {
      setActionLoading(false);
    }
  };

  // ปฏิเสธการคืน
  const handleReject = async () => {
    if (!rejectModal.req) return;
    setActionLoading(true);
    setSuccessMsg('');
    try {
      await axios.post(`/api/borrow/reject-return/${rejectModal.req.Reqid}`, { Comment: rejectModal.comment }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSuccessMsg('ปฏิเสธการคืนเรียบร้อย');
      setRejectModal({ open: false, req: null, comment: '' });
      fetchRequests();
    } catch {
      setError('เกิดข้อผิดพลาดในการปฏิเสธ');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg max-w-4xl mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4 text-mfu-red">ยืนยันการคืน</h2>
      {successMsg && <div className="mb-2 text-green-700 font-semibold">{successMsg}</div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : requests.length === 0 ? (
        <div className="text-gray-500">ไม่มีรายการที่รอการยืนยันคืน</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-mfu-gold text-mfu-red">
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">ผู้ยืม</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">อุปกรณ์</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">วันที่ยืม</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">วันที่คืน</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">กิจกรรม</th>
                <th className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider">ประเภท</th>
                <th className="px-4 py-2 text-center text-sm font-semibold uppercase tracking-wider rounded-tr-lg">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.Reqid} className="hover:bg-mfu-gold/10 transition">
                  <td className="px-4 py-2 border-b">{req.Borrowname}</td>
                  <td className="px-4 py-2 border-b">{req.Assetname || req.Assetid}</td>
                  <td className="px-4 py-2 border-b">{req.Borrowdate ? new Date(req.Borrowdate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 border-b">{req.ReturnDate ? new Date(req.ReturnDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 border-b">{req.Activity || '-'}</td>
                  <td className="px-4 py-2 border-b">{req.UsageType || '-'}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="bg-green-100 text-green-800 font-bold py-2 px-6 rounded-full shadow-none mr-2 text-lg hover:bg-green-200 transition disabled:opacity-60"
                      onClick={() => setApproveModal({ open: true, req })}
                      disabled={actionLoading}
                    >ยืนยัน</button>
                    <button
                      className="bg-red-100 text-red-700 font-bold py-2 px-6 rounded-full shadow-none text-lg hover:bg-red-200 transition disabled:opacity-60"
                      onClick={() => setRejectModal({ open: true, req, comment: '' })}
                      disabled={actionLoading}
                    >ปฏิเสธ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal ยืนยัน */}
      {approveModal.open && approveModal.req && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl" onClick={() => setApproveModal({ open: false, req: null })}>&times;</button>
            <h3 className="text-lg font-bold mb-2 text-green-800">ยืนยันการคืน</h3>
            <div className="mb-4">คุณต้องการยืนยันการคืนของ <b>{approveModal.req.Borrowname}</b> สำหรับอุปกรณ์ <b>{approveModal.req.Assetname || approveModal.req.Assetid}</b> ใช่หรือไม่?</div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setApproveModal({ open: false, req: null })}
                disabled={actionLoading}
              >ยกเลิก</button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleApprove}
                disabled={actionLoading}
              >{actionLoading ? 'กำลังยืนยัน...' : 'ยืนยัน'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal ปฏิเสธ */}
      {rejectModal.open && rejectModal.req && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl" onClick={() => setRejectModal({ open: false, req: null, comment: '' })}>&times;</button>
            <h3 className="text-lg font-bold mb-2 text-mfu-red">ปฏิเสธการคืน</h3>
            <div className="mb-2">กรุณาเลือกเหตุผล:</div>
            <div className="flex flex-col gap-3 mb-3">
              <button
                className={`w-full px-4 py-2 rounded font-semibold border ${rejectModal.comment === 'อุปกรณ์ไม่ครบ' ? 'bg-mfu-red text-white' : 'bg-gray-100 text-mfu-red'} hover:bg-mfu-red/80 hover:text-white`}
                onClick={() => setRejectModal(m => ({ ...m, comment: 'อุปกรณ์ไม่ครบ' }))}
                disabled={actionLoading}
              >อุปกรณ์ไม่ครบ</button>
              <button
                className={`w-full px-4 py-2 rounded font-semibold border ${rejectModal.comment === 'อุปกรณ์เสียหาย' ? 'bg-mfu-red text-white' : 'bg-gray-100 text-mfu-red'} hover:bg-mfu-red/80 hover:text-white`}
                onClick={() => setRejectModal(m => ({ ...m, comment: 'อุปกรณ์เสียหาย' }))}
                disabled={actionLoading}
              >อุปกรณ์เสียหาย</button>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setRejectModal({ open: false, req: null, comment: '' })}
                disabled={actionLoading}
              >ยกเลิก</button>
              <button
                className="px-4 py-2 bg-mfu-red text-white rounded hover:bg-mfu-gold"
                onClick={handleReject}
                disabled={actionLoading || !rejectModal.comment}
              >{actionLoading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 