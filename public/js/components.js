// Navbar and Sidebar Components
class NavigationComponents {
    constructor() {
        this.currentRole = this.getCurrentRole();
        this.userInfo = this.getUserInfo();
    }

    // Get current role from URL or localStorage
    getCurrentRole() {
        const path = window.location.pathname;
        if (path.includes('/student')) return 'student';
        if (path.includes('/staff')) return 'staff';
        if (path.includes('/lecturer')) return 'lecturer';
        return 'student'; // default
    }

    // Get user info from localStorage
    getUserInfo() {
        return {
            username: localStorage.getItem('username') || 'Guest',
            userid: localStorage.getItem('userid') || 'ID'
        };
    }

    // Generate navbar HTML based on role
    generateNavbar() {
        const baseNavbar = `
            <nav class="navbar navbar-light bg-white border-bottom fixed-top">
                <div class="container-fluid">
                    <a class="navbar-brand d-flex align-items-center" href="#">
                        <img class="logo" src="/public/img/logo.png" alt="Logo">
                        <div class="col-logo text-center">
                            <div class="row">
                                <span class="ms-2" style="font-weight: bold;">Equipment Borrowing and Returning System</span>
                            </div>
                            <div class="row">
                                <span class="ms-2" style="font-size: medium; color: #806850; font-weight: bold;">MAE FAH LUANG UNIVERSITY</span>
                            </div>
                        </div>
                    </a>
                    ${this.getSearchBar()}
                    ${this.getProfileDropdown()}
                </div>
            </nav>
        `;
        return baseNavbar;
    }

    // Get search bar based on role
    getSearchBar() {
        if (this.currentRole === 'student') {
            return ''; // Student doesn't have search bar
        }
        
        return `
            <div class="row">
                <div class="col">
                    <div class="input-group" style="width: 350px;">
                        <span class="input-group-text bg-light border-0"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control bg-light border-0" placeholder="Search or type" id="search-input">
                        <button class="btn btn-primary" id="search-button">Search</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get profile dropdown
    getProfileDropdown() {
        return `
            <div class="dropdown">
                <div class="d-flex align-items-center">
                    <button class="btn-noti mx-3"><i class="fa fa-bell fa-lg"></i></button>
                    <img class="profile" src="/public/img/profile.webp" alt="profile" onclick="toggleMenu()">
                </div>
                <div id="profileMenu" class="dropdown-menu">
                    <div class="profile-info">
                        <img src="/public/img/profile.webp" alt="Profile Picture">
                        <p id="displayUsername">${this.userInfo.username}</p>
                        <p id="displayUserid">ID: ${this.userInfo.userid}</p>
                    </div>
                    <div class="menu-item" onclick="redirectToProfile()">
                        <i class="fa fa-user"></i> Profile
                    </div>
                    <div class="menu-item" onclick="logout()">
                        <i class="fa fa-sign-out"></i> Logout
                    </div>
                </div>
            </div>
        `;
    }

    // Generate sidebar HTML based on role
    generateSidebar() {
        const sidebarItems = this.getSidebarItems();
        let sidebarHTML = '<div class="sidebar">';
        
        sidebarItems.forEach(item => {
            sidebarHTML += `
                <a href="${item.href}">
                    <button class="btn-sidebar"><i class="fa ${item.icon}"> </i> ${item.text}</button>
                </a>
            `;
        });
        
        sidebarHTML += '</div>';
        return sidebarHTML;
    }

    // Get sidebar items based on role
    getSidebarItems() {
        const items = {
            student: [
                { href: '/student', icon: 'fa-chart-pie', text: 'Dashboard' },
                { href: '/student/Asset', icon: 'fa-archive', text: 'Asset' },
                { href: '/student/sta/pd', icon: 'fa-clipboard-list', text: 'Asset List' }
            ],
            staff: [
                { href: '/staff', icon: 'fa-chart-pie', text: 'Dashboard' },
                { href: '/staff/Edit-Asset', icon: 'fa-archive', text: 'Asset List' },
                { href: '/staff/Borrowing-requests', icon: 'fa-clipboard-list', text: 'Borrow Request' },
                { href: '/staff/History', icon: 'fa-arrow-circle-left', text: 'Asset History' },
                { href: '/staff/Returning', icon: 'fa-history', text: 'Borrow Return' }
            ],
            lecturer: [
                { href: '/lecturer', icon: 'fa-chart-pie', text: 'Dashboard' },
                { href: '/lecturer/MangeUser', icon: 'fa-archive', text: 'Manage Role' },
                { href: '/lecturer/history', icon: 'fa-arrow-circle-left', text: 'Report_CSV' },
                { href: '/lecturer/AddAsset', icon: 'fa-clipboard-list', text: 'Add Asset' }
            ]
        };
        
        return items[this.currentRole] || items.student;
    }

    // Initialize navigation components
    init() {
        // Insert navbar
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = this.generateNavbar();
        }

        // Insert sidebar
        const sidebarContainer = document.getElementById('sidebar-container');
        if (sidebarContainer) {
            sidebarContainer.innerHTML = this.generateSidebar();
        }

        // Initialize event listeners
        this.initEventListeners();
    }

    // Initialize event listeners
    initEventListeners() {
        // Profile menu toggle
        window.toggleMenu = () => {
            const menu = document.getElementById('profileMenu');
            if (menu) {
                menu.classList.toggle('active');
                
                if (menu.classList.contains('active')) {
                    const menuRect = menu.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;

                    if (menuRect.right > viewportWidth) {
                        const offset = menuRect.right - viewportWidth + 10;
                        menu.style.right = `${offset}px`;
                    } else {
                        menu.style.right = '10px';
                    }
                }
            }
        };

        // Profile redirect
        window.redirectToProfile = () => {
            const profilePages = {
                student: '/student/setting',
                staff: '/staff/setting',
                lecturer: '/lecturer/setting'
            };
            window.location.href = profilePages[this.currentRole] || '/student/setting';
        };

        // Logout function
        window.logout = () => {
            localStorage.removeItem('username');
            localStorage.removeItem('userid');
            localStorage.removeItem('role');
            window.location.href = '/login';
        };

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('profileMenu');
            const profileImg = document.querySelector('.profile');
            
            if (menu && !menu.contains(e.target) && !profileImg.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const nav = new NavigationComponents();
    nav.init();
});

// Export for manual initialization
window.NavigationComponents = NavigationComponents; 