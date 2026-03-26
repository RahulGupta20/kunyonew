// Product Detail Enhanced JavaScript

(function() {
    'use strict';

    // State
    const state = {
        selectedMethod: 'uid',
        selectedPrice: 250,
        selectedPackage: 'Weekly'
    };

    // DOM Elements
    const methodTabs = document.querySelectorAll('.method-tab');
    const methodContents = document.querySelectorAll('.method-content');
    const priceCards = document.querySelectorAll('.price-card-enhanced');
    const totalPrice = document.getElementById('totalPrice');
    const btnShare = document.getElementById('btnShare');
    const shareModal = document.getElementById('shareModal');
    const btnCloseShare = document.getElementById('btnCloseShare');
    const shareOverlay = document.getElementById('shareOverlay');
    const btnCopyLink = document.getElementById('btnCopyLink');
    const shareButtons = document.querySelectorAll('.share-btn');

    // Initialize
    function init() {
        attachEventListeners();
    }

    // Event Listeners
    function attachEventListeners() {
        // Method Tabs
        methodTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const method = this.getAttribute('data-method');
                switchMethod(method);
            });
        });

        // Price Cards
        priceCards.forEach(card => {
            card.addEventListener('click', function() {
                selectPriceCard(this);
            });
        });

        // Share Button
        if (btnShare) {
            btnShare.addEventListener('click', openShareModal);
        }

        if (btnCloseShare) {
            btnCloseShare.addEventListener('click', closeShareModal);
        }

        if (shareOverlay) {
            shareOverlay.addEventListener('click', closeShareModal);
        }

        // Copy Link
        if (btnCopyLink) {
            btnCopyLink.addEventListener('click', copyShareLink);
        }

        // Share Buttons
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                shareOnPlatform(platform);
            });
        });

        // Image Gallery
        window.changeImage = function(thumbnail, imageSrc) {
            const mainImg = document.getElementById('mainProductImg');
            if (mainImg) {
                mainImg.src = imageSrc;
            }
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        };
    }

    // Switch Method
    function switchMethod(method) {
        state.selectedMethod = method;

        // Update tabs
        methodTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-method') === method) {
                tab.classList.add('active');
            }
        });

        // Update content
        methodContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `method-${method}`) {
                content.classList.add('active');
            }
        });
    }

    // Select Price Card
    function selectPriceCard(card) {
        // Remove previous selection
        priceCards.forEach(c => c.classList.remove('selected'));

        // Add selection
        card.classList.add('selected');

        // Extract price
        const priceText = card.querySelector('.price-value')?.textContent || 'Rs. 0';
        const priceMatch = priceText.match(/[\d.]+/);
        if (priceMatch) {
            state.selectedPrice = parseFloat(priceMatch[0]);
        }

        // Extract package name
        state.selectedPackage = card.querySelector('.price-amount')?.textContent || 'Package';

        // Update total
        updateTotalPrice();
    }

    // Update Total Price
    function updateTotalPrice() {
        if (totalPrice) {
            totalPrice.textContent = `Rs. ${state.selectedPrice.toFixed(2)}`;
        }
    }

    // Open Share Modal
    function openShareModal() {
        if (shareModal) {
            shareModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close Share Modal
    function closeShareModal() {
        if (shareModal) {
            shareModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Copy Share Link
    function copyShareLink() {
        const shareLink = document.getElementById('shareLink');
        if (shareLink) {
            shareLink.select();
            document.execCommand('copy');

            // Show feedback
            const btn = btnCopyLink;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }
    }

    // Share on Platform
    function shareOnPlatform(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('Check out this Free Fire Diamonds top-up on KUNYO Gaming!');

        let shareUrl;

        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // Mobile Menu
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

    console.log('Product Detail Enhanced initialized');
})();
