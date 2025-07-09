// -----------------------------
// CalendarBar: แสดงปฏิทินวันที่ต้องคืนอุปกรณ์
// -----------------------------
import React from 'react';
import MiniCalendar from '../MiniCalendar';

export default function CalendarBar({ items }) {
  // รวมวันที่ต้องคืนทั้งหมด (string 'YYYY-MM-DD')
  // ดึงวันที่คืนจาก items ที่รับมา
  const dueDates = items
    .map(item => item.ReturnDate)
    .filter(Boolean)
    .map(date => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
  // ส่งวันที่ไปยัง MiniCalendar
  return (
    <MiniCalendar dueDates={dueDates} />
  );
} 