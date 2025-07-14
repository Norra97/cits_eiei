// -----------------------------
// RequestBorrow: ฟอร์มขอยืมอุปกรณ์
// -----------------------------
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function RequestBorrow() {
  // ดึงข้อมูลผู้ใช้จาก context
  const { user } = useAuth();
  // สถานะต่าง ๆ ของ component
  const [assets, setAssets] = React.useState([]); // รายการอุปกรณ์ทั้งหมด
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false); // สำหรับ modal ฟอร์มขอยืม
  const [selectedAsset, setSelectedAsset] = React.useState(null); // อุปกรณ์ที่เลือก
  const [form, setForm] = React.useState({
    Borrowdate: '',
    ReturnDate: '',
    Activity: '',
    UsageType: ''
  });
  const [submitMsg, setSubmitMsg] = React.useState(''); // ข้อความแจ้งเตือนหลัง submit
  const [submitting, setSubmitting] = React.useState(false); // สถานะกำลังส่งฟอร์ม
  const [showInfoModal, setShowInfoModal] = React.useState(false); // สำหรับ modal ข้อมูลอุปกรณ์
  const [infoAsset, setInfoAsset] = React.useState(null); // อุปกรณ์ที่ดูข้อมูล
  const [dateError, setDateError] = React.useState(''); // ข้อความ error วันที่

  // โหลดรายการอุปกรณ์เมื่อ component mount
  React.useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get('http://localhost:3001/api/equipment', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => setAssets(res.data))
      .catch(err => setError('ไม่สามารถโหลดรายการอุปกรณ์ได้'))
      .finally(() => setLoading(false));
  }, [user]);

  // ฟังก์ชันเปิด modal และรีเซ็ตฟอร์ม
  const openModal = (asset) => {
    setSelectedAsset(asset);
    setForm({ Borrowdate: '', ReturnDate: '', Activity: '', UsageType: '' });
    setSubmitMsg('');
    setShowModal(true);
  };
  // ฟังก์ชันปิด modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedAsset(null);
    setSubmitMsg('');
  };
  // ฟังก์ชันเปิด modal ข้อมูลอุปกรณ์
  const openInfoModal = (asset) => {
    setInfoAsset(asset);
    setShowInfoModal(true);
  };
  // ฟังก์ชันปิด modal ข้อมูลอุปกรณ์
  const closeInfoModal = () => {
    setShowInfoModal(false);
    setInfoAsset(null);
  };
  // handleChange: อัปเดตค่าฟอร์มเมื่อกรอกข้อมูล
  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  // handleSubmit: ส่งคำขอยืมไป backend
  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedAsset) return;
    setDateError('');
    // Validation: ReturnDate must be >= Borrowdate
    if (form.Borrowdate && form.ReturnDate && form.ReturnDate < form.Borrowdate) {
      setDateError('ห้ามคืนก่อนวันที่ยืม');
      return;
    }
    setSubmitting(true);
    setSubmitMsg('');
    try {
      await axios.post('http://localhost:3001/api/borrow/request', {
        Assetid: selectedAsset.Assetid,
        Borrowdate: form.Borrowdate,
        ReturnDate: form.ReturnDate,
        Activity: form.Activity,
        UsageType: form.UsageType
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSubmitMsg('ส่งคำขอยืมสำเร็จ!');
      setTimeout(() => {
        closeModal();
      }, 1200);
    } catch (err) {
      setSubmitMsg('เกิดข้อผิดพลาดในการส่งคำขอยืม');
    } finally {
      setSubmitting(false);
    }
  };

  // แสดงสถานะโหลด/ข้อผิดพลาด
  if (loading) return <div className="p-4">กำลังโหลด...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  // ส่วนแสดงตารางอุปกรณ์และ modal ฟอร์มขอยืม
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-mfu-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6m-6 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v10a4 4 0 004 4h6a4 4 0 004-4z" /></svg>
        เลือกอุปกรณ์ที่ต้องการยืม
      </h2>
      {assets.length === 0 ? (
        <div className="text-gray-500 text-center">ไม่มีอุปกรณ์ให้ยืม</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-mfu-gold text-mfu-red">
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">ชื่ออุปกรณ์</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">รหัส</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">สถานที่</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">ข้อมูลอุปกรณ์</th>
                <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider rounded-tr-lg">ขอยืม</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr
                  key={asset.Assetid}
                  className="hover:bg-mfu-gold/10 transition cursor-pointer"
                >
                  <td className="px-6 py-4 border-b font-medium">{asset.Assetname}</td>
                  <td className="px-6 py-4 border-b">{asset.Assetcode}</td>
                  <td className="px-6 py-4 border-b">{asset.Assetlocation}</td>
                  <td className="px-6 py-4 border-b">{asset.Assetstatus}</td>
                  <td className="px-6 py-4 border-b text-center flex justify-center items-center">
                    <button
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-transparent focus:bg-transparent border-none shadow-none"
                      style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                      onClick={e => { e.stopPropagation(); openInfoModal(asset); }}
                      title="ดูข้อมูลอุปกรณ์"
                    >
                      <svg className="w-5 h-5 text-mfu-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <button className="bg-mfu-red text-white px-4 py-1 rounded hover:bg-mfu-gold hover:text-mfu-red transition font-semibold" disabled={false} onClick={e => { e.stopPropagation(); openModal(asset); }}>
                      ขอยืม
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal */}
      {showModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl" onClick={closeModal}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-mfu-red">ขอยืม: {selectedAsset.Assetname}</h3>
            {selectedAsset.Assetimg && (
              <img
                src={`http://localhost:3001/images/${selectedAsset.Assetimg}`}
                alt={selectedAsset.Assetname}
                style={{ width: '100%', maxHeight: 200, objectFit: 'contain', marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              />
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">วันที่ยืม</label>
                <input type="date" name="Borrowdate" className="w-full border rounded px-3 py-2" value={form.Borrowdate} onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">วันที่คืน</label>
                <input type="date" name="ReturnDate" className="w-full border rounded px-3 py-2" value={form.ReturnDate} onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">กิจกรรม</label>
                <input type="text" name="Activity" className="w-full border rounded px-3 py-2" value={form.Activity} onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">ประเภทการใช้งาน</label>
                <div className="flex gap-6 items-center mt-1">
                  <label className="inline-flex items-center">
                    <input type="radio" name="UsageType" value="In Site" checked={form.UsageType === 'In Site'} onChange={handleChange} className="accent-mfu-red" required />
                    <span className="ml-2">In Site</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="UsageType" value="Out Site" checked={form.UsageType === 'Out Site'} onChange={handleChange} className="accent-mfu-red" required />
                    <span className="ml-2">Out Site</span>
                  </label>
                </div>
              </div>
              {dateError && <div className="text-center text-red-600 font-semibold">{dateError}</div>}
              <button type="submit" className="w-full bg-mfu-red text-white py-2 rounded font-semibold hover:bg-mfu-gold hover:text-mfu-red transition" disabled={submitting}>{submitting ? 'กำลังส่ง...' : 'ยืนยันขอยืม'}</button>
              {submitMsg && <div className="text-center mt-2 text-mfu-red">{submitMsg}</div>}
            </form>
          </div>
        </div>
      )}
      {/* Info Modal */}
      {showInfoModal && infoAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl" onClick={closeInfoModal}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-mfu-red">ข้อมูลอุปกรณ์</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded border">
              <div><b>ชื่ออุปกรณ์:</b> {infoAsset.Assetname}</div>
              <div><b>รหัส:</b> {infoAsset.Assetcode}</div>
              <div><b>สถานที่:</b> {infoAsset.Assetlocation}</div>
              <div><b>สถานะ:</b> {infoAsset.Assetstatus}</div>
              <div><b>รายละเอียด:</b> <div className="whitespace-pre-line inline">{infoAsset.Assetdetail || '-'}</div></div>
            </div>
            <button className="mt-2 px-4 py-2 bg-mfu-red text-white rounded hover:bg-mfu-gold hover:text-mfu-red font-semibold" onClick={closeInfoModal}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
} 