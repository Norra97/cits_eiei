# Edit-Asset Page Update

## การเปลี่ยนแปลง

### 1. Route Update
- แก้ไข route `/staff/Edit-Asset` ให้ชี้ไปที่ไฟล์ `stf-addeditdelete.html` แทน `test.html`
- ไฟล์: `routes/static.routes.js`

### 2. New Design Features
หน้า `stf-addeditdelete.html` มีฟีเจอร์ใหม่ดังนี้:

#### 🎨 **Modern UI Design**
- **Navbar** พร้อม logo, search bar, dark mode toggle, และ profile menu
- **Sidebar** ที่มี menu items สำหรับ staff
- **Modern Cards** สำหรับแสดงข้อมูล
- **Responsive Design** ที่รองรับทุกขนาดหน้าจอ

#### 🌙 **Dark Mode**
- **Toggle Button** ใน navbar สำหรับสลับระหว่าง light/dark mode
- **CSS Variables** สำหรับ theme colors
- **Persistent Theme** ที่เก็บการตั้งค่าใน localStorage

#### ✨ **Animations**
- **Fade-in animations** สำหรับ cards และ sidebar
- **Smooth transitions** สำหรับ hover effects
- **Loading animations** เมื่อโหลดหน้า

#### 🔧 **Enhanced Functionality**
- **Asset Management** - เพิ่ม, แก้ไข, ลบ, และ toggle status
- **Search Function** - ค้นหา assets ในตาราง
- **Image Preview** - แสดงตัวอย่างรูปภาพก่อนอัพโหลด
- **Asset Type Management** - เพิ่ม asset type ใหม่
- **Status Badges** - แสดงสถานะด้วยสีที่แตกต่างกัน
- **Form Validation** - ตรวจสอบข้อมูลที่จำเป็น

### 3. API Integration
หน้าใหม่ใช้ API endpoints เดิมที่มีอยู่แล้ว:

#### Asset Management
- `GET /api/assets` - ดึงข้อมูล assets ทั้งหมด
- `POST /api/assets` - เพิ่ม asset ใหม่
- `PUT /api/assets/:id` - แก้ไข asset
- `DELETE /api/assets/:id` - ลบ asset
- `PUT /api/assets/toggle-status/:id` - เปลี่ยนสถานะ asset

#### Asset Type Management
- `GET /api/assets/types` - ดึงข้อมูล asset types
- `POST /api/assets/types` - เพิ่ม asset type ใหม่
- `PUT /api/assets/types/:id` - แก้ไข asset type
- `DELETE /api/assets/types/:id` - ลบ asset type

### 4. Database Integration
- ใช้ database schema เดิม
- รองรับการอัพโหลดรูปภาพไปยัง `public/Addimg/`
- เชื่อมต่อกับตาราง `Asset` และ `asset_type`

### 5. User Management
- **Profile Menu** ที่แสดงข้อมูลผู้ใช้จาก localStorage
- **Logout Function** ที่ล้าง localStorage
- **User Info Display** แสดง username และ userid

## การใช้งาน

### การเข้าถึงหน้า
```
http://localhost:3000/staff/Edit-Asset
```

### ฟีเจอร์หลัก
1. **View Assets** - ดูรายการ assets ทั้งหมด
2. **Add Asset** - เพิ่ม asset ใหม่
3. **Edit Asset** - แก้ไขข้อมูล asset
4. **Delete Asset** - ลบ asset
5. **Toggle Status** - เปลี่ยนสถานะ Available/Disabled
6. **Search Assets** - ค้นหา assets
7. **Add Asset Type** - เพิ่มประเภท asset ใหม่
8. **Dark Mode** - สลับธีม
9. **Profile Management** - จัดการโปรไฟล์ผู้ใช้

### การทำงานของฟีเจอร์
- **Form Validation** - ตรวจสอบข้อมูลที่จำเป็นก่อนบันทึก
- **Image Upload** - รองรับการอัพโหลดรูปภาพ
- **Real-time Search** - ค้นหาแบบ real-time
- **Status Management** - จัดการสถานะ assets
- **Error Handling** - จัดการข้อผิดพลาดด้วย SweetAlert2

## ไฟล์ที่เกี่ยวข้อง
- `public/web_pro/staff/stf-addeditdelete.html` - หน้าใหม่
- `routes/static.routes.js` - route configuration
- `controllers/asset.controller.js` - asset controller
- `services/asset.service.js` - asset service
- `models/asset.model.js` - asset model
- `public/css/dashboard-styles.css` - styles สำหรับ dashboard

## การทดสอบ
- ✅ API endpoints ทำงานปกติ
- ✅ Database connection ใช้งานได้
- ✅ File upload ทำงานได้
- ✅ Form validation ทำงานได้
- ✅ Dark mode ทำงานได้
- ✅ Responsive design ทำงานได้ 