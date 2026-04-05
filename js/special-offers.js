// SPECIAL OFFERS PAGE JAVASCRIPT
document.addEventListener('DOMContentLoaded', function() {

    // Copy Promo Code
    const copyButtons = document.querySelectorAll('.btn-copy-code, .btn-copy-referral');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-check-circle-fill"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 2000);
            });
        });
    });

    // Apply Promo Code
    const applyButtons = document.querySelectorAll('.btn-apply-code');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            sessionStorage.setItem('appliedPromoCode', code);
            alert(`Promo code "${code}" will be applied at checkout!`);
        });
    });

    // Newsletter Subscription
    const subscribeBtn = document.getElementById('btnSubscribe');
    const newsletterEmail = document.getElementById('newsletterEmail');
    
    if (subscribeBtn && newsletterEmail) {
        subscribeBtn.addEventListener('click', function() {
            const email = newsletterEmail.value.trim();
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            alert('Successfully subscribed! Check your email for your 15% OFF code.');
            newsletterEmail.value = '';
        });
    }

    // Bootstrap handles FAQ accordion automatically
    // No custom FAQ JavaScript needed - Bootstrap's data-bs-toggle="collapse" handles it

    // Bootstrap handles tab switching automatically
    // No custom tab JavaScript needed - Bootstrap's data-bs-toggle="tab" handles it

    // Bundle Buttons - Add to Cart
    const bundleButtons = document.querySelectorAll('.btn-get-bundle');
    bundleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bundleName = this.closest('.bundle-card').querySelector('.bundle-title').textContent;
            alert(`"${bundleName}" will be added to your cart!`);
            // Here you would typically call your cart add function
        });
    });

    // Seasonal Offer Buttons
    const seasonalButtons = document.querySelectorAll('.btn-view-seasonal');
    seasonalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const offerTitle = this.closest('.seasonal-card').querySelector('.seasonal-title').textContent;
            alert(`Redirecting to "${offerTitle}"...`);
            // Here you would typically redirect to the relevant page
        });
    });

    // Join Loyalty Program
    const loyaltyButton = document.querySelector('.btn-join-loyalty');
    if (loyaltyButton) {
        loyaltyButton.addEventListener('click', function() {
            alert('Loyalty program enrollment coming soon! You will be redirected to sign up page.');
            // Here you would typically redirect to signup/login page
        });
    }

    // Limited Edition Claim Buttons
    const limitedButtons = document.querySelectorAll('.btn-claim-limited');
    limitedButtons.forEach(button => {
        button.addEventListener('click', function() {
            const limitedCard = this.closest('.limited-card');
            const itemName = limitedCard.querySelector('.limited-title').textContent;
            const stockText = limitedCard.querySelector('.stock-text')?.textContent || '';
            const badgeText = limitedCard.querySelector('.limited-badge span')?.textContent || '';

            // Check if sold out
            if (stockText.includes('Sold Out') || stockText.includes('0%') || badgeText.includes('Sold Out')) {
                alert('Sorry, this item is sold out!');
            } else {
                const price = limitedCard.querySelector('.price-value').textContent;
                alert(`"${itemName}" (${price}) will be added to your cart!`);
                // Here you would typically call your cart add function
                // Example: addToCart(itemId, itemName, price);
            }
        });
    });

    // Share Referral Code
    const shareReferralBtn = document.querySelector('.btn-share-referral');
    if (shareReferralBtn) {
        shareReferralBtn.addEventListener('click', function() {
            const referralCode = document.querySelector('.referral-code-display')?.textContent || 'KUNYO2024';
            const shareText = `Join KUNYO and use my referral code ${referralCode} to get exclusive rewards!`;

            if (navigator.share) {
                navigator.share({
                    title: 'Join KUNYO',
                    text: shareText,
                    url: window.location.origin
                }).catch(() => {
                    // Fallback if sharing fails
                    navigator.clipboard.writeText(shareText);
                    alert('Referral message copied to clipboard!');
                });
            } else {
                navigator.clipboard.writeText(shareText);
                alert('Referral message copied to clipboard!');
            }
        });
    }

    console.log('Special Offers page loaded successfully!');
});
