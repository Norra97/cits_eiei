import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Papa from 'papaparse';

export default function ManageItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({ Assetname: '', Assetdetail: '', Assetstatus: '', Assettype: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ Assetname: '', Assetdetail: '', Assetstatus: 'Available', Assettype: '' });
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState('');
  // CSV import state
  const [showImport, setShowImport] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [importing, setImporting] = useState(false);
  const [assetTypes, setAssetTypes] = useState([]);
  const [addImage, setAddImage] = useState(null);

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    fetch('http://localhost:3001/api/equipment', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Fetch asset types
    fetch('http://localhost:3001/api/equipment/asset-types', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(types => setAssetTypes(types))
      .catch(() => setAssetTypes([]));
  }, [user]);

  // ฟิลเตอร์ข้อมูลตาม search
  const filteredItems = items.filter(i => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (i.Assetid && i.Assetid.toString().toLowerCase().includes(q)) ||
      (i.Assetname && i.Assetname.toLowerCase().includes(q))
    );
  });

  // ฟังก์ชัน toggle expand
  const toggleExpand = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  // เมื่อเลือก item ให้ set form
  useEffect(() => {
    if (selectedItem) {
      setForm({
        Assetname: selectedItem.Assetname || '',
        Assetdetail: selectedItem.Assetdetail || '',
        Assetstatus: selectedItem.Assetstatus || '',
        Assettype: selectedItem.Assettype || '',
      });
      setError('');
    }
  }, [selectedItem]);

  // ฟังก์ชันบันทึก
  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/equipment/${selectedItem.Assetid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('แก้ไขไม่สำเร็จ');
      setSelectedItem(null);
      // รีเฟรชข้อมูล
      setLoading(true);
      fetch('http://localhost:3001/api/equipment', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } catch (e) {
      setError('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  // CSV import handlers
  const handleCsvFile = e => {
    setCsvError('');
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        if (!results.data || !Array.isArray(results.data) || results.data.length === 0) {
          setCsvError('ไม่พบข้อมูลในไฟล์');
          setCsvRows([]);
        } else {
          setCsvRows(results.data);
        }
      },
      error: err => setCsvError('อ่านไฟล์ผิดพลาด: ' + err.message)
    });
  };

  const handleImport = async () => {
    setImporting(true);
    setCsvError('');
    try {
      const res = await fetch('http://localhost:3001/api/equipment/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ items: csvRows }),
      });
      if (!res.ok) throw new Error('นำเข้าไม่สำเร็จ');
      setShowImport(false);
      setCsvRows([]);
      setLoading(true);
      fetch('http://localhost:3001/api/equipment', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => res.json())
        .then(data => { setItems(data); setLoading(false); })
        .catch(() => setLoading(false));
    } catch (e) {
      setCsvError('เกิดข้อผิดพลาดในการนำเข้า');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">จัดการอุปกรณ์</h2>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full max-w-xs focus:ring-2 focus:ring-mfu-gold outline-none"
          placeholder="ค้นหาชื่อหรือรหัสอุปกรณ์..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-mfu-gold text-white px-4 py-2 rounded font-semibold hover:opacity-90 transition text-sm"
            onClick={() => setShowAdd(true)}
          >
            + เพิ่มอุปกรณ์
          </button>
          <button
            className="bg-gray-200 text-mfu-gold px-4 py-2 rounded font-semibold hover:bg-mfu-gold/20 transition text-sm border border-mfu-gold"
            onClick={() => setShowImport(true)}
          >
            นำเข้า CSV
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-400 animate-pulse">กำลังโหลด...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm text-sm border border-gray-100">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">รหัส</th>
                <th className="py-3 px-4 text-left font-semibold">ชื่ออุปกรณ์</th>
                <th className="py-3 px-4 text-left font-semibold">สถานะ</th>
                <th className="py-3 px-4 text-left font-semibold">รายละเอียด</th>
                <th className="py-3 px-4 text-center font-semibold">แก้ไข</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(i => {
                const detail = i.Assetdetail || '-';
                const isLong = detail.length > 50;
                const isExpanded = expanded[i.Assetid];
                return (
                  <tr key={i.Assetid} className="border-b last:border-0 hover:bg-mfu-gold/10 transition cursor-pointer">
                    <td className="py-2.5 px-4 text-gray-800">{i.Assetid}</td>
                    <td className="py-2.5 px-4 text-gray-800">{i.Assetname}</td>
                    <td className="py-2.5 px-4 text-gray-700">{i.Assetstatus}</td>
                    <td className="py-2.5 px-4 text-gray-600" onClick={e => e.stopPropagation()}>
                      {isLong && !isExpanded ? (
                        <>
                          {detail.slice(0, 50)}...
                          <button className="ml-2 text-mfu-gold underline text-xs" onClick={() => toggleExpand(i.Assetid)}>ดูเพิ่มเติม</button>
                        </>
                      ) : isLong && isExpanded ? (
                        <>
                          {detail}
                          <button className="ml-2 text-mfu-gold underline text-xs" onClick={() => toggleExpand(i.Assetid)}>ย่อ</button>
                        </>
                      ) : (
                        detail
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button className="bg-mfu-gold text-white px-3 py-1 rounded font-semibold hover:opacity-90 text-xs" onClick={() => setSelectedItem(i)}>
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400 py-6">ไม่พบข้อมูลอุปกรณ์</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal ฟอร์มแก้ไข */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={e => {
          if (e.target === e.currentTarget) setSelectedItem(null);
        }}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-3xl font-extrabold" onClick={() => setSelectedItem(null)}>&times;</button>
            <h3 className="text-lg font-bold mb-4">แก้ไขข้อมูลอุปกรณ์</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">ชื่ออุปกรณ์</label>
                <input className="w-full border rounded px-3 py-2" value={form.Assetname} onChange={e => setForm(f => ({ ...f, Assetname: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">รายละเอียด</label>
                <textarea className="w-full border rounded px-3 py-2" value={form.Assetdetail} onChange={e => setForm(f => ({ ...f, Assetdetail: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">สถานะ</label>
                <select className="w-full border rounded px-3 py-2" value={form.Assetstatus} onChange={e => setForm(f => ({ ...f, Assetstatus: e.target.value }))}>
                  <option value="Available">Available</option>
                  <option value="Borrowing">Borrowing</option>
                  <option value="Broken">Broken</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">ประเภท</label>
                <select className="w-full border rounded px-3 py-2" value={form.Assettype} onChange={e => setForm(f => ({ ...f, Assettype: e.target.value }))}>
                  <option value="">-- เลือกประเภท --</option>
                  {assetTypes.map(type => (
                    <option key={type.asset_type_id} value={type.asset_type_name}>{type.asset_type_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">รูปภาพ</label>
                <input type="file" accept="image/*" className="w-full" onChange={e => setForm(f => ({ ...f, Assetimg: e.target.files[0] }))} />
              </div>
            </div>
            <button className="w-full bg-mfu-gold text-white py-2 rounded font-semibold mt-4 hover:opacity-90 disabled:opacity-60" onClick={async () => {
              setSaving(true); setError('');
              try {
                let body;
                let isFormData = !!form.Assetimg;
                if (isFormData) {
                  body = new FormData();
                  body.append('Assetname', form.Assetname);
                  body.append('Assetdetail', form.Assetdetail);
                  body.append('Assetstatus', form.Assetstatus);
                  body.append('Assettype', form.Assettype);
                  body.append('Assetimg', form.Assetimg);
                } else {
                  body = JSON.stringify(form);
                }
                const res = await fetch(`http://localhost:3001/api/equipment/${selectedItem.Assetid}`, {
                  method: 'PUT',
                  headers: isFormData ? { Authorization: `Bearer ${user.token}` } : {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                  },
                  body
                });
                if (!res.ok) throw new Error('แก้ไขไม่สำเร็จ');
                setSelectedItem(null);
                setLoading(true);
                fetch('http://localhost:3001/api/equipment', {
                  headers: { Authorization: `Bearer ${user.token}` },
                })
                  .then(res => res.json())
                  .then(data => { setItems(data); setLoading(false); })
                  .catch(() => setLoading(false));
              } catch (e) {
                setError('เกิดข้อผิดพลาดในการบันทึก');
              } finally {
                setSaving(false);
              }
            }} disabled={saving}>{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </div>
      )}

      {/* Modal ฟอร์มเพิ่มอุปกรณ์ */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={e => {
          if (e.target === e.currentTarget) setShowAdd(false);
        }}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-3xl font-extrabold" onClick={() => setShowAdd(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-4">เพิ่มอุปกรณ์ใหม่</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">ชื่ออุปกรณ์</label>
                <input className="w-full border rounded px-3 py-2" value={addForm.Assetname} onChange={e => setAddForm(f => ({ ...f, Assetname: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">รายละเอียด</label>
                <textarea className="w-full border rounded px-3 py-2" value={addForm.Assetdetail} onChange={e => setAddForm(f => ({ ...f, Assetdetail: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">สถานะ</label>
                <select className="w-full border rounded px-3 py-2" value={addForm.Assetstatus} onChange={e => setAddForm(f => ({ ...f, Assetstatus: e.target.value }))}>
                  <option value="Available">Available</option>
                  <option value="Borrowing">Borrowing</option>
                  <option value="Broken">Broken</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">ประเภท</label>
                <select className="w-full border rounded px-3 py-2" value={addForm.Assettype} onChange={e => setAddForm(f => ({ ...f, Assettype: e.target.value }))}>
                  <option value="">-- เลือกประเภท --</option>
                  {assetTypes.map(type => (
                    <option key={type.asset_type_id} value={type.asset_type_name}>{type.asset_type_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">รูปภาพ</label>
                <input type="file" accept="image/*" className="w-full" onChange={e => setAddImage(e.target.files[0])} />
              </div>
            </div>
            <button className="w-full bg-mfu-gold text-white py-2 rounded font-semibold mt-4 hover:opacity-90 disabled:opacity-60" onClick={async () => {
              setAddSaving(true); setAddError('');
              try {
                const formData = new FormData();
                formData.append('Assetname', addForm.Assetname);
                formData.append('Assetdetail', addForm.Assetdetail);
                formData.append('Assetstatus', addForm.Assetstatus);
                formData.append('Assettype', addForm.Assettype);
                if (addImage) formData.append('Assetimg', addImage);
                // เพิ่ม field อื่น ๆ ตามต้องการ
                const res = await fetch('http://localhost:3001/api/equipment', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${user.token}`
                  },
                  body: formData
                });
                if (!res.ok) throw new Error('เพิ่มอุปกรณ์ไม่สำเร็จ');
                setShowAdd(false);
                setAddForm({ Assetname: '', Assetdetail: '', Assetstatus: 'Available', Assettype: '' });
                setAddImage(null);
                setLoading(true);
                fetch('http://localhost:3001/api/equipment', {
                  headers: { Authorization: `Bearer ${user.token}` },
                })
                  .then(res => res.json())
                  .then(data => { setItems(data); setLoading(false); })
                  .catch(() => setLoading(false));
              } catch (e) {
                setAddError('เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์');
              } finally {
                setAddSaving(false);
              }
            }} disabled={addSaving}>บันทึก</button>
          </div>
        </div>
      )}

      {/* Modal ฟอร์มนำเข้า CSV */}
      {showImport && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl" onClick={() => { setShowImport(false); setCsvRows([]); setCsvError(''); }}>&times;</button>
            <h3 className="text-lg font-bold mb-4">นำเข้าอุปกรณ์จากไฟล์ CSV</h3>
            <input type="file" accept=".csv" onChange={handleCsvFile} className="mb-3" />
            {csvError && <div className="text-red-500 text-sm mb-2">{csvError}</div>}
            {csvRows.length > 0 && (
              <div className="mb-3 max-h-48 overflow-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {Object.keys(csvRows[0]).map(h => <th key={h} className="px-2 py-1 text-left font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        {Object.keys(csvRows[0]).map(h => <td key={h} className="px-2 py-1">{row[h]}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              className="w-full bg-mfu-gold text-white py-2 rounded font-semibold mt-2 hover:opacity-90 disabled:opacity-60"
              onClick={handleImport}
              disabled={importing || csvRows.length === 0}
            >
              {importing ? 'กำลังนำเข้า...' : 'นำเข้าข้อมูล'}
            </button>
            <div className="text-xs text-gray-500 mt-3">* ตัวอย่าง header: Assetname, Assetdetail, Assetstatus, Assettype</div>
          </div>
        </div>
      )}
    </div>
  );
} 