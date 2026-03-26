// Top-Up New Page JavaScript

(function() {
    'use strict';

    // State
    const state = {
        selectedMethod: 'uid',
        selectedPackage: null,
        selectedPrice: 0,
        selectedDiamonds: 0
    };

    // DOM Elements
    const methodButtons = document.querySelectorAll('.method-btn-new');
    const methodPanels = document.querySelectorAll('.method-panel-new');
    const packageItems = document.querySelectorAll('.package-item-new');
    const selectedPackageEl = document.getElementById('selectedPackage');
    const totalAmountEl = document.getElementById('totalAmount');
    const totalAmountLoginEl = document.getElementById('totalAmountLogin');

    // Initialize
    function init() {
        attachEventListeners();
    }

    // Event Listeners
    function attachEventListeners() {
        // Method Buttons
        methodButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const method = this.getAttribute('data-method');
                switchMethod(method);
            });
        });

        // Package Items
        packageItems.forEach(item => {
            item.addEventListener('click', function() {
                selectPackage(this);
            });
        });
    }

    // Switch Method
    function switchMethod(method) {
        state.selectedMethod = method;

        // Update buttons
        methodButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-method') === method) {
                btn.classList.add('active');
            }
        });

        // Update panels
        methodPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `panel-${method}`) {
                panel.classList.add('active');
            }
        });

        // Reset selection
        packageItems.forEach(item => item.classList.remove('selected'));
        state.selectedPackage = null;
        state.selectedPrice = 0;
        state.selectedDiamonds = 0;
        updateSummary();
    }

    // Select Package
    function selectPackage(item) {
        // Get parent panel to only affect packages in current method
        const parentPanel = item.closest('.method-panel-new');
        if (!parentPanel || !parentPanel.classList.contains('active')) return;

        // Remove previous selection in this panel
        parentPanel.querySelectorAll('.package-item-new').forEach(pkg => {
            pkg.classList.remove('selected');
        });

        // Add selection
        item.classList.add('selected');

        // Update state
        const price = parseFloat(item.getAttribute('data-price')) || 0;
        const diamonds = item.getAttribute('data-diamonds');

        state.selectedPrice = price;
        state.selectedDiamonds = diamonds;

        if (diamonds) {
            state.selectedPackage = `${diamonds} 💎 Diamonds`;
        } else {
            const amountText = item.querySelector('.package-amount')?.textContent || '';
            state.selectedPackage = amountText;
        }

        updateSummary();
    }

    // Update Summary
    function updateSummary() {
        const priceText = `Rs. ${state.selectedPrice.toFixed(2)}`;

        if (selectedPackageEl) {
            selectedPackageEl.textContent = state.selectedPackage || '-';
        }

        if (totalAmountEl) {
            totalAmountEl.textContent = state.selectedPrice > 0 ? priceText : 'Rs. 0.00';
        }

        if (totalAmountLoginEl) {
            totalAmountLoginEl.textContent = state.selectedPrice > 0 ? priceText : 'Rs. 0.00';
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('Top-Up New page initialized');
})();
