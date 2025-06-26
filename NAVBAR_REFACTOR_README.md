# Navbar และ Sidebar Refactoring Guide

## ปัญหาที่แก้ไข
- Navbar และ Sidebar ถูกเขียนซ้ำๆ ในทุกหน้า ทำให้โค้ดเยอะและยากต่อการบำรุงรักษา
- แต่ละ role (student, staff, lecturer) มี navbar ที่แตกต่างกันเล็กน้อย
- การแก้ไข navbar ต้องแก้ไขในหลายไฟล์

## วิธีแก้ไข

### 1. ระบบ Components แบบ Reusable

#### ไฟล์ที่สร้างขึ้น:
- `public/js/components.js` - JavaScript สำหรับจัดการ Navbar และ Sidebar
- `public/css/components.css` - CSS สำหรับ styling components
- `public/templates/base.html` - Template HTML ฐาน
- `public/js/template-loader.js` - JavaScript สำหรับโหลด template

### 2. การใช้งาน

#### วิธีที่ 1: ใช้ Container Elements (แนะนำ)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="/public/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/Head.css">
    <link rel="stylesheet" href="/public/css/components.css">
    <!-- เพิ่ม CSS เฉพาะของหน้า -->
</head>

<body>
    <!-- Navbar Container -->
    <div id="navbar-container"></div>
    
    <!-- Main Container -->
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <!-- Sidebar Container -->
            <div class="col-auto col-md-3 col-xl-2 px-sm-2">
                <div id="sidebar-container"></div>
            </div>
            
            <!-- Main Content -->
            <div class="col">
                <div class="main-content">
                    <!-- เนื้อหาของหน้า -->
                    <h1>Your Content Here</h1>
                </div>
            </div>
        </div>
    </div>
    
    <!-- JavaScript -->
    <script src="/public/js/bootstrap.min.js"></script>
    <script src="/public/js/components.js"></script>
    <!-- เพิ่ม JavaScript เฉพาะของหน้า -->
</body>
</html>
```

#### วิธีที่ 2: ใช้ Template System
```html
<!-- ใช้ template-loader.js -->
<script>
    // โหลดหน้าใหม่
    templateLoader.navigateTo('page-name', {
        PAGE_TITLE: 'Your Page Title',
        ADDITIONAL_CSS: '<link rel="stylesheet" href="/your-custom.css">',
        MAIN_CONTENT: '<h1>Your Content</h1>',
        ADDITIONAL_SCRIPTS: '<script src="/your-script.js"></script>'
    });
</script>
```

### 3. การกำหนด Role

ระบบจะตรวจจับ role อัตโนมัติจาก URL:
- `/student/*` → Student role
- `/staff/*` → Staff role  
- `/lecturer/*` → Lecturer role

หรือกำหนด role ใน localStorage:
```javascript
localStorage.setItem('role', 'student'); // หรือ 'staff', 'lecturer'
```

### 4. การปรับแต่ง Navbar และ Sidebar

#### ปรับแต่ง Navbar:
แก้ไขใน `public/js/components.js`:
```javascript
// เพิ่ม search bar สำหรับ role ใหม่
getSearchBar() {
    if (this.currentRole === 'student') {
        return ''; // Student ไม่มี search bar
    }
    // เพิ่มเงื่อนไขสำหรับ role ใหม่
    if (this.currentRole === 'new-role') {
        return 'custom search bar HTML';
    }
    // ... existing code
}
```

#### ปรับแต่ง Sidebar:
แก้ไขใน `public/js/components.js`:
```javascript
getSidebarItems() {
    const items = {
        // ... existing roles
        'new-role': [
            { href: '/new-role', icon: 'fa-home', text: 'Home' },
            { href: '/new-role/settings', icon: 'fa-cog', text: 'Settings' }
        ]
    };
    return items[this.currentRole] || items.student;
}
```

### 5. การเพิ่มหน้าใหม่

#### สำหรับหน้าใหม่:
1. สร้างไฟล์ HTML ใหม่
2. ใช้โครงสร้าง container elements
3. เพิ่ม CSS และ JavaScript เฉพาะของหน้า

#### ตัวอย่าง:
```html
<!-- public/web_pro/student/new-page.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page</title>
    
    <link rel="stylesheet" href="/public/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/Head.css">
    <link rel="stylesheet" href="/public/css/components.css">
    <link rel="stylesheet" href="/public/css/User/new-page.css">
</head>

<body>
    <div id="navbar-container"></div>
    
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-auto col-md-3 col-xl-2 px-sm-2">
                <div id="sidebar-container"></div>
            </div>
            
            <div class="col">
                <div class="main-content">
                    <h1>New Page Content</h1>
                    <!-- เนื้อหาของหน้า -->
                </div>
            </div>
        </div>
    </div>
    
    <script src="/public/js/bootstrap.min.js"></script>
    <script src="/public/js/components.js"></script>
    <script src="/public/js/new-page.js"></script>
</body>
</html>
```

### 6. ข้อดีของระบบใหม่

1. **ลดการเขียนโค้ดซ้ำ**: Navbar และ Sidebar ถูกเขียนครั้งเดียว
2. **ง่ายต่อการบำรุงรักษา**: แก้ไขที่เดียว ใช้ได้ทุกหน้า
3. **รองรับ Role ต่างๆ**: แต่ละ role มี navbar และ sidebar ที่เหมาะสม
4. **Responsive**: รองรับการแสดงผลบนมือถือ
5. **Performance**: โหลดเร็วขึ้นเพราะไม่ต้องโหลดโค้ดซ้ำ

### 7. การ Migration

#### ขั้นตอนการย้ายหน้าเก่า:
1. เปิดไฟล์ HTML เก่า
2. ลบส่วน navbar และ sidebar ออก
3. เพิ่ม container elements
4. เพิ่ม script components.js
5. ทดสอบการทำงาน

#### ตัวอย่างการย้าย:
```html
<!-- เก่า -->
<nav class="navbar navbar-light bg-white border-bottom fixed-top">
    <!-- navbar code -->
</nav>
<div class="sidebar">
    <!-- sidebar code -->
</div>

<!-- ใหม่ -->
<div id="navbar-container"></div>
<div id="sidebar-container"></div>
```

### 8. การแก้ไขปัญหา

#### ถ้า Navbar ไม่แสดง:
1. ตรวจสอบว่าโหลด `components.js` แล้ว
2. ตรวจสอบว่ามี element `#navbar-container`
3. ตรวจสอบ console errors

#### ถ้า Sidebar ไม่แสดง:
1. ตรวจสอบว่ามี element `#sidebar-container`
2. ตรวจสอบ role detection
3. ตรวจสอบ URL path

### 9. การเพิ่มฟีเจอร์ใหม่

#### เพิ่ม Notification:
```javascript
// เพิ่มใน components.js
getProfileDropdown() {
    return `
        <div class="dropdown">
            <div class="d-flex align-items-center">
                <button class="btn-noti mx-3" onclick="showNotifications()">
                    <i class="fa fa-bell fa-lg"></i>
                    <span class="badge badge-danger">3</span>
                </button>
                <!-- ... existing code -->
            </div>
        </div>
    `;
}
```

#### เพิ่ม Theme Switcher:
```javascript
// เพิ่มใน components.js
generateThemeSwitcher() {
    return `
        <button class="btn btn-outline-secondary" onclick="toggleTheme()">
            <i class="fa fa-moon"></i>
        </button>
    `;
}
```

## สรุป

ระบบใหม่นี้จะช่วยลดการเขียนโค้ดซ้ำและทำให้การบำรุงรักษา Navbar และ Sidebar ง่ายขึ้นมาก โดยยังคงความยืดหยุ่นในการปรับแต่งตาม role และความต้องการของแต่ละหน้า 