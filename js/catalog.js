// Catalog Page JavaScript

(function() {
    'use strict';

    // State Management
    const state = {
        view: 'grid',
        searchQuery: '',
        selectedCategories: ['all'],
        selectedPlatforms: [],
        selectedDelivery: [],
        selectedPopularity: 'all',
        minPrice: 0,
        maxPrice: 500,
        sortBy: 'popular'
    };

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const platformCheckboxes = document.querySelectorAll('input[name="platform"]');
    const deliveryCheckboxes = document.querySelectorAll('input[name="delivery"]');
    const popularityRadios = document.querySelectorAll('input[name="popularity"]');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const priceSlider = document.getElementById('priceSlider');
    const priceMinDisplay = document.getElementById('priceMin');
    const priceMaxDisplay = document.getElementById('priceMax');

    const sortSelect = document.getElementById('sortSelect');
    const viewButtons = document.querySelectorAll('.btn-view');
    const productsGrid = document.getElementById('productsGrid');
    const productCards = document.querySelectorAll('.product-card');
    const resultsCount = document.getElementById('resultsCount');
    const selectedCategory = document.getElementById('selectedCategory');
    const noResults = document.getElementById('noResults');
    const paginationWrapper = document.querySelector('.pagination-wrapper');

    const btnClearFilters = document.getElementById('btnClearFilters');
    const btnResetFilters = document.getElementById('btnResetFilters');
    const btnFilterToggle = document.getElementById('btnFilterToggle');
    const btnCloseFilters = document.getElementById('btnCloseFilters');
    const filtersContainer = document.getElementById('filtersContainer');

    // Quick View Modal
    const quickViewModal = document.getElementById('quickViewModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');

    // Favorite Buttons
    const favoriteButtons = document.querySelectorAll('.btn-favorite');

    // Initialize
    function init() {
        attachEventListeners();
        updatePriceDisplay();
    }

    // Event Listeners
    function attachEventListeners() {
        // Search
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        // Category Filters
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.value === 'all') {
                    // If "All" is checked, uncheck others
                    if (this.checked) {
                        categoryCheckboxes.forEach(cb => {
                            if (cb.value !== 'all') cb.checked = false;
                        });
                        state.selectedCategories = ['all'];
                    }
                } else {
                    // If any specific category is checked, uncheck "All"
                    const allCheckbox = document.querySelector('input[name="category"][value="all"]');
                    if (allCheckbox) allCheckbox.checked = false;

                    updateSelectedCategories();
                }
                applyFilters();
                hideFiltersOnMobile();
            });
        });

        // Platform Filters
        platformCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectedPlatforms();
                applyFilters();
                hideFiltersOnMobile();
            });
        });

        // Delivery Filters
        deliveryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectedDelivery();
                applyFilters();
                hideFiltersOnMobile();
            });
        });

        // Popularity Filters
        popularityRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                state.selectedPopularity = this.value;
                applyFilters();
                hideFiltersOnMobile();
            });
        });

        // Price Range
        if (minPriceInput) {
            minPriceInput.addEventListener('input', function() {
                state.minPrice = parseInt(this.value) || 0;
                if (priceSlider) priceSlider.value = state.maxPrice;
                updatePriceDisplay();
                applyFilters();
            });
        }

        if (maxPriceInput) {
            maxPriceInput.addEventListener('input', function() {
                state.maxPrice = parseInt(this.value) || 500;
                if (priceSlider) priceSlider.value = state.maxPrice;
                updatePriceDisplay();
                applyFilters();
            });
        }

        if (priceSlider) {
            priceSlider.addEventListener('input', function() {
                state.maxPrice = parseInt(this.value);
                if (maxPriceInput) maxPriceInput.value = state.maxPrice;
                updatePriceDisplay();
            });

            priceSlider.addEventListener('change', function() {
                applyFilters();
            });
        }

        // Sort
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                state.sortBy = this.value;
                sortProducts();
            });
        }

        // View Toggle
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                switchView(view);
            });
        });

        // Clear Filters
        if (btnClearFilters) {
            btnClearFilters.addEventListener('click', clearFilters);
        }

        if (btnResetFilters) {
            btnResetFilters.addEventListener('click', clearFilters);
        }

        // Mobile Filter Toggle
        if (btnFilterToggle) {
            btnFilterToggle.addEventListener('click', function() {
                filtersContainer?.classList.add('show');
            });
        }

        if (btnCloseFilters) {
            btnCloseFilters.addEventListener('click', function() {
                filtersContainer?.classList.remove('show');
            });
        }

        // Close filters when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && filtersContainer?.classList.contains('show')) {
                // Check if click is outside filters container and not on the toggle button
                if (!filtersContainer.contains(e.target) && !btnFilterToggle?.contains(e.target)) {
                    filtersContainer.classList.remove('show');
                }
            }
        });

        // Quick View Modal
        quickViewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const gameId = this.getAttribute('data-game');
                openQuickView(gameId);
            });
        });

        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', closeQuickView);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeQuickView);
        }

        // Favorite Buttons
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('active');
            });
        });
    }

    // Search Handler
    function handleSearch() {
        state.searchQuery = searchInput.value.toLowerCase().trim();
        applyFilters();
    }

    // Update Selected Categories
    function updateSelectedCategories() {
        state.selectedCategories = [];
        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                state.selectedCategories.push(checkbox.value);
            }
        });

        // If no categories selected, select all
        if (state.selectedCategories.length === 0) {
            state.selectedCategories = ['all'];
            const allCheckbox = document.querySelector('input[name="category"][value="all"]');
            if (allCheckbox) allCheckbox.checked = true;
        }
    }

    // Update Selected Platforms
    function updateSelectedPlatforms() {
        state.selectedPlatforms = [];
        platformCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                state.selectedPlatforms.push(checkbox.value);
            }
        });
    }

    // Update Selected Delivery
    function updateSelectedDelivery() {
        state.selectedDelivery = [];
        deliveryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                state.selectedDelivery.push(checkbox.value);
            }
        });
    }

    // Update Price Display
    function updatePriceDisplay() {
        if (priceMinDisplay) priceMinDisplay.textContent = state.minPrice;
        if (priceMaxDisplay) priceMaxDisplay.textContent = state.maxPrice;
    }

    // Apply Filters
    function applyFilters() {
        let visibleCount = 0;

        productCards.forEach(card => {
            let isVisible = true;

            // Search Filter
            if (state.searchQuery) {
                const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';

                if (!title.includes(state.searchQuery) && !description.includes(state.searchQuery)) {
                    isVisible = false;
                }
            }

            // Category Filter
            if (!state.selectedCategories.includes('all')) {
                const cardCategory = card.getAttribute('data-category');
                if (!state.selectedCategories.includes(cardCategory)) {
                    isVisible = false;
                }
            }

            // Platform Filter
            if (state.selectedPlatforms.length > 0) {
                const cardPlatforms = card.getAttribute('data-platform')?.split(',') || [];
                const hasMatchingPlatform = cardPlatforms.some(platform =>
                    state.selectedPlatforms.includes(platform.trim())
                );
                if (!hasMatchingPlatform) {
                    isVisible = false;
                }
            }

            // Delivery Filter
            if (state.selectedDelivery.length > 0) {
                const cardDelivery = card.getAttribute('data-delivery');
                if (!state.selectedDelivery.includes(cardDelivery)) {
                    isVisible = false;
                }
            }

            // Popularity Filter
            if (state.selectedPopularity !== 'all') {
                const cardPopularity = card.getAttribute('data-popularity');
                if (cardPopularity !== state.selectedPopularity) {
                    isVisible = false;
                }
            }

            // Price Filter
            const cardPrice = parseInt(card.getAttribute('data-price')) || 0;
            if (cardPrice < state.minPrice || cardPrice > state.maxPrice) {
                isVisible = false;
            }

            // Show/Hide Card
            if (isVisible) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update Results Count
        if (resultsCount) {
            resultsCount.textContent = visibleCount;
        }

        // Update Selected Category Label
        updateSelectedCategoryLabel();

        // Show/Hide No Results
        if (noResults) {
            if (visibleCount === 0) {
                noResults.style.display = 'block';
                if (productsGrid) productsGrid.style.display = 'none';
                if (paginationWrapper) paginationWrapper.style.display = 'none';
            } else {
                noResults.style.display = 'none';
                if (productsGrid) productsGrid.style.display = '';
                if (paginationWrapper) paginationWrapper.style.display = '';
            }
        }

        // Sort after filtering
        sortProducts();
    }

    // Update Selected Category Label
    function updateSelectedCategoryLabel() {
        if (!selectedCategory) return;

        // Check if "All" is selected
        if (state.selectedCategories.includes('all') || state.selectedCategories.length === 0) {
            selectedCategory.textContent = 'All Categories';
            return;
        }

        // Get all checked categories (excluding "all")
        const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .filter(cb => cb.value !== 'all');

        if (checkedCategories.length === 0) {
            selectedCategory.textContent = 'All Categories';
        } else if (checkedCategories.length === 1) {
            // Single category selected
            const categoryLabel = checkedCategories[0].parentElement.querySelector('span').textContent;
            selectedCategory.textContent = categoryLabel;
        } else {
            // Multiple categories selected - show first + count
            const firstLabel = checkedCategories[0].parentElement.querySelector('span').textContent;
            const remainingCount = checkedCategories.length - 1;
            selectedCategory.textContent = `${firstLabel} +${remainingCount} more`;
        }
    }

    // Sort Products
    function sortProducts() {
        const cardsArray = Array.from(productCards);
        const visibleCards = cardsArray.filter(card => card.style.display !== 'none');

        visibleCards.sort((a, b) => {
            switch (state.sortBy) {
                case 'name-asc':
                    const nameA = a.querySelector('.product-title')?.textContent || '';
                    const nameB = b.querySelector('.product-title')?.textContent || '';
                    return nameA.localeCompare(nameB);

                case 'name-desc':
                    const nameA2 = a.querySelector('.product-title')?.textContent || '';
                    const nameB2 = b.querySelector('.product-title')?.textContent || '';
                    return nameB2.localeCompare(nameA2);

                case 'price-low':
                    const priceA = parseInt(a.getAttribute('data-price')) || 0;
                    const priceB = parseInt(b.getAttribute('data-price')) || 0;
                    return priceA - priceB;

                case 'price-high':
                    const priceA2 = parseInt(a.getAttribute('data-price')) || 0;
                    const priceB2 = parseInt(b.getAttribute('data-price')) || 0;
                    return priceB2 - priceA2;

                case 'newest':
                    // Could use data-date attribute if available
                    return 0;

                case 'popular':
                default:
                    // Keep original order
                    return 0;
            }
        });

        // Re-append sorted cards
        visibleCards.forEach(card => {
            if (productsGrid) {
                productsGrid.appendChild(card);
            }
        });
    }

    // Switch View
    function switchView(view) {
        state.view = view;

        viewButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view') === view) {
                btn.classList.add('active');
            }
        });

        if (productsGrid) {
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        }
    }

    // Clear Filters
    function clearFilters() {
        // Reset state
        state.searchQuery = '';
        state.selectedCategories = ['all'];
        state.selectedPlatforms = [];
        state.selectedDelivery = [];
        state.selectedPopularity = 'all';
        state.minPrice = 0;
        state.maxPrice = 500;
        state.sortBy = 'popular';

        // Reset inputs
        if (searchInput) searchInput.value = '';

        categoryCheckboxes.forEach(cb => {
            cb.checked = cb.value === 'all';
        });

        platformCheckboxes.forEach(cb => {
            cb.checked = false;
        });

        deliveryCheckboxes.forEach(cb => {
            cb.checked = false;
        });

        popularityRadios.forEach(radio => {
            radio.checked = radio.value === 'all';
        });

        if (minPriceInput) minPriceInput.value = 0;
        if (maxPriceInput) maxPriceInput.value = 500;
        if (priceSlider) priceSlider.value = 500;

        if (sortSelect) sortSelect.value = 'popular';

        updatePriceDisplay();
        applyFilters();

        // Close filters on mobile
        filtersContainer?.classList.remove('show');
    }

    // Quick View Modal
    function openQuickView(gameId) {
        // Mock data - in real app, fetch from API or data attribute
        const gameData = {
            'mobile-legends': {
                title: 'Mobile Legends',
                image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
                platform: 'Mobile',
                rating: '4.8',
                reviewCount: '2.3k',
                description: 'Mobile Legends: Bang Bang is a mobile multiplayer online battle arena (MOBA) game. Top-up Diamonds instantly and unlock exclusive heroes, skins, and battle passes.',
                price: '$0.99',
                link: 'product-detail.html'
            },
            'genshin-impact': {
                title: 'Genshin Impact',
                image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=300&fit=crop',
                platform: 'Mobile, PC',
                rating: '4.9',
                reviewCount: '5.1k',
                description: 'Genshin Impact is an open-world action RPG. Get Genesis Crystals to wish for new characters, weapons, and resources.',
                price: '$0.99',
                link: 'product-detail-2.html'
            },
            'pubg-mobile': {
                title: 'PUBG Mobile',
                image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
                platform: 'Mobile',
                rating: '4.7',
                reviewCount: '3.8k',
                description: 'PUBG Mobile is a battle royale shooter game. Purchase UC (Unknown Cash) to get exclusive items, skins, and the Royale Pass.',
                price: '$0.99',
                link: 'product-detail-3.html'
            },
            'free-fire': {
                title: 'Free Fire',
                image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
                platform: 'Mobile',
                rating: '4.6',
                reviewCount: '4.2k',
                description: 'Free Fire MAX is a battle royale game. Top-up Diamonds to unlock characters, pets, weapon skins, and exclusive bundles.',
                price: '$0.99',
                link: 'product-detail.html'
            },
            'valorant': {
                title: 'Valorant',
                image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=300&fit=crop',
                platform: 'PC',
                rating: '4.8',
                reviewCount: '2.9k',
                description: 'Valorant is a tactical FPS game. Purchase Valorant Points (VP) to get premium weapon skins, agents, and battle pass.',
                price: '$4.99',
                link: 'product-detail.html'
            },
            'honkai-star-rail': {
                title: 'Honkai: Star Rail',
                image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
                platform: 'Mobile, PC',
                rating: '4.9',
                reviewCount: '1.2k',
                description: 'Honkai: Star Rail is a space fantasy RPG. Get Oneiric Shards to wish for new characters and light cones.',
                price: '$0.99',
                link: 'product-detail.html'
            }
        };

        const data = gameData[gameId];
        if (!data) return;

        // Update modal content
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalPlatform = document.getElementById('modalPlatform');
        const modalRating = document.getElementById('modalRating');
        const modalReviewCount = document.getElementById('modalReviewCount');
        const modalDescription = document.getElementById('modalDescription');
        const modalPrice = document.getElementById('modalPrice');
        const modalBuyButton = document.getElementById('modalBuyButton');

        if (modalImage) {
            modalImage.src = data.image;
            modalImage.alt = data.title;
        }
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalPlatform) modalPlatform.textContent = data.platform;
        if (modalRating) modalRating.textContent = data.rating;
        if (modalReviewCount) modalReviewCount.textContent = data.reviewCount;
        if (modalDescription) modalDescription.textContent = data.description;
        if (modalPrice) modalPrice.textContent = data.price;
        if (modalBuyButton) modalBuyButton.href = data.link;

        // Show modal
        if (quickViewModal) {
            quickViewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeQuickView() {
        if (quickViewModal) {
            quickViewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
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

    // Hide Filters on Mobile after interaction
    function hideFiltersOnMobile() {
        // Check if on mobile (window width < 768px for md breakpoint)
        if (window.innerWidth < 768) {
            filtersContainer?.classList.remove('show');
        }
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

    console.log('Catalog page initialized');
})();
