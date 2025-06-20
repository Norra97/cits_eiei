function logout() {
    localStorage.clear(); // ล้างข้อมูลใน localStorage
    window.location.href = "/"; // เปลี่ยนเส้นทางไปยังหน้า "/"
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return dateString.split('T')[0];
}
