#!/bin/bash

# List of files to update (excluding cart.html which is already done and index-v2.html which is the source)
FILES=(
    "checkout.html"
    "steam-gift-card.html"
    "games-listing.html"
    "gift-card.html"
    "topup-mobile-legends.html"
    "product-detail.html"
    "product-detail-2.html"
    "index.html"
    "index-logged-in.html"
    "signin.html"
    "signup.html"
    "forgot-password.html"
    "reset-password.html"
    "verify-email.html"
    "verify-otp.html"
    "verify-phone.html"
    "change-password.html"
    "account-recovery.html"
    "terms-acceptance.html"
    "topup-v2.html"
)

echo "This script will update the navbar in multiple HTML files."
echo "It requires manual editing as the navbar structures vary across files."
echo ""
echo "Files that need navbar updates:"
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  - $file"
    fi
done
echo ""
echo "Please update these files manually by copying the navbar from index-v2.html (lines 206-613)"
echo "And adding <script src=\"js/navigation.js\"></script> after Bootstrap JS"
