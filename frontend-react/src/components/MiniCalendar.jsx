import React, { useState } from "react";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, ...
}

export default function MiniCalendar({ dueDates = [] }) {
  const today = new Date();
  const [year] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // dueDates: array of string 'YYYY-MM-DD'
  const dueSet = new Set(dueDates);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // สร้าง array ตารางวัน
  const weeks = [];
  let week = [];
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  // ฟังก์ชันเปลี่ยนเดือน (เฉพาะในปีเดียวกัน)
  const changeMonth = (delta) => {
    let newMonth = month + delta;
    if (newMonth < 0) newMonth = 11;
    if (newMonth > 11) newMonth = 0;
    setMonth(newMonth);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-[500px] mx-auto">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => changeMonth(-1)} className="text-red-600 text-2xl px-2">&#60;</button>
        <div className="font-bold text-xl select-none">
          {monthNames[month]} {year}
        </div>
        <button onClick={() => changeMonth(1)} className="text-red-600 text-2xl px-2">&#62;</button>
      </div>
      <table className="w-full text-center">
        <thead>
          <tr className="text-gray-500">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
              <th key={d} className="py-1">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((d, j) => {
                const dateStr = d
                  ? `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
                  : "";
                const isDue = dueSet.has(dateStr);
                return (
                  <td key={j} className="py-1">
                    {d ? (
                      <span className={
                        isDue
                          ? "text-red-500 font-bold"
                          : ""
                      }>
                        {d}
                      </span>
                    ) : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-xs text-gray-500 text-center">
        * วันที่เป็นสีแดงคือวันครบกำหนดคืนอุปกรณ์
      </div>
    </div>
  );
} 