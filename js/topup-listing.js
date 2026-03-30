// ============================================
// TOPUP LISTING PAGE - JAVASCRIPT
// International UX Standards Implementation
// ============================================

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const state = {
        brands: [],
        filteredBrands: [],
        currentCategory: 'all',
        currentSort: 'popular',
        favorites: JSON.parse(localStorage.getItem('kunyo_favorites') || '[]'),
        recentSearches: JSON.parse(localStorage.getItem('kunyo_recent_searches') || '[]'),
        displayedCount: 20,
        isLoading: false,
        searchTimeout: null
    };

    // ============================================
    // MOCK DATA (Replace with API calls)
    // ============================================
    const mockBrands = [
        {
            id: 'freefire',
            name: 'Free Fire',
            category: 'mobile-game',
            logo: 'https://via.placeholder.com/120x120/DC143C/FFFFFF?text=FF',
            rating: 4.8,
            soldCount: '152K+',
            badges: ['hot'],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'mobile-legends',
            name: 'Mobile Legends',
            category: 'mobile-game',
            logo: 'https://via.placeholder.com/120x120/003893/FFFFFF?text=ML',
            rating: 4.7,
            soldCount: '98K+',
            badges: ['hot'],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'pubg-mobile',
            name: 'PUBG Mobile',
            category: 'mobile-game',
            logo: 'https://via.placeholder.com/120x120/FF6B35/FFFFFF?text=PUBG',
            rating: 4.9,
            soldCount: '210K+',
            badges: ['hot'],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'genshin-impact',
            name: 'Genshin Impact',
            category: 'mobile-game',
            logo: 'https://via.placeholder.com/120x120/9333EA/FFFFFF?text=GI',
            rating: 4.6,
            soldCount: '45K+',
            badges: ['new'],
            isNew: true,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'cod-mobile',
            name: 'Call of Duty Mobile',
            category: 'mobile-game',
            logo: 'https://via.placeholder.com/120x120/000000/FFFFFF?text=COD',
            rating: 4.5,
            soldCount: '67K+',
            badges: [],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'valorant',
            name: 'Valorant',
            category: 'pc-game',
            logo: 'https://via.placeholder.com/120x120/FF4655/FFFFFF?text=VAL',
            rating: 4.8,
            soldCount: '89K+',
            badges: ['hot'],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'league-of-legends',
            name: 'League of Legends',
            category: 'pc-game',
            logo: 'https://via.placeholder.com/120x120/0AC8B9/FFFFFF?text=LOL',
            rating: 4.7,
            soldCount: '124K+',
            badges: [],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'steam-wallet',
            name: 'Steam Wallet',
            category: 'direct-topup',
            logo: 'https://via.placeholder.com/120x120/171A21/FFFFFF?text=Steam',
            rating: 4.9,
            soldCount: '340K+',
            badges: ['hot'],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'playstation-store',
            name: 'PlayStation Store',
            category: 'direct-topup',
            logo: 'https://via.placeholder.com/120x120/003791/FFFFFF?text=PS',
            rating: 4.8,
            soldCount: '156K+',
            badges: [],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'xbox-store',
            name: 'Xbox Store',
            category: 'direct-topup',
            logo: 'https://via.placeholder.com/120x120/107C10/FFFFFF?text=Xbox',
            rating: 4.7,
            soldCount: '89K+',
            badges: [],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'google-play',
            name: 'Google Play Gift Card',
            category: 'gift-cards',
            logo: 'https://via.placeholder.com/120x120/01875F/FFFFFF?text=GP',
            rating: 4.9,
            soldCount: '267K+',
            badges: ['hot'],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        },
        {
            id: 'apple-gift-card',
            name: 'Apple Gift Card',
            category: 'gift-cards',
            logo: 'https://via.placeholder.com/120x120/000000/FFFFFF?text=Apple',
            rating: 4.8,
            soldCount: '198K+',
            badges: [],
            isNew: false,
            isSale: false,
            url: 'topup-v2.html'
        }
    ];

    const trendingSearches = ['Freefire', 'Mobile Legends', 'PUBG Mobile', 'Steam Wallet'];

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const elements = {
        // Search
        searchInput: document.getElementById('mainSearchInput'),
        searchSuggestions: document.getElementById('searchSuggestions'),
        trendingSection: document.getElementById('trendingSection'),
        trendingItems: document.getElementById('trendingItems'),
        recentSection: document.getElementById('recentSection'),
        recentItems: document.getElementById('recentItems'),
        resultsSection: document.getElementById('resultsSection'),
        searchResults: document.getElementById('searchResults'),
        noResults: document.getElementById('noResults'),
        clearRecent: document.getElementById('clearRecent'),

        // Categories
        categoryTabs: document.querySelectorAll('.category-tab'),

        // Sort & Filter
        sortBtn: document.getElementById('sortBtn'),
        sortMenu: document.getElementById('sortMenu'),
        sortOptions: document.querySelectorAll('.sort-option'),
        sortLabel: document.getElementById('sortLabel'),
        filterBtn: document.getElementById('filterBtn'),
        filterModal: document.getElementById('filterModal'),
        closeFilterModal: document.getElementById('closeFilterModal'),
        applyFilters: document.getElementById('applyFilters'),
        clearFilters: document.getElementById('clearFilters'),

        // Grid
        skeletonGrid: document.getElementById('skeletonGrid'),
        brandGrid: document.getElementById('brandGrid'),
        emptyState: document.getElementById('emptyState'),
        resetFilters: document.getElementById('resetFilters'),

        // Load More
        loadMoreContainer: document.getElementById('loadMoreContainer'),
        loadMoreBtn: document.getElementById('loadMoreBtn'),

        // Back to Top
        backToTop: document.getElementById('backToTop'),

        // Favorites
        favoritesBtn: document.getElementById('favoritesBtn'),
        favoritesCount: document.getElementById('favoritesCount'),
        favoritesModal: document.getElementById('favoritesModal'),
        closeFavoritesModal: document.getElementById('closeFavoritesModal'),
        favoritesModalBody: document.getElementById('favoritesModalBody')
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Simulate API loading
        setTimeout(() => {
            state.brands = [...mockBrands];
            state.filteredBrands = [...mockBrands];
            renderBrands();
            hideSkeletonGrid();
        }, 1000);

        attachEventListeners();
        updateFavoritesCount();
        initKeyboardNavigation();
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    function attachEventListeners() {
        // Search
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', handleSearchInput);
            elements.searchInput.addEventListener('focus', showSearchSuggestions);
        }

        if (elements.clearRecent) {
            elements.clearRecent.addEventListener('click', clearRecentSearches);
        }

        // Categories
        elements.categoryTabs.forEach(tab => {
            tab.addEventListener('click', handleCategoryChange);
        });

        // Sort
        if (elements.sortBtn) {
            elements.sortBtn.addEventListener('click', toggleSortMenu);
        }

        elements.sortOptions.forEach(option => {
            option.addEventListener('click', handleSortChange);
        });

        // Filter
        if (elements.filterBtn) {
            elements.filterBtn.addEventListener('click', openFilterModal);
        }

        if (elements.closeFilterModal) {
            elements.closeFilterModal.addEventListener('click', closeFilterModal);
        }

        if (elements.applyFilters) {
            elements.applyFilters.addEventListener('click', applyFilterChanges);
        }

        if (elements.clearFilters) {
            elements.clearFilters.addEventListener('click', clearAllFilters);
        }

        // Reset Filters
        if (elements.resetFilters) {
            elements.resetFilters.addEventListener('click', resetAllFilters);
        }

        // Load More
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.addEventListener('click', loadMoreBrands);
        }

        // Back to Top
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', scrollToTop);
        }

        // Favorites
        if (elements.favoritesBtn) {
            elements.favoritesBtn.addEventListener('click', openFavoritesModal);
        }

        if (elements.closeFavoritesModal) {
            elements.closeFavoritesModal.addEventListener('click', closeFavoritesModal);
        }

        // Close modals on overlay click
        if (elements.filterModal) {
            elements.filterModal.querySelector('.filter-modal-overlay')?.addEventListener('click', closeFilterModal);
        }

        if (elements.favoritesModal) {
            elements.favoritesModal.querySelector('.favorites-modal-overlay')?.addEventListener('click', closeFavoritesModal);
        }

        // Click outside to close
        document.addEventListener('click', handleOutsideClick);

        // Scroll events
        window.addEventListener('scroll', handleScroll);
    }

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    function handleSearchInput(e) {
        const query = e.target.value.trim();

        clearTimeout(state.searchTimeout);

        if (query.length === 0) {
            showTrendingAndRecent();
            return;
        }

        // Debounce search
        state.searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    }

    function performSearch(query) {
        const results = state.brands.filter(brand =>
            brand.name.toLowerCase().includes(query.toLowerCase())
        );

        displaySearchResults(results, query);
    }

    function displaySearchResults(results, query) {
        elements.trendingSection.style.display = 'none';
        elements.recentSection.style.display = 'none';

        if (results.length === 0) {
            elements.resultsSection.style.display = 'none';
            elements.noResults.style.display = 'block';
        } else {
            elements.resultsSection.style.display = 'block';
            elements.noResults.style.display = 'none';

            elements.searchResults.innerHTML = results.slice(0, 5).map(brand => `
                <a href="${brand.url}" class="suggestion-item" data-brand-id="${brand.id}">
                    <img src="${brand.logo}" alt="${brand.name}">
                    <div class="suggestion-item-info">
                        <div class="suggestion-item-name">${brand.name}</div>
                        <div class="suggestion-item-category">${formatCategory(brand.category)}</div>
                    </div>
                </a>
            `).join('');

            // Add click handlers
            elements.searchResults.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const brandName = item.querySelector('.suggestion-item-name').textContent;
                    saveRecentSearch(brandName);
                });
            });
        }

        elements.searchSuggestions.classList.add('active');
    }

    function showSearchSuggestions() {
        showTrendingAndRecent();
        elements.searchSuggestions.classList.add('active');
    }

    function showTrendingAndRecent() {
        // Show trending
        elements.trendingSection.style.display = 'block';
        elements.trendingItems.innerHTML = trendingSearches.map(term => `
            <div class="suggestion-item" data-search-term="${term}">
                <div class="suggestion-item-icon">
                    <i class="bi bi-fire"></i>
                </div>
                <div class="suggestion-item-info">
                    <div class="suggestion-item-name">${term}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        elements.trendingItems.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const term = item.dataset.searchTerm;
                elements.searchInput.value = term;
                performSearch(term);
            });
        });

        // Show recent searches
        if (state.recentSearches.length > 0) {
            elements.recentSection.style.display = 'block';
            elements.recentItems.innerHTML = state.recentSearches.slice(0, 5).map(term => `
                <div class="suggestion-item" data-search-term="${term}">
                    <div class="suggestion-item-icon">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <div class="suggestion-item-info">
                        <div class="suggestion-item-name">${term}</div>
                    </div>
                </div>
            `).join('');

            // Add click handlers
            elements.recentItems.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const term = item.dataset.searchTerm;
                    elements.searchInput.value = term;
                    performSearch(term);
                });
            });
        } else {
            elements.recentSection.style.display = 'none';
        }

        elements.resultsSection.style.display = 'none';
        elements.noResults.style.display = 'none';
    }

    function saveRecentSearch(term) {
        // Remove if already exists
        state.recentSearches = state.recentSearches.filter(t => t !== term);

        // Add to beginning
        state.recentSearches.unshift(term);

        // Keep only last 10
        state.recentSearches = state.recentSearches.slice(0, 10);

        // Save to localStorage
        localStorage.setItem('kunyo_recent_searches', JSON.stringify(state.recentSearches));
    }

    function clearRecentSearches() {
        state.recentSearches = [];
        localStorage.removeItem('kunyo_recent_searches');
        elements.recentSection.style.display = 'none';
    }

    // ============================================
    // CATEGORY FILTERING
    // ============================================
    function handleCategoryChange(e) {
        const category = e.currentTarget.dataset.category;

        // Update active state
        elements.categoryTabs.forEach(tab => tab.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Update state
        state.currentCategory = category;
        state.displayedCount = 20;

        // Filter brands
        filterBrands();

        // Render
        renderBrands();
    }

    function filterBrands() {
        let filtered = [...state.brands];

        // Category filter
        if (state.currentCategory !== 'all') {
            filtered = filtered.filter(brand => brand.category === state.currentCategory);
        }

        // Sort
        filtered = sortBrands(filtered, state.currentSort);

        state.filteredBrands = filtered;
    }

    // ============================================
    // SORTING
    // ============================================
    function toggleSortMenu() {
        elements.sortMenu.classList.toggle('active');
    }

    function handleSortChange(e) {
        const sortType = e.currentTarget.dataset.sort;

        // Update active state
        elements.sortOptions.forEach(option => option.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Update label
        elements.sortLabel.textContent = e.currentTarget.textContent.trim();

        // Update state
        state.currentSort = sortType;

        // Close menu
        elements.sortMenu.classList.remove('active');

        // Re-filter and render
        filterBrands();
        renderBrands();
    }

    function sortBrands(brands, sortType) {
        const sorted = [...brands];

        switch (sortType) {
            case 'popular':
                sorted.sort((a, b) => {
                    const aCount = parseInt(a.soldCount.replace(/\D/g, ''));
                    const bCount = parseInt(b.soldCount.replace(/\D/g, ''));
                    return bCount - aCount;
                });
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
                sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
        }

        return sorted;
    }

    // ============================================
    // RENDER BRANDS
    // ============================================
    function renderBrands() {
        const brandsToShow = state.filteredBrands.slice(0, state.displayedCount);

        if (brandsToShow.length === 0) {
            elements.brandGrid.style.display = 'none';
            elements.emptyState.style.display = 'block';
            elements.loadMoreContainer.style.display = 'none';
            return;
        }

        elements.emptyState.style.display = 'none';
        elements.brandGrid.style.display = 'grid';

        elements.brandGrid.innerHTML = brandsToShow.map(brand => createBrandCard(brand)).join('');

        // Show/hide load more button
        if (state.filteredBrands.length > state.displayedCount) {
            elements.loadMoreContainer.style.display = 'block';
        } else {
            elements.loadMoreContainer.style.display = 'none';
        }

        // Attach favorite listeners
        attachFavoriteListeners();

        // Lazy load images
        lazyLoadImages();
    }

    function createBrandCard(brand) {
        const isFavorite = state.favorites.includes(brand.id);
        const badges = brand.badges.map(badge =>
            `<span class="brand-badge ${badge}">${badge}</span>`
        ).join('');

        return `
            <a href="${brand.url}" class="brand-card" data-brand-id="${brand.id}">
                ${badges ? `<div class="brand-badges">${badges}</div>` : ''}
                <button class="brand-favorite ${isFavorite ? 'active' : ''}" data-brand-id="${brand.id}" aria-label="Add to favorites">
                    <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
                <div class="brand-logo-wrapper">
                    <img src="${brand.logo}" alt="${brand.name}" class="brand-logo" loading="lazy">
                </div>
                <div class="brand-name">${brand.name}</div>
                <div class="brand-category">${formatCategory(brand.category)}</div>
                <div class="brand-stats">
                    <div class="brand-stat">
                        <i class="bi bi-star-fill"></i>
                        <span>${brand.rating}</span>
                    </div>
                    <div class="brand-stat">
                        <i class="bi bi-bag-check"></i>
                        <span class="count">${brand.soldCount}</span>
                    </div>
                </div>
                <div class="brand-quick-buy">
                    Quick Buy <i class="bi bi-arrow-right"></i>
                </div>
            </a>
        `;
    }

    function formatCategory(category) {
        const categoryMap = {
            'mobile-game': 'Mobile Game',
            'pc-game': 'PC Game',
            'direct-topup': 'Direct Top-Up',
            'gift-cards': 'Gift Card'
        };
        return categoryMap[category] || category;
    }

    function hideSkeletonGrid() {
        elements.skeletonGrid.style.display = 'none';
    }

    // ============================================
    // FAVORITES
    // ============================================
    function attachFavoriteListeners() {
        document.querySelectorAll('.brand-favorite').forEach(btn => {
            btn.addEventListener('click', handleFavoriteClick);
        });
    }

    function handleFavoriteClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const brandId = e.currentTarget.dataset.brandId;
        const icon = e.currentTarget.querySelector('i');

        if (state.favorites.includes(brandId)) {
            // Remove from favorites
            state.favorites = state.favorites.filter(id => id !== brandId);
            e.currentTarget.classList.remove('active');
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
        } else {
            // Add to favorites
            state.favorites.push(brandId);
            e.currentTarget.classList.add('active');
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
        }

        // Save to localStorage
        localStorage.setItem('kunyo_favorites', JSON.stringify(state.favorites));

        // Update count
        updateFavoritesCount();
    }

    function updateFavoritesCount() {
        const count = state.favorites.length;
        if (count > 0) {
            elements.favoritesCount.textContent = count;
            elements.favoritesCount.style.display = 'block';
        } else {
            elements.favoritesCount.style.display = 'none';
        }
    }

    function openFavoritesModal() {
        const favoriteBrands = state.brands.filter(brand => state.favorites.includes(brand.id));

        if (favoriteBrands.length === 0) {
            elements.favoritesModalBody.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-heart"></i>
                    <h3>No favorites yet</h3>
                    <p>Start adding games to your favorites!</p>
                </div>
            `;
        } else {
            elements.favoritesModalBody.innerHTML = `
                <div class="brand-grid">
                    ${favoriteBrands.map(brand => createBrandCard(brand)).join('')}
                </div>
            `;
            attachFavoriteListeners();
        }

        elements.favoritesModal.style.display = 'block';
    }

    function closeFavoritesModal() {
        elements.favoritesModal.style.display = 'none';
    }

    // ============================================
    // FILTER MODAL
    // ============================================
    function openFilterModal() {
        elements.filterModal.classList.add('active');
    }

    function closeFilterModal() {
        elements.filterModal.classList.remove('active');
    }

    function applyFilterChanges() {
        // TODO: Implement advanced filtering logic
        closeFilterModal();
        filterBrands();
        renderBrands();
    }

    function clearAllFilters() {
        // TODO: Clear all checkboxes
        closeFilterModal();
    }

    function resetAllFilters() {
        state.currentCategory = 'all';
        state.currentSort = 'popular';

        // Reset UI
        elements.categoryTabs.forEach(tab => {
            if (tab.dataset.category === 'all') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        filterBrands();
        renderBrands();
    }

    // ============================================
    // LOAD MORE
    // ============================================
    function loadMoreBrands() {
        state.displayedCount += 20;
        renderBrands();
    }

    // ============================================
    // SCROLL HANDLING
    // ============================================
    function handleScroll() {
        // Show/hide back to top button
        if (window.scrollY > 500) {
            elements.backToTop.style.display = 'flex';
        } else {
            elements.backToTop.style.display = 'none';
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ============================================
    // OUTSIDE CLICK HANDLER
    // ============================================
    function handleOutsideClick(e) {
        // Close search suggestions
        if (elements.searchSuggestions &&
            !elements.searchInput.contains(e.target) &&
            !elements.searchSuggestions.contains(e.target)) {
            elements.searchSuggestions.classList.remove('active');
        }

        // Close sort menu
        if (elements.sortMenu &&
            !elements.sortBtn.contains(e.target) &&
            !elements.sortMenu.contains(e.target)) {
            elements.sortMenu.classList.remove('active');
        }
    }

    // ============================================
    // LAZY LOADING
    // ============================================
    function lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy, img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Focus search on '/' key
            if (e.key === '/' && document.activeElement !== elements.searchInput) {
                e.preventDefault();
                elements.searchInput.focus();
            }

            // Close modals on Escape
            if (e.key === 'Escape') {
                elements.searchSuggestions.classList.remove('active');
                elements.sortMenu.classList.remove('active');
                closeFilterModal();
                closeFavoritesModal();
            }
        });
    }

    // ============================================
    // INITIALIZE ON DOM READY
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('Topup Listing page initialized with UX best practices');

})();
