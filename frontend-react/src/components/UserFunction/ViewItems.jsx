// -----------------------------
// ViewItems: แสดงรายการอุปกรณ์ที่ยืมอยู่
// -----------------------------
import React from 'react';

export default function ViewItems({ items }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-mfu-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6m-6 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v10a4 4 0 004 4h6a4 4 0 004-4z" /></svg>
        รายการที่ยืมอยู่
      </h2>
      {items.length === 0 ? (
        <div className="text-gray-500 bg-white rounded shadow p-6 text-center">ไม่มีรายการที่ยืมอยู่</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-mfu-red text-white">
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">ชื่ออุปกรณ์</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">รหัส</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">วันที่ต้องคืน</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-lg">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.Reqid} className="hover:bg-mfu-gold/10 transition">
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
                  <td className="px-6 py-4 border-b">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-mfu-gold/80 text-mfu-red shadow">ยืม</span>
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