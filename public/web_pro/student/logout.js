function logout() {
    fetch('/logout', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            console.log('Logout response:', data);
            localStorage.clear(); // ล้างข้อมูลใน localStorage
            window.location.href = data.redirect || '/login'; // เปลี่ยนเส้นทางไปยังหน้า login
        })
        .catch(err => {
            alert('Logout failed');
            console.error('Logout error:', err);
            localStorage.clear();
            window.location.href = '/login';
        });
}
