// ===================================
// KUNYO - Interactive Features
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // Hero Stack Grid Carousel
    // ===================================
    if (typeof $ !== 'undefined' && $.fn.owlCarousel) {
        $('.hero-stack-carousel').each(function() {
            var $carousel = $(this);

            var stackOwl = $carousel.owlCarousel({
                items: 1,
                loop: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                nav: false,
                dots: true,
                smartSpeed: 600,
                mouseDrag: true,
                touchDrag: true
            });

            // Progress bar animation
            stackOwl.on('translate.owl.carousel', function(event) {
                $carousel.find('.owl-dot').removeClass('animating');
            });

            stackOwl.on('translated.owl.carousel', function(event) {
                $carousel.find('.owl-dot').removeClass('animating');

                setTimeout(function() {
                    $carousel.find('.owl-dot.active').addClass('animating');
                }, 50);
            });

            // Initialize first dot animation
            setTimeout(function() {
                $carousel.find('.owl-dot.active').addClass('animating');
            }, 100);
        });
    }

    // ===================================
    // Categories Carousel
    // ===================================
    if (typeof $ !== 'undefined' && $.fn.owlCarousel) {
        $('.categories-carousel').owlCarousel({
            items: 8,
            loop: false,
            margin: 0,
            nav: true,
            dots: false,
            autoplay: false,
            responsive: {
                0: {
                    items: 3
                },
                576: {
                    items: 4
                },
                768: {
                    items: 5
                },
                992: {
                    items: 6
                },
                1200: {
                    items: 8
                }
            }
        });
    }

    // ===================================
    // Preferences Modal
    // ===================================
    let selectedCountry = 'us';
    let selectedFlag = 'https://flagcdn.com/w20/us.png';
    let selectedLanguage = 'en';
    let selectedLanguageName = 'English';
    let selectedCurrency = 'USD';
    let selectedCurrencyName = 'USD - US Dollar';
    let selectedCurrencySymbol = '$';

    // Country selection
    document.querySelectorAll('[data-country]').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all
            document.querySelectorAll('[data-country]').forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');

            selectedCountry = this.getAttribute('data-country');
            selectedFlag = this.getAttribute('data-flag');

            // Update the main button display
            const flagImg = this.querySelector('img');
            const countryText = this.querySelector('span').textContent;

            document.querySelector('.preference-option .preference-flag').src = selectedFlag;
            document.querySelector('.preference-option .preference-text').textContent = countryText;
        });
    });

    // Language selection
    document.querySelectorAll('[data-language]').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all
            document.querySelectorAll('[data-language]').forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');

            selectedLanguage = this.getAttribute('data-language');
            selectedLanguageName = this.getAttribute('data-language-name');

            // Update the main button display
            const languageButtons = document.querySelectorAll('.preference-option');
            languageButtons[1].querySelector('.preference-text').textContent = selectedLanguageName;
        });
    });

    // Currency selection
    document.querySelectorAll('[data-currency]').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all
            document.querySelectorAll('[data-currency]').forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');

            selectedCurrency = this.getAttribute('data-currency');
            selectedCurrencyName = this.getAttribute('data-currency-name');
            selectedCurrencySymbol = this.getAttribute('data-currency-symbol');

            // Update the main button display
            const currencyButtons = document.querySelectorAll('.preference-option');
            currencyButtons[2].querySelector('.preference-icon').textContent = selectedCurrencySymbol;
            currencyButtons[2].querySelector('.preference-text').textContent = selectedCurrencyName;
        });
    });

    // Save button - Update top bar
    document.querySelector('.preferences-save-btn').addEventListener('click', function() {
        // Update the top bar button
        document.getElementById('selectedFlag').src = selectedFlag;
        document.getElementById('selectedLanguage').textContent = selectedLanguage.toUpperCase();
        document.getElementById('selectedCurrency').textContent = selectedCurrency;

        // Store in localStorage for persistence
        localStorage.setItem('userPreferences', JSON.stringify({
            country: selectedCountry,
            flag: selectedFlag,
            language: selectedLanguage,
            languageName: selectedLanguageName,
            currency: selectedCurrency,
            currencyName: selectedCurrencyName,
            currencySymbol: selectedCurrencySymbol
        }));
    });

    // Load saved preferences on page load
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
        const prefs = JSON.parse(savedPreferences);
        selectedCountry = prefs.country;
        selectedFlag = prefs.flag;
        selectedLanguage = prefs.language;
        selectedLanguageName = prefs.languageName;
        selectedCurrency = prefs.currency;
        selectedCurrencyName = prefs.currencyName;
        selectedCurrencySymbol = prefs.currencySymbol;

        // Update top bar
        document.getElementById('selectedFlag').src = selectedFlag;
        document.getElementById('selectedLanguage').textContent = selectedLanguage.toUpperCase();
        document.getElementById('selectedCurrency').textContent = selectedCurrency;

        // Set active states
        document.querySelector(`[data-country="${selectedCountry}"]`)?.classList.add('active');
        document.querySelector(`[data-language="${selectedLanguage}"]`)?.classList.add('active');
        document.querySelector(`[data-currency="${selectedCurrency}"]`)?.classList.add('active');
    } else {
        // Set default active states
        document.querySelector('[data-country="us"]')?.classList.add('active');
        document.querySelector('[data-language="en"]')?.classList.add('active');
        document.querySelector('[data-currency="USD"]')?.classList.add('active');
    }

    // ===================================
    // Smooth Scroll for Navigation
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===================================
    // Intersection Observer for Fade-in Animations
    // ===================================
    // DISABLED FOR PERFORMANCE: Fade-in animations removed to prevent flickering during scroll
    // Elements now appear static without animations

    // const observerOptions = {
    //     threshold: 0.1,
    //     rootMargin: '0px 0px -50px 0px'
    // };

    // const observer = new IntersectionObserver(function(entries) {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             entry.target.style.opacity = '1';
    //             entry.target.style.transform = 'translateY(0)';
    //             observer.unobserve(entry.target);
    //         }
    //     });
    // }, observerOptions);

    // // Observe elements for animation
    // const animateElements = document.querySelectorAll(
    //     '.game-card, .step-card, .feature-card, .testimonial-card, .giftcard-card'
    // );

    // animateElements.forEach((el, index) => {
    //     el.style.opacity = '0';
    //     el.style.transform = 'translateY(30px)';
    //     el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    //     observer.observe(el);
    // });


    // ===================================
    // Game Card Tilt Effect (Optional)
    // ===================================
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });

    // ===================================
    // Copy to Clipboard (for future use)
    // ===================================
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        });
    }

    // ===================================
    // Show Notification (for future use)
    // ===================================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }


    // ===================================
    // Testimonials Carousel
    // ===================================
    if (typeof $ !== 'undefined' && $.fn.owlCarousel) {
        var testimonialsOwl = $('.testimonials-carousel').owlCarousel({
            items: 1,
            loop: true,
            center: true,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: false,
            nav: true,
            dots: true,
            stagePadding: 100,
            touchDrag: true,
            mouseDrag: true,
            responsive: {
                0: {
                    stagePadding: 30,
                    margin: 5
                },
                768: {
                    stagePadding: 80,
                    margin: 10
                },
                1024: {
                    stagePadding: 130,
                    margin: 10
                }
            }
        });

        // Progress bar animation
        testimonialsOwl.on('translate.owl.carousel', function(event) {
            $('.testimonials-carousel .owl-dot').each(function() {
                $(this).removeClass('animating');
            });
        });

        testimonialsOwl.on('translated.owl.carousel', function(event) {
            $('.testimonials-carousel .owl-dot').each(function() {
                $(this).removeClass('animating');
            });

            setTimeout(function() {
                $('.testimonials-carousel .owl-dot.active').addClass('animating');
            }, 50);
        });

        // Initialize first dot animation
        setTimeout(function() {
            $('.testimonials-carousel .owl-dot.active').addClass('animating');
        }, 100);

        // Handle conditional nav button display
        $('.testimonials-carousel').on('mousemove', function(e) {
            var carouselWidth = $(this).width();
            var mouseX = e.pageX - $(this).offset().left;

            if (mouseX < carouselWidth / 2) {
                $(this).removeClass('hover-right').addClass('hover-left');
            } else {
                $(this).removeClass('hover-left').addClass('hover-right');
            }
        });

        $('.testimonials-carousel').on('mouseleave', function() {
            $(this).removeClass('hover-left hover-right');
        });
    }

    // ===================================
    // Lazy Load Images (if needed)
    // ===================================
    // DISABLED FOR PERFORMANCE: Lazy loading removed for better scroll performance
    // Images now load immediately

    // if ('IntersectionObserver' in window) {
    //     const imageObserver = new IntersectionObserver((entries, observer) => {
    //         entries.forEach(entry => {
    //             if (entry.isIntersecting) {
    //                 const img = entry.target;
    //                 if (img.dataset.src) {
    //                     img.src = img.dataset.src;
    //                     img.removeAttribute('data-src');
    //                     observer.unobserve(img);
    //                 }
    //             }
    //         });
    //     });

    //     document.querySelectorAll('img[data-src]').forEach(img => {
    //         imageObserver.observe(img);
    //     });
    // }

    // ===================================
    // Add to Cart Animation (for future product pages)
    // ===================================
    window.addToCartAnimation = function(button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Added!</span>
        `;
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    };

    // ===================================
    // Console Welcome Message
    // ===================================
    console.log('%cKUNYO', 'color: #DC143C; font-size: 48px; font-weight: bold;');
    console.log('%cNepal\'s #1 Gaming Store', 'color: #003893; font-size: 16px;');
    console.log('%cBuilt with ❤️ for gamers', 'color: #B4B8C5; font-size: 14px;');
});

// ===================================
// Export functions for use in other scripts
// ===================================
window.KUNYO = {
    showNotification: function(message, type) {
        // Implementation in the showNotification function above
    },
    copyToClipboard: function(text) {
        // Implementation in the copyToClipboard function above
    }
};
