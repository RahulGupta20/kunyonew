// Gift Card JavaScript - Redesigned UX

(function() {
    'use strict';

    // State Management
    const state = {
        currentStep: 1,
        selectedAmount: 50,
        selectedDesign: 'gradient-blue',
        selectedDelivery: 'instant',
        giftMessage: '',
        senderName: '',
        recipientEmail: ''
    };

    // Design Gradients
    const designGradients = {
        'gradient-blue': 'linear-gradient(135deg, #003893 0%, #dc143c 100%)',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-green': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    };

    // DOM Elements
    const progressSteps = document.querySelectorAll('.progress-step');
    const formSteps = document.querySelectorAll('.form-step');

    const cardInner = document.getElementById('cardInner');
    const cardFront = document.querySelector('.card-front');
    const previewAmount = document.getElementById('previewAmount');
    const previewMessage = document.getElementById('previewMessage');
    const previewFrom = document.getElementById('previewFrom');
    const previewTo = document.getElementById('previewTo');

    const amountOptions = document.querySelectorAll('input[name="amount"]');
    const customAmountInput = document.getElementById('customAmount');
    const designOptions = document.querySelectorAll('input[name="design"]');
    const messageTextarea = document.getElementById('giftMessage');
    const senderNameInput = document.getElementById('senderName');
    const recipientEmailInput = document.getElementById('recipientEmail');
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');

    const btnNext1 = document.getElementById('btnNext1');
    const btnNext2 = document.getElementById('btnNext2');
    const btnBack2 = document.getElementById('btnBack2');
    const btnBack3 = document.getElementById('btnBack3');
    const btnComplete = document.getElementById('btnComplete');
    const btnFlipCard = document.getElementById('btnFlipCard');

    const summaryAmount = document.getElementById('summaryAmount');
    const summaryPrice = document.getElementById('summaryPrice');

    const successModal = document.getElementById('successModal');
    const btnCloseSuccess = document.getElementById('btnCloseSuccess');

    // Initialize
    function init() {
        updateCardPreview();
        updateOrderSummary();
        attachEventListeners();
    }

    // Event Listeners
    function attachEventListeners() {
        // Amount Selection
        amountOptions.forEach(option => {
            option.addEventListener('change', function() {
                if (this.value !== 'custom') {
                    state.selectedAmount = parseInt(this.value);
                    if (customAmountInput) customAmountInput.value = '';
                } else {
                    if (customAmountInput) customAmountInput.focus();
                }
                updateCardPreview();
                updateOrderSummary();
            });
        });

        // Custom Amount
        if (customAmountInput) {
            customAmountInput.addEventListener('input', function() {
                const value = parseInt(this.value);
                if (value >= 10 && value <= 500) {
                    state.selectedAmount = value;
                    // Select custom radio
                    const customRadio = document.querySelector('input[name="amount"][value="custom"]');
                    if (customRadio) customRadio.checked = true;
                    updateCardPreview();
                    updateOrderSummary();
                }
            });
        }

        // Design Selection
        designOptions.forEach(option => {
            option.addEventListener('change', function() {
                state.selectedDesign = this.value;
                updateCardPreview();
            });
        });

        // Message Input
        if (messageTextarea) {
            messageTextarea.addEventListener('input', function() {
                state.giftMessage = this.value;
                updateCardPreview();
            });
        }

        // Sender Name
        if (senderNameInput) {
            senderNameInput.addEventListener('input', function() {
                state.senderName = this.value;
                updateCardPreview();
            });
        }

        // Recipient Email
        if (recipientEmailInput) {
            recipientEmailInput.addEventListener('input', function() {
                state.recipientEmail = this.value;
                updateCardPreview();
            });
        }

        // Delivery Options
        deliveryOptions.forEach(option => {
            option.addEventListener('change', function() {
                state.selectedDelivery = this.value;
            });
        });

        // Flip Card Button
        if (btnFlipCard) {
            btnFlipCard.addEventListener('click', function() {
                if (cardInner) {
                    cardInner.classList.toggle('flipped');
                    const icon = this.querySelector('i');
                    if (cardInner.classList.contains('flipped')) {
                        icon.className = 'bi bi-arrow-clockwise';
                        this.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Flip Back';
                    } else {
                        icon.className = 'bi bi-eye';
                        this.innerHTML = '<i class="bi bi-eye"></i> Preview Card';
                    }
                }
            });
        }

        // Step Navigation
        if (btnNext1) {
            btnNext1.addEventListener('click', function() {
                if (validateStep1()) {
                    goToStep(2);
                }
            });
        }

        if (btnNext2) {
            btnNext2.addEventListener('click', function() {
                if (validateStep2()) {
                    goToStep(3);
                }
            });
        }

        if (btnBack2) {
            btnBack2.addEventListener('click', function() {
                goToStep(1);
            });
        }

        if (btnBack3) {
            btnBack3.addEventListener('click', function() {
                goToStep(2);
            });
        }

        if (btnComplete) {
            btnComplete.addEventListener('click', function() {
                if (validateStep3()) {
                    completePurchase();
                }
            });
        }

        // Close Success Modal
        if (btnCloseSuccess) {
            btnCloseSuccess.addEventListener('click', function() {
                closeSuccessModal();
            });
        }
    }

    // Update Card Preview
    function updateCardPreview() {
        // Update amount
        if (previewAmount) {
            previewAmount.textContent = state.selectedAmount;
        }

        // Update design
        if (cardFront) {
            cardFront.style.background = designGradients[state.selectedDesign] || designGradients['gradient-blue'];
        }

        // Update message
        if (previewMessage) {
            previewMessage.textContent = state.giftMessage || 'Your personal message will appear here...';
        }

        // Update sender name
        if (previewFrom) {
            previewFrom.textContent = state.senderName ? `From: ${state.senderName}` : 'From: Your Name';
        }

        // Update recipient
        if (previewTo) {
            previewTo.textContent = state.recipientEmail ? `To: ${state.recipientEmail}` : 'To: Recipient Email';
        }
    }

    // Update Order Summary
    function updateOrderSummary() {
        if (summaryAmount) {
            summaryAmount.textContent = `$${state.selectedAmount}`;
        }
        if (summaryPrice) {
            summaryPrice.textContent = `$${state.selectedAmount}`;
        }
    }

    // Step Navigation
    function goToStep(step) {
        state.currentStep = step;

        // Update progress tracker
        progressSteps.forEach((stepEl, index) => {
            const stepNum = index + 1;
            stepEl.classList.remove('active', 'completed');

            if (stepNum < step) {
                stepEl.classList.add('completed');
            } else if (stepNum === step) {
                stepEl.classList.add('active');
            }
        });

        // Update form steps
        formSteps.forEach((stepContent, index) => {
            stepContent.classList.remove('active');
            if (index + 1 === step) {
                stepContent.classList.add('active');
            }
        });

        // Scroll to top of form column
        const formColumn = document.querySelector('.gc-form-column');
        if (formColumn) {
            formColumn.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Validation Functions
    function validateStep1() {
        const selectedAmountRadio = document.querySelector('input[name="amount"]:checked');

        if (!selectedAmountRadio) {
            showNotification('Please select an amount');
            return false;
        }

        if (selectedAmountRadio.value === 'custom') {
            if (!customAmountInput || !customAmountInput.value) {
                showNotification('Please enter a custom amount');
                customAmountInput?.focus();
                return false;
            }

            const customValue = parseInt(customAmountInput.value);
            if (customValue < 10 || customValue > 500) {
                showNotification('Custom amount must be between $10 and $500');
                customAmountInput?.focus();
                return false;
            }
        }

        return true;
    }

    function validateStep2() {
        if (!messageTextarea || !messageTextarea.value.trim()) {
            showNotification('Please enter a gift message');
            messageTextarea?.focus();
            return false;
        }

        if (!senderNameInput || !senderNameInput.value.trim()) {
            showNotification('Please enter your name');
            senderNameInput?.focus();
            return false;
        }

        if (!recipientEmailInput || !recipientEmailInput.value.trim()) {
            showNotification('Please enter recipient email');
            recipientEmailInput?.focus();
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmailInput.value)) {
            showNotification('Please enter a valid email address');
            recipientEmailInput?.focus();
            return false;
        }

        return true;
    }

    function validateStep3() {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');

        if (!selectedPayment) {
            showNotification('Please select a payment method');
            return false;
        }

        return true;
    }

    // Complete Purchase
    function completePurchase() {
        if (!btnComplete) return;

        // Show processing state
        btnComplete.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';
        btnComplete.disabled = true;

        setTimeout(() => {
            // Show success modal
            if (successModal) {
                // Update success details
                const successOrderId = document.getElementById('successOrderId');
                const successAmount = document.getElementById('successAmount');
                const successEmail = document.getElementById('successEmail');

                if (successOrderId) {
                    successOrderId.textContent = `GC-${Math.floor(100000 + Math.random() * 900000)}`;
                }
                if (successAmount) {
                    successAmount.textContent = `$${state.selectedAmount}`;
                }
                if (successEmail) {
                    successEmail.textContent = state.recipientEmail;
                }

                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            // Reset button
            btnComplete.innerHTML = '<i class="bi bi-check-circle-fill"></i> Complete Purchase';
            btnComplete.disabled = false;
        }, 2000);
    }

    // Close Success Modal
    function closeSuccessModal() {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Reset form
        resetForm();
    }

    // Reset Form
    function resetForm() {
        // Reset state
        state.currentStep = 1;
        state.selectedAmount = 50;
        state.selectedDesign = 'gradient-blue';
        state.selectedDelivery = 'instant';
        state.giftMessage = '';
        state.senderName = '';
        state.recipientEmail = '';

        // Reset form inputs
        const amount50 = document.querySelector('input[name="amount"][value="50"]');
        if (amount50) amount50.checked = true;

        const designBlue = document.querySelector('input[name="design"][value="gradient-blue"]');
        if (designBlue) designBlue.checked = true;

        const deliveryInstant = document.querySelector('input[name="delivery"][value="instant"]');
        if (deliveryInstant) deliveryInstant.checked = true;

        if (messageTextarea) messageTextarea.value = '';
        if (senderNameInput) senderNameInput.value = '';
        if (recipientEmailInput) recipientEmailInput.value = '';
        if (customAmountInput) customAmountInput.value = '';

        // Reset card flip
        if (cardInner) {
            cardInner.classList.remove('flipped');
        }
        if (btnFlipCard) {
            btnFlipCard.innerHTML = '<i class="bi bi-eye"></i> Preview Card';
        }

        // Go to step 1
        goToStep(1);

        // Update preview
        updateCardPreview();
        updateOrderSummary();
    }

    // Notification Helper
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #dc143c 0%, #003893 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 999999;
            animation: slideInRight 0.3s ease;
            font-size: 0.9rem;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('Gift Card page initialized - Redesigned UX');
})();
