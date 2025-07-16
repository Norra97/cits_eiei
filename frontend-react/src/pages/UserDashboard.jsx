// นำเข้า React และ dependencies ที่จำเป็น
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
// นำเข้า component ที่แยกไฟล์ใหม่
import AnnouncementBar from '../components/UserFunction/AnnouncementBar';
import CalendarBar from '../components/UserFunction/CalendarBar';
import ViewItems from '../components/UserFunction/ViewItems';
import RequestBorrow from '../components/UserFunction/RequestBorrow';
import ReturnItem from '../components/UserFunction/ReturnItem';
import ViewHistory from '../components/UserFunction/ViewHistory';
import UserAccount from './UserAccount';
import UserAccountNew from './UserAccountNew';
import Swal from 'sweetalert2';

// -----------------------------
// links: เมนูนำทางของ user dashboard
// -----------------------------
const links = [
  { to: '', label: 'ดูอุปกรณ์' },
  { to: 'request', label: 'ส่งคำขอยืม' },
  { to: 'return', label: 'แจ้งคืน' },
  { to: 'history', label: 'ดูประวัติ' },
];

// -----------------------------
// UserDashboard: หน้า dashboard หลักของผู้ใช้ (role 1)
// -----------------------------
export default function UserDashboard() {
  // ดึงข้อมูลผู้ใช้และฟังก์ชัน logout จาก context
  const { user, logout } = useAuth();
  // รายการอุปกรณ์ที่ยืมอยู่
  const [items, setItems] = React.useState([]);
  // ใช้สำหรับตรวจสอบ path ปัจจุบัน
  const location = useLocation();
  // ตรวจสอบว่าอยู่หน้า dashboard หลักหรือไม่
  const isMainDashboard = location.pathname === '/user' || location.pathname === '/user/';
  // โหลดรายการที่ยืมอยู่เมื่อ user เปลี่ยน
  React.useEffect(() => {
    if (!user) return;
    axios.get('http://localhost:3001/api/borrow/active', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => setItems(res.data))
      .catch(() => setItems([]));
  }, [user]);
  // ถ้าไม่ได้ login หรือ role ไม่ใช่ user ให้ redirect กลับหน้าแรก
  if (!user || user.role !== 1) return <Navigate to="/" />;
  // หา items ที่ถูก reject (RePending)
  const rejectedItems = items.filter(item => item.Status === 'RePending');

  // แจ้งเตือน popup เมื่อมีรายการถูก reject (RePending) และยังไม่เคยแจ้งเตือนใน session นี้
  React.useEffect(() => {
    if (rejectedItems.length > 0 && !sessionStorage.getItem('rejectedAlertShown')) {
      Swal.fire({
        icon: 'warning',
        title: 'การคืนอุปกรณ์ของคุณถูกปฏิเสธ',
        html: `<ul style='text-align:left;'>${rejectedItems.map(item => `<li><b>${item.Assetname}</b>${item.Comment ? ` <span style='color:#555;'>เหตุผล: ${item.Comment}</span>` : ''}</li>`).join('')}</ul><div style='margin-top:8px;'>กรุณาตรวจสอบและแจ้งคืนใหม่</div>`,
        confirmButtonText: 'OK'
      });
      sessionStorage.setItem('rejectedAlertShown', '1');
    }
  }, [rejectedItems]);
  // โครงสร้าง UI หลัก
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar ด้านบน */}
      <Navbar title="MFU User" links={links} onLogout={logout} />
      <div className="max-w-5xl mx-auto pt-24 px-2">
        {/* แถบประกาศข่าวสาร */}
        <AnnouncementBar />
        {/* แจ้งเตือนพิเศษเมื่อถูก reject */}
        {/* (ยกเลิก alert bar เพราะใช้ popup แทน) */}
        {/* ถ้าอยู่หน้า /user/account ให้แสดง UserAccount ใต้ announcement เลย */}
        {location.pathname === '/user/account' ? (
          <div className="mt-2">
            <UserAccount />
          </div>
        ) : location.pathname === '/user/accountnew' ? (
          <div className="mt-2">
            <UserAccountNew />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* แสดงปฏิทินเฉพาะหน้า dashboard หลัก */}
            {isMainDashboard && (
              <div className="md:w-1/2 w-full">
                <CalendarBar items={items} />
              </div>
            )}
            {/* ส่วนแสดงเนื้อหาตาม route */}
            <div className={isMainDashboard ? "md:w-1/2 w-full" : "w-full"}>
              <Routes>
                <Route path="/" element={<ViewItems items={items} />} />
                <Route path="request" element={<RequestBorrow />} />
                <Route path="return" element={<ReturnItem items={items} />} />
                <Route path="history" element={<ViewHistory />} />
                <Route path="account" element={null} />
                <Route path="accountnew" element={<UserAccountNew />} />
                <Route path="*" element={<Navigate to="." />} />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 