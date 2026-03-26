// Product Detail V3 JavaScript - Split Screen Immersive Layout

(function() {
    'use strict';

    // State Management
    const state = {
        currentStep: 1,
        selectedPackage: {
            name: '550 Crystals',
            crystals: 500,
            bonus: 50,
            price: 9.99
        },
        userDetails: {
            userId: '',
            server: '',
            email: ''
        }
    };

    // DOM Elements
    const timelinePackages = document.querySelectorAll('.timeline-package');
    const previewCrystalCount = document.getElementById('previewCrystalCount');
    const previewBonusText = document.getElementById('previewBonusText');

    const cartPackageName = document.getElementById('cartPackageName');
    const cartPrice = document.getElementById('cartPrice');

    const btnWishlist = document.getElementById('btnWishlist');
    const btnShare = document.getElementById('btnShare');

    const stepItems = document.querySelectorAll('.step-item');
    const flowStepContents = document.querySelectorAll('.flow-step-content');

    const btnNextStep1 = document.getElementById('btnNextStep1');
    const btnNextStep2 = document.getElementById('btnNextStep2');
    const btnBackStep2 = document.getElementById('btnBackStep2');
    const btnBackStep3 = document.getElementById('btnBackStep3');
    const btnCompletePurchase = document.getElementById('btnCompletePurchase');

    const successModal = document.getElementById('successModal');
    const btnCloseSuccess = document.getElementById('btnCloseSuccess');

    // Timeline Package Selection
    timelinePackages.forEach(pkg => {
        pkg.addEventListener('click', function() {
            // Remove active from all
            timelinePackages.forEach(p => p.classList.remove('active'));

            // Add active to clicked
            this.classList.add('active');

            // Get package data
            const crystals = parseInt(this.getAttribute('data-crystals'));
            const bonus = parseInt(this.getAttribute('data-bonus'));
            const price = parseFloat(this.getAttribute('data-price'));
            const total = crystals + bonus;

            // Update state
            state.selectedPackage = {
                name: `${total} Crystals`,
                crystals: crystals,
                bonus: bonus,
                price: price
            };

            // Update preview panel
            if (previewCrystalCount) {
                previewCrystalCount.textContent = total;
            }

            if (previewBonusText) {
                if (bonus > 0) {
                    previewBonusText.innerHTML = `<i class="bi bi-gift-fill"></i> +${bonus} Bonus`;
                    previewBonusText.style.display = 'flex';
                } else {
                    previewBonusText.style.display = 'none';
                }
            }

            // Update cart summary
            if (cartPackageName) cartPackageName.textContent = state.selectedPackage.name;
            if (cartPrice) cartPrice.textContent = `$${state.selectedPackage.price}`;

            // Animate crystal
            if (previewCrystalCount && previewCrystalCount.parentElement) {
                previewCrystalCount.parentElement.style.animation = 'none';
                setTimeout(() => {
                    previewCrystalCount.parentElement.style.animation = 'float 3s ease-in-out infinite';
                }, 10);
            }
        });
    });

    // Wishlist Toggle
    if (btnWishlist) {
        btnWishlist.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
                showNotification('Added to wishlist!');
            } else {
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                showNotification('Removed from wishlist');
            }
        });
    }

    // Share Button
    if (btnShare) {
        btnShare.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Genshin Impact Genesis Crystals',
                    text: `Check out this amazing deal: ${state.selectedPackage.name} for only $${state.selectedPackage.price}!`,
                    url: window.location.href
                }).catch(err => console.log('Share failed:', err));
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Link copied to clipboard!');
                });
            }
        });
    }

    // Step Navigation Functions
    function goToStep(step) {
        state.currentStep = step;

        // Update step indicators
        stepItems.forEach((item, index) => {
            const stepNum = index + 1;
            item.classList.remove('active', 'completed');

            if (stepNum < step) {
                item.classList.add('completed');
            } else if (stepNum === step) {
                item.classList.add('active');
            }
        });

        // Update step content
        flowStepContents.forEach((content, index) => {
            content.classList.remove('active');
            if (index + 1 === step) {
                content.classList.add('active');
            }
        });

        // Scroll to top of right panel
        const rightPanel = document.querySelector('.pd3-right-panel');
        if (rightPanel) {
            rightPanel.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Step 1 -> Step 2
    if (btnNextStep1) {
        btnNextStep1.addEventListener('click', function() {
            goToStep(2);
        });
    }

    // Step 2 -> Step 3
    if (btnNextStep2) {
        btnNextStep2.addEventListener('click', function() {
            const userIdInput = document.getElementById('userIdInput');
            const serverSelect = document.getElementById('serverSelect');

            if (!userIdInput || !userIdInput.value.trim()) {
                showNotification('Please enter your User ID');
                userIdInput?.focus();
                return;
            }

            if (!serverSelect || !serverSelect.value) {
                showNotification('Please select your server');
                serverSelect?.focus();
                return;
            }

            // Save user details
            state.userDetails.userId = userIdInput.value.trim();
            state.userDetails.server = serverSelect.options[serverSelect.selectedIndex].text;
            state.userDetails.email = document.getElementById('emailInput')?.value || '';

            // Update final summary
            const finalPackageName = document.getElementById('finalPackageName');
            const finalUserId = document.getElementById('finalUserId');
            const finalServer = document.getElementById('finalServer');
            const finalPrice = document.getElementById('finalPrice');

            if (finalPackageName) finalPackageName.textContent = state.selectedPackage.name;
            if (finalUserId) finalUserId.textContent = state.userDetails.userId;
            if (finalServer) finalServer.textContent = state.userDetails.server;
            if (finalPrice) finalPrice.textContent = `$${state.selectedPackage.price}`;

            goToStep(3);
        });
    }

    // Back to Step 1
    if (btnBackStep2) {
        btnBackStep2.addEventListener('click', function() {
            goToStep(1);
        });
    }

    // Back to Step 2
    if (btnBackStep3) {
        btnBackStep3.addEventListener('click', function() {
            goToStep(2);
        });
    }

    // Complete Purchase
    if (btnCompletePurchase) {
        btnCompletePurchase.addEventListener('click', function() {
            const paymentMethod = document.querySelector('input[name="payment"]:checked');

            if (!paymentMethod) {
                showNotification('Please select a payment method');
                return;
            }

            // Show processing
            this.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';
            this.disabled = true;

            setTimeout(() => {
                // Show success modal
                if (successModal) {
                    // Update success details
                    const successOrderId = document.getElementById('successOrderId');
                    const successCrystals = document.getElementById('successCrystals');

                    if (successOrderId) {
                        successOrderId.textContent = Math.floor(100000 + Math.random() * 900000);
                    }
                    if (successCrystals) {
                        successCrystals.textContent = state.selectedPackage.name;
                    }

                    successModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }

                // Reset button
                this.innerHTML = '<i class="bi bi-lock-fill"></i> Complete Purchase';
                this.disabled = false;
            }, 2000);
        });
    }

    // Close Success Modal
    if (btnCloseSuccess) {
        btnCloseSuccess.addEventListener('click', function() {
            if (successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Reset to step 1
            goToStep(1);

            // Reset form
            document.getElementById('userIdInput').value = '';
            document.getElementById('serverSelect').value = '';
            document.getElementById('emailInput').value = '';
        });
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
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Live Activity Feed Animation
    const activityFeed = document.getElementById('activityFeed');
    if (activityFeed) {
        const activities = [
            { name: 'Alex K.', location: 'Canada', package: '1,150 Crystals' },
            { name: 'Maria S.', location: 'Spain', package: '550 Crystals' },
            { name: 'David L.', location: 'Australia', package: '2,400 Crystals' },
            { name: 'Sophie T.', location: 'France', package: '330 Crystals' },
            { name: 'James W.', location: 'UK', package: '1,150 Crystals' }
        ];

        let activityIndex = 2;

        setInterval(() => {
            const activity = activities[activityIndex % activities.length];
            activityIndex++;

            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-avatar">
                    <i class="bi bi-person-circle"></i>
                </div>
                <div class="activity-text">
                    <strong>${activity.name}</strong> from ${activity.location} just purchased <strong>${activity.package}</strong>
                </div>
                <div class="activity-time">Just now</div>
            `;

            // Remove oldest if more than 2
            if (activityFeed.children.length >= 2) {
                activityFeed.removeChild(activityFeed.lastChild);
            }

            activityFeed.insertBefore(activityItem, activityFeed.firstChild);

            // Update times
            const timeElements = activityFeed.querySelectorAll('.activity-time');
            timeElements.forEach((el, i) => {
                if (i === 0) {
                    el.textContent = 'Just now';
                } else if (i === 1) {
                    el.textContent = '3m ago';
                } else {
                    el.textContent = '7m ago';
                }
            });
        }, 12000); // Every 12 seconds
    }

    // Input Formatting
    const userIdInput = document.getElementById('userIdInput');
    if (userIdInput) {
        userIdInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // Parallax Effect for Video
    window.addEventListener('scroll', function() {
        const video = document.querySelector('.bg-video');
        if (video) {
            const scrolled = window.pageYOffset;
            video.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
        }
    });

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

    console.log('Product Detail V3 initialized - Split Screen Immersive Layout');
})();
