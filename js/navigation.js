// Navigation and Dropdown Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Close button functionality for category dropdown
    const closeBtn = document.querySelector('.close-menu');
    const dropdownElement = document.getElementById('categoryDropdownBtn');

    if (closeBtn && dropdownElement) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = bootstrap.Dropdown.getInstance(dropdownElement);
            if (dropdown) {
                dropdown.hide();
            }
        });
    }

    // Close when clicking category items and update button text
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedText = this.textContent.trim();

            // Update the button text
            const buttonText = dropdownElement.childNodes[0];
            if (buttonText) {
                buttonText.textContent = selectedText + ' ';
            }

            const dropdown = bootstrap.Dropdown.getInstance(dropdownElement);
            if (dropdown) {
                dropdown.hide();
            }
        });
    });

    // Mobile sidebar menu overlay toggle
    const mainNav = document.getElementById('mainNav');
    const overlay = document.getElementById('mobileMenuOverlay');
    const sidebarCloseBtn = document.querySelector('.sidebar-close-btn');

    if (mainNav && overlay) {
        // Show overlay when menu opens
        mainNav.addEventListener('show.bs.collapse', function() {
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        // Hide overlay when menu closes
        mainNav.addEventListener('hide.bs.collapse', function() {
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', function() {
            const bsCollapse = new bootstrap.Collapse(mainNav, {
                toggle: false
            });
            bsCollapse.hide();
        });
    }

    // Handle dropdown behavior for mobile vs desktop
    const navDropdowns = document.querySelectorAll('#mainNav .nav-item.dropdown');

    navDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const megaMenu = dropdown.querySelector('.mega-menu');

        if (toggle && megaMenu) {
            toggle.addEventListener('click', function(e) {
                // Check if we're on mobile view (navbar is collapsed/sidebar mode)
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // Close all other mobile dropdowns
                    navDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('show');
                        }
                    });

                    // Toggle current dropdown
                    dropdown.classList.toggle('show');
                }
                // On desktop (>= 992px), Bootstrap handles it via data-bs-toggle="dropdown"
            });
        }
    });
});
