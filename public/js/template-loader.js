// Template Loader for Dynamic Content
class TemplateLoader {
    constructor() {
        this.templates = {};
        this.currentPage = null;
    }

    // Load template from server
    async loadTemplate(templateName) {
        try {
            const response = await fetch(`/public/templates/${templateName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${templateName}`);
            }
            const template = await response.text();
            this.templates[templateName] = template;
            return template;
        } catch (error) {
            console.error('Error loading template:', error);
            return this.getFallbackTemplate();
        }
    }

    // Get fallback template if loading fails
    getFallbackTemplate() {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dashboard</title>
                <link rel="stylesheet" href="/public/css/bootstrap.min.css">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
                <link rel="stylesheet" href="/public/css/Head.css">
                <link rel="stylesheet" href="/public/css/components.css">
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
                                <div id="content-placeholder">
                                    <h2>Content Loading...</h2>
                                    <p>Please wait while the content loads.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="/public/js/bootstrap.min.js"></script>
                <script src="/public/js/components.js"></script>
            </body>
            </html>
        `;
    }

    // Render template with data
    renderTemplate(templateName, data = {}) {
        let template = this.templates[templateName];
        if (!template) {
            template = this.getFallbackTemplate();
        }

        // Replace placeholders with data
        Object.keys(data).forEach(key => {
            const placeholder = `{{${key}}}`;
            template = template.replace(new RegExp(placeholder, 'g'), data[key] || '');
        });

        return template;
    }

    // Load and render page
    async loadPage(pageName, data = {}) {
        try {
            // Load template if not already loaded
            if (!this.templates[pageName]) {
                await this.loadTemplate(pageName);
            }

            // Render template with data
            const renderedTemplate = this.renderTemplate(pageName, data);
            
            // Update current page
            this.currentPage = pageName;
            
            return renderedTemplate;
        } catch (error) {
            console.error('Error loading page:', error);
            return this.getFallbackTemplate();
        }
    }

    // Update only the main content area
    updateMainContent(content) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = content;
        }
    }

    // Load content dynamically
    async loadContent(contentPath, targetElement = '.main-content') {
        try {
            const response = await fetch(contentPath);
            if (!response.ok) {
                throw new Error(`Failed to load content: ${contentPath}`);
            }
            const content = await response.text();
            
            const target = document.querySelector(targetElement);
            if (target) {
                target.innerHTML = content;
            }
            
            return content;
        } catch (error) {
            console.error('Error loading content:', error);
            return '<div class="alert alert-danger">Error loading content</div>';
        }
    }

    // Initialize page with navigation
    async initPage(pageName, data = {}) {
        // Load the page template
        const pageContent = await this.loadPage(pageName, data);
        
        // Replace the entire document content
        document.documentElement.innerHTML = pageContent;
        
        // Re-initialize navigation components
        if (window.NavigationComponents) {
            const nav = new window.NavigationComponents();
            nav.init();
        }
        
        // Execute any page-specific scripts
        this.executePageScripts(pageName);
    }

    // Execute page-specific scripts
    executePageScripts(pageName) {
        const scripts = {
            'student-dashboard': () => {
                // Student dashboard specific scripts
                if (typeof initStudentDashboard === 'function') {
                    initStudentDashboard();
                }
            },
            'staff-dashboard': () => {
                // Staff dashboard specific scripts
                if (typeof initStaffDashboard === 'function') {
                    initStaffDashboard();
                }
            },
            'lecturer-dashboard': () => {
                // Lecturer dashboard specific scripts
                if (typeof initLecturerDashboard === 'function') {
                    initLecturerDashboard();
                }
            }
        };

        if (scripts[pageName]) {
            scripts[pageName]();
        }
    }

    // Navigate to page
    async navigateTo(pageName, data = {}) {
        try {
            await this.initPage(pageName, data);
            // Update URL without page reload
            window.history.pushState({ page: pageName, data }, '', `/${pageName}`);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }

    // Handle browser back/forward
    handlePopState(event) {
        if (event.state && event.state.page) {
            this.initPage(event.state.page, event.state.data || {});
        }
    }
}

// Initialize template loader
const templateLoader = new TemplateLoader();

// Handle browser navigation
window.addEventListener('popstate', (event) => {
    templateLoader.handlePopState(event);
});

// Export for use in other scripts
window.TemplateLoader = TemplateLoader;
window.templateLoader = templateLoader;

/* ==================== TEMPLATE LOADER ==================== */
/* ไฟล์นี้ใช้สำหรับโหลด template และจัดการ sidebar active state */

// Load navbar template
async function loadNavbar() {
    try {
        const response = await fetch('/public/templates/shared-navbar.html');
        const navbarHtml = await response.text();
        
        // Insert navbar at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', navbarHtml);
        
        // Initialize shared components after navbar is loaded
        if (window.SharedComponents) {
            window.SharedComponents.initializeSharedComponents();
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

// Load sidebar template based on user type
async function loadSidebar(userType) {
    try {
        let templatePath;
        switch (userType) {
            case 'staff':
                templatePath = '/public/templates/staff-sidebar.html';
                break;
            case 'lecturer':
                templatePath = '/public/templates/lecturer-sidebar.html';
                break;
            case 'student':
                templatePath = '/public/templates/student-sidebar.html';
                break;
            default:
                console.error('Unknown user type:', userType);
                return;
        }
        
        const response = await fetch(templatePath);
        const sidebarHtml = await response.text();
        
        // Find the sidebar container and insert the template
        const sidebarContainer = document.querySelector('.sidebar-container');
        if (sidebarContainer) {
            sidebarContainer.innerHTML = sidebarHtml;
        } else {
            // If no container exists, create one
            const container = document.createElement('div');
            container.className = 'sidebar-container';
            container.innerHTML = sidebarHtml;
            document.body.appendChild(container);
        }
        
        // Set active state based on current page
        setActiveSidebarItem();
        
    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
}

// Set active sidebar item based on current page
function setActiveSidebarItem() {
    const currentPath = window.location.pathname;
    const sidebarButtons = document.querySelectorAll('.btn-sidebar');
    
    // Remove active class from all buttons
    sidebarButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class based on current path
    if (currentPath.includes('/staff')) {
        if (currentPath === '/staff' || currentPath === '/staff/') {
            document.getElementById('sidebar-dashboard')?.classList.add('active');
        } else if (currentPath.includes('/Edit-Asset')) {
            document.getElementById('sidebar-asset-list')?.classList.add('active');
        } else if (currentPath.includes('/Borrowing-requests')) {
            document.getElementById('sidebar-borrow-request')?.classList.add('active');
        } else if (currentPath.includes('/History')) {
            document.getElementById('sidebar-history')?.classList.add('active');
        } else if (currentPath.includes('/Returning')) {
            document.getElementById('sidebar-returning')?.classList.add('active');
        }
    } else if (currentPath.includes('/lecturer')) {
        if (currentPath === '/lecturer' || currentPath === '/lecturer/') {
            document.getElementById('sidebar-dashboard')?.classList.add('active');
        } else if (currentPath.includes('/Add-Asset')) {
            document.getElementById('sidebar-add-asset')?.classList.add('active');
        } else if (currentPath.includes('/Manage-Users')) {
            document.getElementById('sidebar-manage-users')?.classList.add('active');
        } else if (currentPath.includes('/History')) {
            document.getElementById('sidebar-history')?.classList.add('active');
        }
    } else if (currentPath.includes('/student')) {
        if (currentPath === '/student' || currentPath === '/student/') {
            document.getElementById('sidebar-dashboard')?.classList.add('active');
        } else if (currentPath.includes('/Asset') && !currentPath.includes('/Asset-List')) {
            document.getElementById('sidebar-asset')?.classList.add('active');
        } else if (currentPath.includes('/Asset-List')) {
            document.getElementById('sidebar-asset-list')?.classList.add('active');
        }
    }
}

// Override redirectToProfile function based on user type
function setupProfileRedirect() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/staff')) {
        window.redirectToProfile = function() {
            window.location.href = '/staff/Setting';
        };
    } else if (currentPath.includes('/lecturer')) {
        window.redirectToProfile = function() {
            window.location.href = '/lecturer/Setting';
        };
    } else if (currentPath.includes('/student')) {
        window.redirectToProfile = function() {
            window.location.href = '/student/Setting';
        };
    }
}

// Override performSearch function based on page
function setupPageSpecificSearch() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/History')) {
        window.performSearch = function(searchTerm) {
            const tableBody = document.getElementById('table-body');
            if (tableBody) {
                const rows = tableBody.getElementsByTagName('tr');
                
                for (let row of rows) {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm.toLowerCase())) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            }
        };
    } else if (currentPath.includes('/Edit-Asset') || currentPath.includes('/Asset-List')) {
        window.performSearch = function(searchTerm) {
            const tableBody = document.getElementById('asset-table-body');
            if (tableBody) {
                const rows = tableBody.getElementsByTagName('tr');
                
                for (let row of rows) {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm.toLowerCase())) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            }
        };
    }
}

// Initialize templates
async function initializeTemplates() {
    // Determine user type from current path
    const currentPath = window.location.pathname;
    let userType = 'staff'; // default
    
    if (currentPath.includes('/lecturer')) {
        userType = 'lecturer';
    } else if (currentPath.includes('/student')) {
        userType = 'student';
    }
    
    // Load navbar and sidebar
    await loadNavbar();
    await loadSidebar(userType);
    
    // Setup page-specific functions
    setupProfileRedirect();
    setupPageSpecificSearch();
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTemplates();
}); 