# Shared Components System

ระบบนี้ใช้สำหรับจัดการ navbar และ sidebar ที่ใช้ร่วมกันในทุกหน้า โดยมีขนาด สี และฟังก์ชันที่เหมือนกัน

## โครงสร้างไฟล์

```
public/
├── css/
│   └── shared-components.css          # CSS สำหรับ navbar และ sidebar
├── js/
│   ├── shared-components.js           # JavaScript functions ที่ใช้ร่วมกัน
│   └── template-loader.js             # โหลด template และจัดการ active state
└── templates/
    ├── shared-navbar.html             # Template navbar ที่ใช้ร่วมกัน
    ├── staff-sidebar.html             # Template sidebar สำหรับ staff
    ├── lecturer-sidebar.html          # Template sidebar สำหรับ lecturer
    └── student-sidebar.html           # Template sidebar สำหรับ student
```

## วิธีการใช้งาน

### 1. เพิ่ม CSS และ JavaScript ในหน้า HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="/public/css/bootstrap.min.css">
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    
    <!-- Shared Components CSS -->
    <link rel="stylesheet" href="/public/css/shared-components.css">
    
    <!-- Your page specific CSS -->
    <link rel="stylesheet" href="/public/css/your-page.css">
</head>
<body>
    <!-- Main Container -->
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <!-- Sidebar Container (จะถูกเติมโดย template loader) -->
            <div class="sidebar-container"></div>
            
            <!-- Main Content -->
            <div class="col">
                <div class="main-content">
                    <!-- Your page content here -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="/public/js/bootstrap.bundle.min.js"></script>
    
    <!-- Shared Components JS -->
    <script src="/public/js/shared-components.js"></script>
    <script src="/public/js/template-loader.js"></script>
    
    <!-- Your page specific JS -->
    <script src="/public/js/your-page.js"></script>
</body>
</html>
```

### 2. ฟีเจอร์ที่รวมอยู่

#### Navbar Features:
- Logo และชื่อระบบ
- Search bar
- Dark mode toggle
- Notification bell
- Profile menu
- Responsive design

#### Sidebar Features:
- Menu items ตามประเภทผู้ใช้
- Active state สำหรับหน้าปัจจุบัน
- Hover effects และ animations
- Responsive design

#### Shared Functions:
- Theme management (light/dark mode)
- Profile menu toggle
- Search functionality
- User info loading
- Logout function

### 3. การปรับแต่ง

#### เพิ่ม CSS Variables:
```css
:root {
    --primary-color: #ff8a65;      /* สีหลัก */
    --secondary-color: #ff6b4a;    /* สีรอง */
    --text-color: #333;            /* สีข้อความ */
    --bg-color: #f7f7f7;          /* สีพื้นหลัง */
    --card-bg: #fff;              /* สีพื้นหลังการ์ด */
    --border-color: #e0e0e0;      /* สีขอบ */
}
```

#### Override Functions:
```javascript
// Override search function สำหรับหน้าของคุณ
window.performSearch = function(searchTerm) {
    // Your custom search logic
    console.log('Custom search:', searchTerm);
};

// Override profile redirect
window.redirectToProfile = function() {
    window.location.href = '/your-profile-page';
};
```

### 4. ประเภทผู้ใช้

ระบบจะตรวจจับประเภทผู้ใช้จาก URL path:

- **Staff**: `/staff/*`
- **Lecturer**: `/lecturer/*`
- **Student**: `/student/*`

### 5. Responsive Design

ระบบรองรับ responsive design:
- **Desktop**: แสดง navbar และ sidebar ปกติ
- **Tablet (≤768px)**: ลดขนาด navbar และ sidebar
- **Mobile (≤576px)**: ลดขนาดลงอีกและปรับ layout

### 6. Dark Mode

ระบบรองรับ dark mode:
- เปลี่ยนสีทั้งหมดตาม theme
- บันทึกการตั้งค่าใน localStorage
- Toggle button ใน navbar

### 7. ตัวอย่างการใช้งาน

#### หน้า Dashboard:
```html
<div class="main-content">
    <div class="stats-row">
        <!-- Statistics cards -->
    </div>
    <div class="widgets-row">
        <!-- Charts and widgets -->
    </div>
</div>
```

#### หน้าตาราง:
```html
<div class="main-content">
    <div class="table-container">
        <table class="table">
            <!-- Table content -->
        </table>
    </div>
</div>
```

## ข้อดี

1. **Consistency**: ทุกหน้ามี navbar และ sidebar ที่เหมือนกัน
2. **Maintainability**: แก้ไขที่เดียวใช้ได้ทุกหน้า
3. **Scalability**: เพิ่มหน้าใหม่ได้ง่าย
4. **Performance**: โหลด CSS และ JS ครั้งเดียว
5. **Responsive**: รองรับทุกขนาดหน้าจอ
6. **Accessibility**: รองรับ keyboard navigation และ screen readers

## การแก้ไขปัญหา

### Navbar ไม่แสดง:
- ตรวจสอบว่าโหลด `shared-components.css` และ `template-loader.js`
- ตรวจสอบ path ของ template files

### Sidebar ไม่แสดง:
- ตรวจสอบว่ามี `<div class="sidebar-container"></div>`
- ตรวจสอบ user type ใน URL path

### Dark mode ไม่ทำงาน:
- ตรวจสอบว่าโหลด `shared-components.js`
- ตรวจสอบ localStorage permissions

### Search ไม่ทำงาน:
- Override `performSearch` function ในหน้าของคุณ
- ตรวจสอบ element IDs ในตาราง 