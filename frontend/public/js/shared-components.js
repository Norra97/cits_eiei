/* ==================== SHARED COMPONENTS JAVASCRIPT ==================== */
/* ไฟล์นี้ใช้สำหรับฟังก์ชัน navbar และ sidebar ที่ใช้ร่วมกันในทุกหน้า */

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
}

// Profile Menu Management
function toggleMenu() {
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
}

// Close menu when clicking outside
function setupMenuClose() {
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('profileMenu');
        const profile = document.querySelector('.profile');
        
        if (menu && profile && !menu.contains(event.target) && !profile.contains(event.target)) {
            menu.classList.remove('active');
        }
    });
}

// Loading Overlay
function setupLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

// Search Functionality
function setupSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value;
            performSearch(searchTerm);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value;
                performSearch(searchTerm);
            }
        });
    }
}

function performSearch(searchTerm) {
    // This function should be overridden by each page
    console.log('Search performed:', searchTerm);
}

// Navigation Functions
function redirectToProfile() {
    // This function should be overridden by each page
    console.log('Redirect to profile');
}

function logout() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    window.location.href = '/login';
}

// Load User Info
function loadUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userid = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    
    const displayUsername = document.getElementById('displayUsername');
    const displayUserid = document.getElementById('displayUserid');
    
    if (displayUsername) {
        if (userInfo.username) {
            displayUsername.textContent = userInfo.username;
        } else if (username) {
            displayUsername.textContent = username;
        } else {
            displayUsername.textContent = 'Guest';
        }
    }
    
    if (displayUserid) {
        if (userInfo.userid) {
            displayUserid.textContent = userInfo.userid;
        } else if (userid) {
            displayUserid.textContent = userid;
        } else {
            displayUserid.textContent = 'ID';
        }
    }
}

// Add animations to elements
function setupAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize all shared components
function initializeSharedComponents() {
    // Set initial theme
    setTheme(currentTheme);
    
    // Setup event listeners
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Setup menu functionality
    setupMenuClose();
    
    // Setup loading overlay
    setupLoadingOverlay();
    
    // Setup search
    setupSearch();
    
    // Load user info
    loadUserInfo();
    
    // Setup animations
    setupAnimations();
}

// Export functions for use in other files
window.SharedComponents = {
    setTheme,
    toggleTheme,
    toggleMenu,
    performSearch,
    redirectToProfile,
    logout,
    loadUserInfo,
    initializeSharedComponents
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSharedComponents();
}); 