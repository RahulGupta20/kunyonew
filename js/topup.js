// Top-Up Page JavaScript (SEAGM-Inspired)

(function() {
    'use strict';

    // State Management
    const state = {
        selectedPackage: null,
        userId: '',
        zoneId: '',
        userVerified: false,
        selectedPayment: null,
        contactEmail: '',
        promoCode: '',
        discount: 0
    };

    // DOM Elements
    const packageCards = document.querySelectorAll('.package-card');
    const userIdInput = document.getElementById('userId');
    const zoneIdInput = document.getElementById('zoneId');
    const uidVerification = document.getElementById('uidVerification');
    const verifiedUsername = document.getElementById('verifiedUsername');
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const contactEmailInput = document.getElementById('contactEmail');
    const promoCodeInput = document.getElementById('promoCode');
    const btnApplyPromo = document.getElementById('btnApplyPromo');
    const promoSuccess = document.getElementById('promoSuccess');
    const btnCheckout = document.getElementById('btnCheckout');

    // Summary Elements
    const summaryPreview = document.getElementById('summaryPreview');
    const summaryDetails = document.getElementById('summaryDetails');
    const summaryPackage = document.getElementById('summaryPackage');
    const summaryPackageName = document.getElementById('summaryPackageName');
    const summaryPrice = document.getElementById('summaryPrice');
    const summaryDiscount = document.getElementById('summaryDiscount');
    const summaryTotal = document.getElementById('summaryTotal');

    // Success Modal
    const successModal = document.getElementById('successModal');
    const successOrderId = document.getElementById('successOrderId');
    const successPackage = document.getElementById('successPackage');
    const successAmount = document.getElementById('successAmount');
    const btnViewOrder = document.getElementById('btnViewOrder');
    const btnCloseSuccess = document.getElementById('btnCloseSuccess');

    // Live Purchases Container
    const livePurchases = document.getElementById('livePurchases');

    // Initialize
    function init() {
        attachEventListeners();
        initTooltips();
        startLivePurchases();
    }

    // Event Listeners
    function attachEventListeners() {
        // Package Selection
        packageCards.forEach(card => {
            card.addEventListener('click', function() {
                selectPackage(this);
            });
        });

        // UID Inputs
        if (userIdInput) {
            userIdInput.addEventListener('input', debounce(verifyUID, 800));
        }

        if (zoneIdInput) {
            zoneIdInput.addEventListener('input', debounce(verifyUID, 800));
        }

        // Payment Method
        paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
                state.selectedPayment = this.value;
                updateSummary();
            });
        });

        // Contact Email
        if (contactEmailInput) {
            contactEmailInput.addEventListener('input', function() {
                state.contactEmail = this.value;
            });
        }

        // Promo Code
        if (btnApplyPromo) {
            btnApplyPromo.addEventListener('click', applyPromoCode);
        }

        if (promoCodeInput) {
            promoCodeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    applyPromoCode();
                }
            });
        }

        // Checkout
        if (btnCheckout) {
            btnCheckout.addEventListener('click', handleCheckout);
        }

        // Success Modal
        if (btnViewOrder) {
            btnViewOrder.addEventListener('click', function() {
                closeSuccessModal();
                // Redirect to orders page
                window.location.href = '#my-orders';
            });
        }

        if (btnCloseSuccess) {
            btnCloseSuccess.addEventListener('click', closeSuccessModal);
        }
    }

    // Select Package
    function selectPackage(card) {
        // Remove previous selection
        packageCards.forEach(c => c.classList.remove('selected'));

        // Add selection to clicked card
        card.classList.add('selected');

        // Update state
        state.selectedPackage = {
            id: card.getAttribute('data-package-id'),
            diamonds: card.getAttribute('data-diamonds'),
            price: parseFloat(card.getAttribute('data-price'))
        };

        // Update summary
        updateSummary();

        // Scroll to UID section on mobile
        if (window.innerWidth < 768) {
            const section2 = document.getElementById('section2');
            if (section2) {
                section2.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Verify UID
    function verifyUID() {
        const userId = userIdInput?.value.trim();
        const zoneId = zoneIdInput?.value.trim();

        if (!userId || !zoneId) {
            if (uidVerification) {
                uidVerification.style.display = 'none';
            }
            state.userVerified = false;
            return;
        }

        // Mock verification - in real app, call API
        state.userId = userId;
        state.zoneId = zoneId;

        // Simulate API call
        setTimeout(() => {
            const mockUsernames = [
                'DragonSlayer_X',
                'ProGamer_2024',
                'LegendKiller',
                'MythicPlayer',
                'EliteWarrior'
            ];

            const randomUsername = mockUsernames[Math.floor(Math.random() * mockUsernames.length)];

            if (verifiedUsername) {
                verifiedUsername.textContent = randomUsername;
            }

            if (uidVerification) {
                uidVerification.style.display = 'block';
            }

            state.userVerified = true;

            // Show success animation
            uidVerification?.classList.add('verified-animation');
        }, 500);
    }

    // Update Summary
    function updateSummary() {
        if (!state.selectedPackage) {
            if (summaryPreview) summaryPreview.style.display = 'block';
            if (summaryDetails) summaryDetails.style.display = 'none';
            return;
        }

        if (summaryPreview) summaryPreview.style.display = 'none';
        if (summaryDetails) summaryDetails.style.display = 'block';

        const { diamonds, price } = state.selectedPackage;

        // Update package info
        if (summaryPackage) {
            summaryPackage.textContent = `${diamonds} Diamonds`;
        }

        if (summaryPackageName) {
            summaryPackageName.textContent = `${diamonds} Diamonds`;
        }

        // Update prices
        if (summaryPrice) {
            summaryPrice.textContent = `$${price.toFixed(2)}`;
        }

        // Calculate total with discount
        const total = price - state.discount;

        if (summaryDiscount) {
            if (state.discount > 0) {
                summaryDiscount.textContent = `-$${state.discount.toFixed(2)}`;
                summaryDiscount.parentElement.style.display = 'flex';
            } else {
                summaryDiscount.parentElement.style.display = 'none';
            }
        }

        if (summaryTotal) {
            summaryTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Apply Promo Code
    function applyPromoCode() {
        const code = promoCodeInput?.value.trim().toUpperCase();

        if (!code) {
            showNotification('Please enter a promo code', 'error');
            return;
        }

        if (!state.selectedPackage) {
            showNotification('Please select a package first', 'error');
            return;
        }

        // Mock promo codes - in real app, validate with API
        const validCodes = {
            'KUNYO10': 0.10, // 10% discount
            'WELCOME': 1.00, // $1 discount
            'SAVE20': 0.20, // 20% discount
            'FIRST5': 5.00   // $5 discount
        };

        if (validCodes[code]) {
            let discount;
            if (code === 'KUNYO10' || code === 'SAVE20') {
                // Percentage discount
                discount = state.selectedPackage.price * validCodes[code];
            } else {
                // Fixed discount
                discount = validCodes[code];
            }

            state.discount = Math.min(discount, state.selectedPackage.price); // Don't exceed price
            state.promoCode = code;

            if (promoSuccess) {
                promoSuccess.style.display = 'flex';
            }

            if (promoCodeInput) {
                promoCodeInput.disabled = true;
            }

            if (btnApplyPromo) {
                btnApplyPromo.disabled = true;
            }

            updateSummary();
            showNotification('Promo code applied successfully!', 'success');
        } else {
            showNotification('Invalid promo code', 'error');
        }
    }

    // Handle Checkout
    function handleCheckout() {
        // Validation
        if (!state.selectedPackage) {
            showNotification('Please select a package', 'error');
            scrollToSection('section1');
            return;
        }

        if (!state.userId || !state.zoneId) {
            showNotification('Please enter your User ID and Zone ID', 'error');
            scrollToSection('section2');
            return;
        }

        if (!state.userVerified) {
            showNotification('Please wait for account verification', 'error');
            return;
        }

        if (!state.selectedPayment) {
            showNotification('Please select a payment method', 'error');
            scrollToSection('section3');
            return;
        }

        if (!state.contactEmail) {
            showNotification('Please enter your email address', 'error');
            scrollToSection('section4');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(state.contactEmail)) {
            showNotification('Please enter a valid email address', 'error');
            scrollToSection('section4');
            return;
        }

        // Show processing state
        btnCheckout.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';
        btnCheckout.disabled = true;

        // Simulate payment processing
        setTimeout(() => {
            processPayment();
        }, 2000);
    }

    // Process Payment
    function processPayment() {
        // Generate order ID
        const orderId = `KO-${Date.now().toString().slice(-8)}`;
        const total = state.selectedPackage.price - state.discount;

        // Update success modal
        if (successOrderId) {
            successOrderId.textContent = orderId;
        }

        if (successPackage) {
            successPackage.textContent = `${state.selectedPackage.diamonds} Diamonds`;
        }

        if (successAmount) {
            successAmount.textContent = `$${total.toFixed(2)}`;
        }

        // Show success modal
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Reset checkout button
        btnCheckout.innerHTML = '<i class="bi bi-lock-fill"></i> Complete Purchase';
        btnCheckout.disabled = false;

        // Reset form
        resetForm();
    }

    // Close Success Modal
    function closeSuccessModal() {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Reset Form
    function resetForm() {
        // Reset state
        state.selectedPackage = null;
        state.userId = '';
        state.zoneId = '';
        state.userVerified = false;
        state.selectedPayment = null;
        state.contactEmail = '';
        state.promoCode = '';
        state.discount = 0;

        // Reset UI
        packageCards.forEach(card => card.classList.remove('selected'));

        if (userIdInput) userIdInput.value = '';
        if (zoneIdInput) zoneIdInput.value = '';
        if (uidVerification) uidVerification.style.display = 'none';

        paymentOptions.forEach(option => option.checked = false);

        if (contactEmailInput) contactEmailInput.value = '';
        if (promoCodeInput) {
            promoCodeInput.value = '';
            promoCodeInput.disabled = false;
        }
        if (btnApplyPromo) btnApplyPromo.disabled = false;
        if (promoSuccess) promoSuccess.style.display = 'none';

        updateSummary();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Live Purchases (Social Proof)
    function startLivePurchases() {
        const purchases = [
            { user: 'John D.', location: 'Philippines', package: '500 Diamonds' },
            { user: 'Maria S.', location: 'Indonesia', package: '1000 Diamonds' },
            { user: 'Ahmad K.', location: 'Malaysia', package: '250 Diamonds' },
            { user: 'Tan W.', location: 'Singapore', package: '2500 Diamonds' },
            { user: 'Lisa T.', location: 'Thailand', package: '500 Diamonds' },
            { user: 'Ryan C.', location: 'Philippines', package: '1000 Diamonds' }
        ];

        let index = 0;

        const showPurchase = () => {
            const purchase = purchases[index];

            const purchaseItem = document.createElement('div');
            purchaseItem.className = 'live-purchase-item';
            purchaseItem.innerHTML = `
                <div class="purchase-icon">
                    <i class="bi bi-bag-check-fill"></i>
                </div>
                <div class="purchase-info">
                    <div class="purchase-user">${purchase.user} from ${purchase.location}</div>
                    <div class="purchase-details">just purchased ${purchase.package}</div>
                </div>
                <div class="purchase-time">Just now</div>
            `;

            if (livePurchases) {
                livePurchases.appendChild(purchaseItem);

                // Remove after 5 seconds
                setTimeout(() => {
                    purchaseItem.style.animation = 'slideOutLeft 0.5s ease';
                    setTimeout(() => {
                        purchaseItem.remove();
                    }, 500);
                }, 5000);
            }

            index = (index + 1) % purchases.length;
        };

        // Show first purchase after 3 seconds
        setTimeout(() => {
            showPurchase();
            // Then show every 10 seconds
            setInterval(showPurchase, 10000);
        }, 3000);
    }

    // Scroll to Section
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Initialize Tooltips
    function initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Notification Helper
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;

        let bgColor;
        if (type === 'success') {
            bgColor = 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)';
        } else if (type === 'error') {
            bgColor = 'linear-gradient(135deg, #dc143c 0%, #ff1744 100%)';
        } else {
            bgColor = 'linear-gradient(135deg, #003893 0%, #0047b3 100%)';
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 999999;
            animation: slideInRight 0.3s ease;
            font-size: 0.9rem;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Debounce Helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Mobile Menu Compatibility
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const navbarCollapse = document.querySelector('#mainNav');

    if (mobileMenuToggle && mobileMenuOverlay && navbarCollapse) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuOverlay.classList.toggle('show');
        });

        mobileMenuOverlay.addEventListener('click', function() {
            this.classList.remove('show');
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        });

        navbarCollapse.addEventListener('shown.bs.collapse', function() {
            mobileMenuOverlay?.classList.add('show');
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            mobileMenuOverlay?.classList.remove('show');
        });
    }

    // Add slideOutLeft animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutLeft {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-100%);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('Top-Up page initialized - SEAGM-inspired design');
})();
