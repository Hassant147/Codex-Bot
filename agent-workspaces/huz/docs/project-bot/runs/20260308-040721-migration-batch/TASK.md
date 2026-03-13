Convert the remaining desktop/mobile split pages in Huz-Web-Frontend into single responsive implementations that follow the one-page, one-responsive-design rule.

Primary target: /Users/macbook/Desktop/Huz/Huz-Web-Frontend
Scoped code area: /Users/macbook/Desktop/Huz/Huz-Web-Frontend/src

Required migration targets:
- Listing: src/pages/ListingPage/ListingPage.js + src/pages/ListingPage/ListingMobileScreen.jsx
- Booking setup: src/pages/UserSetting/MyApplication/Booking/booking.jsx + src/pages/UserSetting/MyApplication/Mobile/mobilebooking.jsx
- Booking status: src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx + src/pages/UserSetting/MyApplication/Mobile/bookingstatus.jsx
- Payment methods: src/pages/UserSetting/PaymentMethods/paymentMethods.jsx + src/pages/UserSetting/PaymentMethods/Mobile/paymentmethod.jsx
- Remaining payment: src/pages/UserSetting/RemainingPayment/remainingPayment.jsx + src/pages/UserSetting/RemainingPayment/Mobile/remainingPayment.jsx
- Traveler details: src/pages/UserSetting/Datatable/datatable.jsx + src/pages/UserSetting/Datatable/Mobile/datatable.jsx
- Messages: src/pages/UserSetting/Message/messagePage.jsx + src/pages/UserSetting/Mobile/Message/messagepageview.jsx
- Payment & Wallet: src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx + src/pages/UserSetting/Payment&Wallet/Mobile/paymentwallet.jsx
- Operator response: src/pages/UserSetting/OperatorResponse/operatorresponse.jsx + src/pages/UserSetting/OperatorResponse/Mobile/operatorresponse.jsx
- Wishlist switcher: src/pages/UserSetting/Wishlist/index.jsx, src/pages/UserSetting/Wishlist/wishlist.jsx, src/pages/UserSetting/Wishlist/wishlistMobile.jsx
- Route-level mobile-only cases in src/routes/AppRoutes.jsx, including /payment-wallet-mobile and /booking-page pointing at a mobile-oriented invoice page
- Inline mobile branch inside src/pages/HajjGuidance/HajjGuidance.jsx

Migration rules:
- Keep routes, business logic, API usage, and user-facing flows stable unless a route must become a compatibility alias to the unified responsive page.
- Replace duplicated mobile-only page implementations with shared responsive pages/components wherever safe.
- Preserve feature parity across desktop and mobile; do not drop fields, actions, status states, payment steps, or message capabilities.
- Prefer one source of truth per page. Temporary wrappers are acceptable only when needed to preserve route compatibility during the migration.
- Remove dead mobile-only branches/files only when proven safe after the shared responsive page is in place.
- Do not broaden into unrelated visual redesign. This is a responsive unification and duplication-reduction pass.
- Use existing design guides and current Huz visual language; keep UI direction stable while fixing structure.

Execution priority:
1. Booking and payment flow pages first.
2. Remaining user-setting pages next.
3. Listing, wishlist, and HajjGuidance cleanup after the flow-critical pages.

Verification requirements:
- Run the relevant frontend build and any scoped validation available.
- Smoke-check the affected routes/components at mobile, tablet, and desktop assumptions.
- Update backlog/report status for each migrated page group.
- Refresh atlas/change docs for any route, ownership, or module-structure changes.

Completion standard:
This migration is only complete when the listed split pages no longer depend on separate mobile page implementations for normal rendering, and the responsive behavior is handled by a shared page structure instead.
