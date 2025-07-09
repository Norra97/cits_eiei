// -----------------------------
// AnnouncementBar: แถบประกาศข่าวสาร
// -----------------------------
import React from 'react';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-mfu-gold text-mfu-red py-4 px-6 rounded-xl shadow-lg mb-6 flex items-center gap-3 text-lg font-semibold animate-fade-in">
      <svg className="w-7 h-7 mr-2 text-mfu-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
      <span>ประกาศ: ระบบจะปิดปรับปรุงวันอาทิตย์นี้ 22:00-23:00 น. กรุณาดำเนินการให้เสร็จก่อนเวลาดังกล่าว</span>
    </div>
  );
} 