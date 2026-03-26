// Product Detail V2 JavaScript

(function() {
    'use strict';

    // DOM Elements
    const mainImage = document.getElementById('pd2MainImage');
    const thumbnails = document.querySelectorAll('.pd2-thumb');
    const packageOptions = document.querySelectorAll('.package-option');
    const displayPrice = document.getElementById('displayPrice');
    const btnPrice = document.getElementById('btnPrice');
    const previewDiamonds = document.getElementById('previewDiamonds');
    const previewBonus = document.getElementById('previewBonus');
    const previewTotal = document.getElementById('previewTotal');
    const liveNotification = document.getElementById('liveNotification');
    const wishlistBtn = document.getElementById('wishlistBtn');

    // Image Gallery
    if (thumbnails && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const imageSrc = this.getAttribute('data-image');
                if (imageSrc) {
                    mainImage.src = imageSrc;

                    // Update active state
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    // Package Selection
    if (packageOptions) {
        packageOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active from all
                packageOptions.forEach(opt => opt.classList.remove('active'));

                // Add active to clicked
                this.classList.add('active');

                // Get data
                const price = this.getAttribute('data-price');
                const diamonds = this.getAttribute('data-diamonds');
                const bonus = this.getAttribute('data-bonus');

                // Update price displays
                if (displayPrice && btnPrice) {
                    displayPrice.textContent = `$${price}`;
                    btnPrice.textContent = `$${price}`;
                }

                // Update preview
                if (previewDiamonds && previewBonus && previewTotal) {
                    previewDiamonds.textContent = diamonds;
                    previewBonus.textContent = bonus;
                    const total = parseInt(diamonds) + parseInt(bonus);
                    previewTotal.textContent = total;
                }

                // Add animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }

    // Wishlist Toggle
    if (wishlistBtn) {
        let isWishlisted = false;
        wishlistBtn.addEventListener('click', function() {
            isWishlisted = !isWishlisted;
            const icon = this.querySelector('i');

            if (isWishlisted) {
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
                this.style.color = '#dc143c';
            } else {
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                this.style.color = '';
            }

            // Animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }

    // Live Purchase Notification
    if (liveNotification) {
        const names = [
            { name: 'Rajesh Kumar', initials: 'RK' },
            { name: 'Sita Sharma', initials: 'SS' },
            { name: 'Anil Thapa', initials: 'AT' },
            { name: 'Prabin Rai', initials: 'PR' },
            { name: 'Maya Gurung', initials: 'MG' }
        ];

        const packages = [
            '100 Diamonds',
            '500 Diamonds',
            '1,000 Diamonds',
            '2,500 Diamonds'
        ];

        function showLiveNotification() {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomPackage = packages[Math.floor(Math.random() * packages.length)];

            const avatar = liveNotification.querySelector('.notification-avatar');
            const nameElement = liveNotification.querySelector('.notification-text strong');
            const packageElement = liveNotification.querySelector('.notification-text span');

            avatar.textContent = randomName.initials;
            nameElement.textContent = randomName.name;
            packageElement.textContent = randomPackage;

            // Show notification
            liveNotification.classList.add('show');

            // Hide after 4 seconds
            setTimeout(() => {
                liveNotification.classList.remove('show');
            }, 4000);
        }

        // Show first notification after 3 seconds
        setTimeout(showLiveNotification, 3000);

        // Show notification every 15-25 seconds
        setInterval(() => {
            const randomDelay = 15000 + Math.random() * 10000;
            setTimeout(showLiveNotification, randomDelay);
        }, 25000);
    }

    // Buy Now Button
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const playerId = document.getElementById('pd2PlayerId');

            if (!playerId || !playerId.value.trim()) {
                alert('Please enter your Player ID');
                if (playerId) {
                    playerId.focus();
                    playerId.style.borderColor = '#dc143c';
                    setTimeout(() => {
                        playerId.style.borderColor = '';
                    }, 2000);
                }
                return;
            }

            // Get selected package
            const activePackage = document.querySelector('.package-option.active');
            if (activePackage) {
                const diamonds = activePackage.getAttribute('data-diamonds');
                const bonus = activePackage.getAttribute('data-bonus');
                const price = activePackage.getAttribute('data-price');

                console.log('Proceeding to checkout:', {
                    playerId: playerId.value,
                    diamonds: diamonds,
                    bonus: bonus,
                    price: price
                });

                // Here you would normally redirect to checkout page
                alert(`Proceeding to checkout\nPlayer ID: ${playerId.value}\nPackage: ${diamonds} + ${bonus} Diamonds\nPrice: $${price}`);
            }
        });
    }

    // Add to Cart Button
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const playerId = document.getElementById('pd2PlayerId');

            if (!playerId || !playerId.value.trim()) {
                alert('Please enter your Player ID');
                if (playerId) {
                    playerId.focus();
                }
                return;
            }

            // Animation
            this.innerHTML = '<i class="bi bi-check2"></i> Added!';
            this.style.background = 'rgba(16, 196, 10, 0.2)';
            this.style.borderColor = '#10c40a';
            this.style.color = '#10c40a';

            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-cart-plus"></i> Add to Cart';
                this.style.background = '';
                this.style.borderColor = '';
                this.style.color = '';
            }, 2000);

            console.log('Added to cart');
        });
    }

    // Share Button
    const shareBtn = document.querySelector('.pd2-share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Free Fire Diamonds - KUNYO',
                    text: 'Check out this amazing deal on Free Fire Diamonds!',
                    url: window.location.href
                }).then(() => {
                    console.log('Shared successfully');
                }).catch(err => {
                    console.log('Share failed:', err);
                    fallbackShare();
                });
            } else {
                fallbackShare();
            }
        });
    }

    function fallbackShare() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            alert('Unable to copy link. Please copy manually: ' + url);
        });
    }

    // Video Button
    const videoBtn = document.querySelector('.pd2-video-btn');
    if (videoBtn) {
        videoBtn.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            if (videoUrl) {
                // Create modal or open in new window
                // For demo, just log
                console.log('Opening video:', videoUrl);
                window.open(videoUrl, '_blank');
            }
        });
    }

    // Helpful Button Animation
    const helpfulBtns = document.querySelectorAll('.helpful-btn');
    if (helpfulBtns) {
        helpfulBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const textContent = this.textContent;
                const match = textContent.match(/\d+/);
                if (match) {
                    const count = parseInt(match[0]);
                    const newCount = count + 1;
                    this.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i> Helpful (${newCount})`;
                    this.style.color = '#10c40a';
                    this.disabled = true;
                }
            });
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Input Validation
    const playerIdInput = document.getElementById('pd2PlayerId');
    if (playerIdInput) {
        playerIdInput.addEventListener('input', function() {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // Mobile Menu (from main.js, ensure compatibility)
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

    console.log('Product Detail V2 initialized');
})();
