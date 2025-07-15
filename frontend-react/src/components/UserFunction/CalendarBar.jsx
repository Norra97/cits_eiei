// -----------------------------
// CalendarBar: แสดงปฏิทินวันที่ต้องคืนอุปกรณ์
// -----------------------------
import React from 'react';
import MiniCalendar from '../MiniCalendar';

export default function CalendarBar({ items }) {
  // รวมวันที่ต้องคืนทั้งหมด (string 'YYYY-MM-DD') พร้อมชื่อผู้ยืม
  const dueDates = items
    .filter(item => item.ReturnDate)
    .map(item => {
      const d = new Date(item.ReturnDate);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return { date: dateStr, user: item.Borrowname, asset: item.Assetname || item.Assetid };
    });
  // ส่งวันที่ไปยัง MiniCalendar
  return (
    <MiniCalendar dueDates={dueDates} />
  );
} 