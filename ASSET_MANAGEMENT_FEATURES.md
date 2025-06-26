# Asset Management Features

## หน้าหลัก
**URL**: `http://localhost:3000/staff/Edit-Asset`
**ไฟล์**: `public/web_pro/staff/stf-addeditdelete.html`

## ฟีเจอร์ที่ใช้งานได้

### 🎨 **UI/UX Features**
- **Modern Design** - ใช้ Bootstrap 5 และ custom CSS
- **Dark Mode** - สลับระหว่าง light/dark theme
- **Responsive Design** - รองรับทุกขนาดหน้าจอ
- **Animations** - fade-in, hover effects, smooth transitions
- **Loading Overlay** - แสดงเมื่อโหลดหน้า

### 📊 **Asset Management**
- **View Assets** - แสดงรายการ assets ทั้งหมดในตาราง
- **Add Asset** - เพิ่ม asset ใหม่ผ่าน modal form
- **Edit Asset** - แก้ไขข้อมูล asset ที่มีอยู่
- **Delete Asset** - ลบ asset พร้อม confirmation
- **Toggle Status** - เปลี่ยนสถานะ Available/Disabled ด้วย switch

### 🔍 **Search & Filter**
- **Real-time Search** - ค้นหา assets ในตาราง
- **Status Filtering** - กรองตามสถานะ (Available, Disabled, Borrowing, Pending)

### 🖼️ **Image Management**
- **Image Upload** - อัพโหลดรูปภาพสำหรับ asset
- **Image Preview** - แสดงตัวอย่างรูปภาพก่อนบันทึก
- **Default Image** - แสดง logo เมื่อไม่มีรูปภาพ
- **File Size Validation** - จำกัดขนาดไฟล์ไม่เกิน 2MB

### 📝 **Asset Type Management**
- **View Types** - แสดงรายการ asset types ใน dropdown
- **Add Type** - เพิ่ม asset type ใหม่
- **Type Validation** - ตรวจสอบ asset type ก่อนบันทึก

### 👤 **User Management**
- **Profile Menu** - แสดงข้อมูลผู้ใช้จาก localStorage
- **Logout** - ออกจากระบบและล้าง localStorage
- **User Info Display** - แสดง username และ userid

### 🔧 **Enhanced Features (จาก test.html)**
- **Better Error Handling** - การจัดการ error ที่ดีขึ้น
- **Form Validation** - ตรวจสอบข้อมูลที่ครบถ้วน
- **Form Reset** - ล้างฟอร์มเมื่อปิด modal
- **File Size Limit** - จำกัดขนาดไฟล์รูปภาพ
- **Improved Search** - ค้นหาจาก API แทนการ filter ในตาราง
- **Enhanced UI** - ปรับปรุง UI ให้เหมือน test.html

## API Endpoints ที่ใช้

### Asset Management
- `GET /api/assets` - ดึงข้อมูล assets ทั้งหมด
- `POST /api/assets` - เพิ่ม asset ใหม่
- `PUT /api/assets/:id` - แก้ไข asset
- `DELETE /api/assets/:id` - ลบ asset
- `PUT /api/assets/toggle-status/:id` - เปลี่ยนสถานะ asset

### Asset Type Management
- `GET /api/assets/types` - ดึงข้อมูล asset types
- `POST /api/assets/types` - เพิ่ม asset type ใหม่
- `PUT /api/assets/types/:id` - แก้ไข asset type
- `DELETE /api/assets/types/:id` - ลบ asset type

## Database Integration

### ตารางที่ใช้
- **Asset** - เก็บข้อมูล assets
- **asset_type** - เก็บข้อมูลประเภท assets

### Fields ที่ใช้
```sql
Asset:
- Assetid (Primary Key)
- Assetname
- Assetdetail
- Assetcode
- Assetlocation
- Assetimg
- Staffaddid
- Assetstatus
- Assettype
- created_at
- updated_at

asset_type:
- asset_type_id (Primary Key)
- asset_type_name
- created_at
- updated_at
```

## การทำงานของฟีเจอร์

### 1. การแสดงข้อมูล Assets
```javascript
function getAssets() {
    fetch('/api/assets')
        .then(response => response.json())
        .then(data => {
            displayAssets(data);
        })
        .catch(err => console.error(err));
}
```

### 2. การเพิ่ม Asset ใหม่
```javascript
function addAsset() {
    action = 'add';
    formAsset.reset();
    document.querySelector('h4.modal-title').innerText = 'Add New Asset';
    assetModal.show();
}
```

### 3. การแก้ไข Asset
```javascript
function editAsset(asset) {
    action = 'edit';
    editID = asset.Assetid;
    document.querySelector('h4.modal-title').innerText = 'Edit Asset';
    // Fill form with asset data
    // Show image preview
    assetModal.show();
}
```

### 4. การเปลี่ยนสถานะ
```javascript
function toggleAssetStatus(assetId, isChecked) {
    const newStatus = isChecked ? 'Available' : 'Disabled';
    fetch(`/api/assets/toggle-status/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus })
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire('Success', 'Asset status updated successfully', 'success');
        getAssets();
    });
}
```

### 5. การค้นหา
```javascript
function searchAssets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    fetch('/api/assets')
        .then(response => response.json())
        .then(data => {
            const filteredAssets = data.filter(asset => 
                asset.Assetname.toLowerCase().includes(searchTerm)
            );
            displayAssets(filteredAssets);
        })
        .catch(err => console.error(err));
}
```

### 6. การตรวจสอบขนาดไฟล์
```javascript
function previewImage(event) {
    const input = event.target;
    const file = input.files[0];

    if (file) {
        if (file.size > 2 * 1024 * 1024) { // จำกัดขนาดที่ 2MB
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'File size exceeds 2MB. Please upload a smaller file.'
            });
            input.value = '';
            return;
        }
        // Process image preview
    }
}
```

### 7. การล้างฟอร์ม
```javascript
function resetForm() {
    const formAsset = document.getElementById('formAsset');
    const imagePreview = document.getElementById('imagePreview');

    formAsset.reset();
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    action = 'add';
    editID = 0;
}
```

## การทดสอบ

### ✅ API Endpoints
- `GET /api/assets` - ทำงานได้ ✅
- `GET /api/assets/types` - ทำงานได้ ✅
- `POST /api/assets/types` - ทำงานได้ ✅
- `PUT /api/assets/toggle-status/:id` - ทำงานได้ ✅
- `DELETE /api/assets/types/:id` - ทำงานได้ ✅

### ✅ Frontend Features
- Asset List Display - ทำงานได้ ✅
- Add Asset Modal - ทำงานได้ ✅
- Edit Asset Modal - ทำงานได้ ✅
- Delete Asset - ทำงานได้ ✅
- Toggle Status - ทำงานได้ ✅
- Search Function - ทำงานได้ ✅
- Image Upload - ทำงานได้ ✅
- Asset Type Management - ทำงานได้ ✅
- Dark Mode Toggle - ทำงานได้ ✅
- Responsive Design - ทำงานได้ ✅
- File Size Validation - ทำงานได้ ✅
- Form Reset - ทำงานได้ ✅
- Enhanced Error Handling - ทำงานได้ ✅

### ✅ Database Integration
- MySQL Connection - ทำงานได้ ✅
- Asset CRUD Operations - ทำงานได้ ✅
- Asset Type CRUD Operations - ทำงานได้ ✅
- File Upload - ทำงานได้ ✅

## ไฟล์ที่เกี่ยวข้อง

### Frontend
- `public/web_pro/staff/stf-addeditdelete.html` - หน้าหลัก
- `public/css/dashboard-styles.css` - styles สำหรับ dashboard
- `public/css/Admin/AddEdit.css` - styles สำหรับ asset management

### Backend
- `routes/asset.routes.js` - asset routes
- `controllers/asset.controller.js` - asset controller
- `services/asset.service.js` - asset service
- `models/asset.model.js` - asset model

### Database
- `config/db.js` - database configuration

## หมายเหตุ
- หน้า Asset Management ใช้ design แบบใหม่ที่มี dark mode และ animations
- เชื่อมต่อกับ database MySQL ได้ปกติ
- รองรับการอัพโหลดรูปภาพไปยัง `public/Addimg/`
- มีการ validate ข้อมูลก่อนบันทึก
- ใช้ SweetAlert2 สำหรับ notifications
- รองรับการใช้งานบน mobile devices
- **อัปเดตล่าสุด**: เพิ่มฟีเจอร์จาก test.html ครบถ้วนแล้ว 