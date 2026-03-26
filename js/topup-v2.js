// Top-Up V2 JavaScript - Updated with Order Summary Integration

(function() {
    'use strict';

    // State Management
    const state = {
        selectedPackage: null,
        userDetails: {
            userId: '',
            username: '',
            server: 'Asia'
        },
        selectedPayment: 'card',
        promoCode: '',
        discount: 0
    };

    // DOM Elements
    const packageRows = document.querySelectorAll('.package-row-v2');
    const userIdInput = document.getElementById('userIdV2');
    const usernameInput = document.getElementById('zoneIdV2');
    const paymentOptions = document.querySelectorAll('.payment-method-compact input[type="radio"]');
    const btnCheckout = document.querySelector('.btn-checkout-v2');

    // Summary elements
    const summaryPackageValue = document.querySelector('.info-row:nth-child(1) .info-value');
    const summaryUserIdValue = document.querySelector('.info-row:nth-child(2) .info-value');
    const summaryServerValue = document.querySelector('.info-row:nth-child(3) .info-value');
    const summaryTotalAmount = document.querySelector('.total-amount');

    // Initialize
    function init() {
        attachEventListeners();
        updateSummary();
    }

    // Event Listeners
    function attachEventListeners() {
        // Package Selection
        packageRows.forEach((row) => {
            row.addEventListener('click', function() {
                selectPackage(row);
            });
        });

        // User ID Input
        if (userIdInput) {
            userIdInput.addEventListener('input', function() {
                state.userDetails.userId = this.value.trim();
                updateSummary();
            });
        }

        // Username Input
        if (usernameInput) {
            usernameInput.addEventListener('input', function() {
                state.userDetails.username = this.value.trim();
            });
        }

        // Payment Method Selection
        paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
                if (this.checked) {
                    state.selectedPayment = this.value;
                    showNotification(`Payment method: ${this.value.charAt(0).toUpperCase() + this.value.slice(1)}`);
                }
            });
        });

        // Checkout Button
        if (btnCheckout) {
            btnCheckout.addEventListener('click', function() {
                processCheckout();
            });
        }
    }

    // Package Selection
    function selectPackage(row) {
        // Remove selection from all
        packageRows.forEach(r => r.classList.remove('selected'));

        // Add selection to clicked
        row.classList.add('selected');

        // Get package data
        const packageId = row.getAttribute('data-package-id');
        const diamonds = row.getAttribute('data-diamonds');
        const price = parseFloat(row.getAttribute('data-price'));
        const name = row.querySelector('.package-details h4')?.textContent || `${diamonds} Diamonds`;

        // Update state
        state.selectedPackage = {
            id: packageId,
            name: name,
            diamonds: diamonds,
            price: price
        };

        // Update summary
        updateSummary();

        // Show notification with package icon
        showNotification(`✓ Selected: ${diamonds} Diamonds`);

        // Add subtle animation to summary
        const summaryCard = document.querySelector('.order-summary-v2');
        if (summaryCard) {
            summaryCard.style.transform = 'scale(1.02)';
            setTimeout(() => {
                summaryCard.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Update Summary
    function updateSummary() {
        // Update package
        if (summaryPackageValue && state.selectedPackage) {
            summaryPackageValue.textContent = `${state.selectedPackage.diamonds} Diamonds`;
        } else if (summaryPackageValue) {
            summaryPackageValue.textContent = '550 Crystals';
        }

        // Update User ID
        if (summaryUserIdValue) {
            summaryUserIdValue.textContent = state.userDetails.userId || '432423';
        }

        // Update Server
        if (summaryServerValue) {
            summaryServerValue.textContent = state.userDetails.server;
        }

        // Update Total
        if (summaryTotalAmount && state.selectedPackage) {
            const subtotal = state.selectedPackage.price;
            const discountAmount = (subtotal * state.discount) / 100;
            const total = subtotal - discountAmount;
            summaryTotalAmount.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Process Checkout
    function processCheckout() {
        // Validation
        if (!state.selectedPackage) {
            showNotification('⚠ Please select a package first', 'error');
            const packagesSection = document.querySelector('.packages-list-v2');
            if (packagesSection) {
                packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        if (!state.userDetails.userId) {
            showNotification('⚠ Please enter your User ID', 'error');
            userIdInput?.focus();
            return;
        }

        if (!state.userDetails.username) {
            showNotification('⚠ Please enter your Username', 'error');
            usernameInput?.focus();
            return;
        }

        if (!state.selectedPayment) {
            showNotification('⚠ Please select a payment method', 'error');
            return;
        }

        // Show processing
        if (btnCheckout) {
            const originalHTML = btnCheckout.innerHTML;
            btnCheckout.innerHTML = '<i class="bi bi-hourglass-split"></i><span>Processing...</span>';
            btnCheckout.disabled = true;
            btnCheckout.style.opacity = '0.7';
        }

        // Simulate payment processing
        setTimeout(() => {
            // Success
            showSuccessModal();

            // Reset button
            if (btnCheckout) {
                btnCheckout.innerHTML = '<i class="bi bi-lock-fill"></i><span>Proceed to Payment</span>';
                btnCheckout.disabled = false;
                btnCheckout.style.opacity = '1';
            }
        }, 2000);
    }

    // Show Success Modal
    function showSuccessModal() {
        const subtotal = state.selectedPackage.price;
        const discountAmount = (subtotal * state.discount) / 100;
        const total = subtotal - discountAmount;

        const modal = document.createElement('div');
        modal.className = 'success-modal-v2';
        modal.innerHTML = `
            <div class="success-modal-overlay"></div>
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <h2>Purchase Successful!</h2>
                <p>Your ${state.selectedPackage.diamonds} diamonds will be delivered within 5 minutes.</p>
                <div class="success-details">
                    <div class="detail-row">
                        <span>Order ID:</span>
                        <strong>#KUN${Math.floor(100000 + Math.random() * 900000)}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Package:</span>
                        <strong>${state.selectedPackage.diamonds} Diamonds</strong>
                    </div>
                    <div class="detail-row">
                        <span>User ID:</span>
                        <strong>${state.userDetails.userId}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Username:</span>
                        <strong>${state.userDetails.username}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Server:</span>
                        <strong>${state.userDetails.server}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Payment:</span>
                        <strong>${state.selectedPayment.charAt(0).toUpperCase() + state.selectedPayment.slice(1)}</strong>
                    </div>
                    <div class="detail-row total">
                        <span>Total Paid:</span>
                        <strong>$${total.toFixed(2)}</strong>
                    </div>
                </div>
                <div class="success-actions">
                    <button class="btn-success-primary" onclick="window.location.reload()">
                        <i class="bi bi-arrow-repeat"></i> New Order
                    </button>
                    <button class="btn-success-secondary" onclick="this.closest('.success-modal-v2').remove(); document.body.style.overflow = '';">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close on overlay click
        modal.querySelector('.success-modal-overlay').addEventListener('click', function() {
            modal.remove();
            document.body.style.overflow = '';
        });

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .success-modal-v2 {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .success-modal-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(8px);
            }

            .success-modal-content {
                position: relative;
                background: linear-gradient(135deg, rgba(54, 9, 15, 0.98), rgba(0, 56, 147, 0.98));
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 2.5rem 2rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                animation: slideUp 0.4s ease;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }

            .success-icon {
                font-size: 4rem;
                color: #4caf50;
                margin-bottom: 1rem;
                animation: scaleIn 0.5s ease;
            }

            .success-modal-content h2 {
                color: #fff;
                font-size: 1.75rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }

            .success-modal-content > p {
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 1.5rem;
            }

            .success-details {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                text-align: left;
            }

            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.6rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .detail-row:last-child {
                border-bottom: none;
            }

            .detail-row.total {
                padding-top: 1rem;
                margin-top: 0.5rem;
                border-top: 2px solid rgba(255, 255, 255, 0.1);
                border-bottom: none;
            }

            .detail-row span {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.9rem;
            }

            .detail-row strong {
                color: #fff;
                font-weight: 600;
            }

            .detail-row.total strong {
                font-size: 1.5rem;
                background: linear-gradient(135deg, #dc143c, #003893);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .success-actions {
                display: flex;
                gap: 1rem;
            }

            .btn-success-primary, .btn-success-secondary {
                flex: 1;
                padding: 0.85rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .btn-success-primary {
                background: linear-gradient(135deg, #003893, #dc143c);
                color: #fff;
            }

            .btn-success-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0, 56, 147, 0.4);
            }

            .btn-success-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .btn-success-secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes scaleIn {
                0% {
                    transform: scale(0);
                }
                50% {
                    transform: scale(1.2);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Notification Helper
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification-v2';
        notification.textContent = message;

        const bgColor = type === 'error'
            ? 'linear-gradient(135deg, #dc143c 0%, #8b0000 100%)'
            : 'linear-gradient(135deg, #003893 0%, #dc143c 100%)';

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
            font-weight: 500;
            max-width: 300px;
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✓ Top-Up V2 initialized - Order Summary Integration');
})();
