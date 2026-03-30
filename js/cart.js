// ================================================================================
// KUNYO UNIVERSAL CART SYSTEM
// ================================================================================
//
// Purpose: Manages all shopping cart functionality across the entire KUNYO project
// Features: Add/remove items, quantity management, localStorage persistence,
//           cart drawer UI, badge updates
//
// ================================================================================

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================

    // LocalStorage key where cart data is stored
    // Cart structure: Array of items, each with {id, package, userId, quantity, addedAt}
    const CART_STORAGE_KEY = 'kunyoCart';

    // ========================================
    // WINDOW.KUNYOCART API
    // ========================================
    // Global API exposed for cart management across all pages

    window.KunyoCart = {

        /**
         * GET - Retrieve cart from localStorage
         * Returns: Array of cart items
         * Example: const cart = window.KunyoCart.get();
         */
        get: function() {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        },

        /**
         * SET - Save cart to localStorage and update badge
         * Param: cart (Array) - Complete cart array to save
         * Returns: void
         * Note: Automatically calls updateBadge() after saving
         */
        set: function(cart) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            this.updateBadge();
        },

        /**
         * ADD - Add new item to cart or increase quantity if exists
         * Param: item (Object) - Must contain {package, userId, quantity}
         * Logic:
         *   1. Checks if item with same package.id and userId already exists
         *   2. If exists: Increases quantity by item.quantity (or 1)
         *   3. If new: Adds to cart with unique timestamp ID
         * Returns: Updated cart array
         * Example: window.KunyoCart.add({package: {...}, userId: '123', quantity: 1});
         */
        add: function(item) {
            const cart = this.get();

            // Check for duplicate: same package + same userId = existing item
            const existingItemIndex = cart.findIndex(
                cartItem => cartItem.package && item.package &&
                cartItem.package.id === item.package.id &&
                cartItem.userId === item.userId
            );

            if (existingItemIndex > -1) {
                // Item exists - increase quantity
                cart[existingItemIndex].quantity += item.quantity || 1;
            } else {
                // New item - add to cart with timestamp ID
                cart.push({
                    id: Date.now(), // Unique ID based on timestamp
                    package: item.package, // Package object {id, name, price, etc}
                    userId: item.userId, // User ID for topup
                    quantity: item.quantity || 1,
                    addedAt: new Date().toISOString() // ISO timestamp
                });
            }

            this.set(cart);
            return cart;
        },

        /**
         * REMOVE - Delete item from cart by ID
         * Param: itemId (Number) - Unique item ID (timestamp)
         * Logic: Filters out item matching itemId
         * Returns: Updated cart array
         * Example: window.KunyoCart.remove(1234567890);
         */
        remove: function(itemId) {
            const cart = this.get();
            const filteredCart = cart.filter(item => item.id !== itemId);
            this.set(filteredCart);
            return filteredCart;
        },

        /**
         * UPDATE QUANTITY - Increase/decrease item quantity
         * Param: itemId (Number) - Item ID to update
         * Param: delta (Number) - Change amount (+1 to increase, -1 to decrease)
         * Logic:
         *   1. Finds item by ID
         *   2. Adds delta to current quantity
         *   3. If quantity <= 0: Removes item entirely
         *   4. Otherwise: Saves updated cart
         * Returns: Updated cart array
         * Example: window.KunyoCart.updateQuantity(1234567890, -1); // decrease by 1
         */
        updateQuantity: function(itemId, delta) {
            const cart = this.get();
            const item = cart.find(item => item.id === itemId);

            if (item) {
                item.quantity += delta;
                if (item.quantity <= 0) {
                    // Remove item if quantity reaches 0 or below
                    return this.remove(itemId);
                }
                this.set(cart);
            }
            return cart;
        },

        /**
         * CLEAR - Empty entire cart
         * Logic: Removes cart from localStorage and updates badge to 0
         * Returns: void
         * Example: window.KunyoCart.clear();
         */
        clear: function() {
            localStorage.removeItem(CART_STORAGE_KEY);
            this.updateBadge();
        },

        /**
         * COUNT - Get number of items in cart
         * Returns: Number of cart items (not total quantity)
         * Example: const itemCount = window.KunyoCart.count(); // Returns 3 if 3 items
         */
        count: function() {
            return this.get().length;
        },

        /**
         * TOTAL - Calculate total price of all cart items
         * Logic: Multiplies each item's price by quantity and sums
         * Returns: Total price as Number
         * Example: const totalPrice = window.KunyoCart.total(); // Returns 1500.00
         */
        total: function() {
            const cart = this.get();
            return cart.reduce((sum, item) => {
                return sum + (item.package.price * item.quantity);
            }, 0);
        },

        /**
         * UPDATE BADGE - Update cart badge count in header
         * Logic:
         *   1. Finds element with class '.cart-badge'
         *   2. Updates textContent with current cart count
         * Returns: void
         * Note: Called automatically by set(), clear()
         * Example: window.KunyoCart.updateBadge();
         */
        updateBadge: function() {
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                cartBadge.textContent = this.count();
            }
        }
    };

    // ========================================
    // CART DRAWER UI FUNCTIONALITY
    // ========================================
    // Handles the slide-out cart drawer/sidebar that shows cart contents

    // DOM Element References
    const cartDrawer = document.getElementById('cartDrawer'); // Main drawer container
    const cartDrawerClose = document.getElementById('cartDrawerClose'); // Close button inside drawer
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay'); // Dark overlay behind drawer
    const cartIconBtn = document.querySelector('.cart-icon-btn'); // Cart icon button in header
    const btnContinueShopping = document.getElementById('btnContinueShopping'); // Button in drawer footer

    /**
     * OPEN CART DRAWER
     * Logic:
     *   1. Adds 'active' class to drawer (triggers CSS slide-in animation)
     *   2. Prevents body scrolling while drawer is open
     *   3. Renders cart contents by calling renderCartDrawer()
     * Triggered by: Clicking cart icon button in header
     */
    function openCartDrawer() {
        if (cartDrawer) {
            cartDrawer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            renderCartDrawer(); // Load and display cart items
        }
    }

    /**
     * CLOSE CART DRAWER
     * Logic:
     *   1. Removes 'active' class from drawer (triggers CSS slide-out animation)
     *   2. Re-enables body scrolling
     * Triggered by: Close button, overlay click, continue shopping button
     */
    function closeCartDrawer() {
        if (cartDrawer) {
            cartDrawer.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    /**
     * RENDER CART DRAWER - Main rendering function for cart UI
     * Logic Flow:
     *   1. Fetches cart from localStorage via window.KunyoCart.get()
     *   2. Updates cart count badges (drawer + header)
     *   3. If cart empty: Shows empty state, hides items and footer
     *   4. If cart has items:
     *      a. Hides empty state
     *      b. Generates HTML for each cart item
     *      c. Displays items with product name, package, price, quantity controls
     *      d. Calculates and displays subtotal/total
     *
     * HTML Structure Generated for Each Item:
     *   - cart-item-header: Product name + remove button
     *   - cart-item-details: Package name + User ID
     *   - cart-item-footer: Price + quantity controls (-, count, +)
     *
     * Interactive Elements:
     *   - Remove button: Calls window.KunyoCart.remove() then re-renders
     *   - Quantity buttons: Call window.KunyoCart.updateQuantity() then re-renders
     */
    function renderCartDrawer() {
        const cart = window.KunyoCart.get(); // Get current cart state

        // DOM references for drawer elements
        const cartEmptyState = document.getElementById('cartEmptyState'); // Empty cart message
        const cartItemsListDrawer = document.getElementById('cartItemsListDrawer'); // Items container
        const cartDrawerFooter = document.getElementById('cartDrawerFooter'); // Footer with totals
        const cartCountBadge = document.getElementById('cartCountBadge'); // Count in drawer header

        // Update cart count badges
        if (cartCountBadge) cartCountBadge.textContent = cart.length;
        window.KunyoCart.updateBadge(); // Update header badge

        // EMPTY CART STATE
        if (cart.length === 0) {
            if (cartEmptyState) cartEmptyState.style.display = 'flex';
            if (cartItemsListDrawer) cartItemsListDrawer.style.display = 'none';
            if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
        }
        // CART HAS ITEMS
        else {
            if (cartEmptyState) cartEmptyState.style.display = 'none';
            if (cartItemsListDrawer) cartItemsListDrawer.style.display = 'block';
            if (cartDrawerFooter) cartDrawerFooter.style.display = 'block';

            // Generate HTML for each cart item
            const cartHTML = cart.map(item => `
                <div class="cart-item-drawer">
                    <div class="cart-item-image">
                        <img src="assets/images/mobile-legends-bang-bang1.webp" alt="Mobile Legends: Bang Bang">
                    </div>
                    <div class="cart-item-content">
                        <div class="cart-item-header">
                            <h5>Mobile Legends: Bang Bang</h5>
                            <button class="cart-item-remove" onclick="window.KunyoCart.remove(${item.id}); window.KunyoCartDrawer.render();">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                        <div class="cart-item-details">
                            <small><strong>Package:</strong> ${item.package.name || 'Unknown Package'}</small>
                            <small><strong>User ID:</strong> ${item.userId || 'N/A'}</small>
                        </div>
                        <div class="cart-item-footer">
                            <div class="cart-item-price">Rs. ${(item.package.price * item.quantity).toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="qty-btn" onclick="window.KunyoCart.updateQuantity(${item.id}, -1); window.KunyoCartDrawer.render();">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" onclick="window.KunyoCart.updateQuantity(${item.id}, 1); window.KunyoCartDrawer.render();">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            // Insert generated HTML into drawer
            if (cartItemsListDrawer) cartItemsListDrawer.innerHTML = cartHTML;

            // Calculate and display price totals
            const subtotal = window.KunyoCart.total();
            const cartSubtotalDrawer = document.getElementById('cartSubtotalDrawer');
            const cartTotalDrawer = document.getElementById('cartTotalDrawer');

            if (cartSubtotalDrawer) cartSubtotalDrawer.textContent = `Rs. ${subtotal.toFixed(2)}`;
            if (cartTotalDrawer) cartTotalDrawer.textContent = `Rs. ${subtotal.toFixed(2)}`;
        }
    }

    // ========================================
    // WINDOW.KUNYOCARTDRAWER API
    // ========================================
    // Global API for controlling cart drawer UI

    window.KunyoCartDrawer = {
        open: openCartDrawer,     // Opens the cart drawer
        close: closeCartDrawer,   // Closes the cart drawer
        render: renderCartDrawer  // Re-renders cart contents
    };

    // ========================================
    // EVENT LISTENERS
    // ========================================
    // Attach click handlers for cart drawer interactions

    // Cart Icon Button - Opens drawer when clicked
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCartDrawer();
        });
    }

    // Close Button - Closes drawer
    if (cartDrawerClose) {
        cartDrawerClose.addEventListener('click', closeCartDrawer);
    }

    // Overlay - Closes drawer when clicking outside
    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', closeCartDrawer);
    }

    // Continue Shopping Button - Closes drawer
    if (btnContinueShopping) {
        btnContinueShopping.addEventListener('click', closeCartDrawer);
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    // Initialize cart badge on page load

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        window.KunyoCart.updateBadge();
        console.log('✓ KUNYO Cart System initialized');
    });

    // Also initialize immediately if DOM is already loaded
    // (Handles cases where script loads after DOMContentLoaded event)
    if (document.readyState !== 'loading') {
        window.KunyoCart.updateBadge();
        console.log('✓ KUNYO Cart System initialized (immediate)');
    }

})();
