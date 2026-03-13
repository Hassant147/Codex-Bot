Refactor the remaining Huz-Web-Frontend pages that still use separate mobile implementations into one responsive page per route.

Project root: /Users/macbook/Desktop/Huz
Primary target repo: /Users/macbook/Desktop/Huz/Huz-Web-Frontend
Scoped code area: /Users/macbook/Desktop/Huz/Huz-Web-Frontend/src

Required targets:
- Listing: src/pages/ListingPage/ListingPage.js and src/pages/ListingPage/ListingMobileScreen.jsx
- Booking setup: src/pages/UserSetting/MyApplication/Booking/booking.jsx and src/pages/UserSetting/MyApplication/Mobile/mobilebooking.jsx
- Booking status: src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx and src/pages/UserSetting/MyApplication/Mobile/bookingstatus.jsx
- Payment methods: src/pages/UserSetting/PaymentMethods/paymentMethods.jsx and src/pages/UserSetting/PaymentMethods/Mobile/paymentmethod.jsx
- Remaining payment: src/pages/UserSetting/RemainingPayment/remainingPayment.jsx and src/pages/UserSetting/RemainingPayment/Mobile/remainingPayment.jsx
- Traveler details: src/pages/UserSetting/Datatable/datatable.jsx and src/pages/UserSetting/Datatable/Mobile/datatable.jsx
- Messages: src/pages/UserSetting/Message/messagePage.jsx and src/pages/UserSetting/Mobile/Message/messagepageview.jsx
- Payment and wallet: src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx and src/pages/UserSetting/Payment&Wallet/Mobile/paymentwallet.jsx
- Operator response: src/pages/UserSetting/OperatorResponse/operatorresponse.jsx and src/pages/UserSetting/OperatorResponse/Mobile/operatorresponse.jsx
- Wishlist: src/pages/UserSetting/Wishlist/index.jsx, src/pages/UserSetting/Wishlist/wishlist.jsx, and src/pages/UserSetting/Wishlist/wishlistMobile.jsx
- Route-level mobile-only cases in src/routes/AppRoutes.jsx, including /payment-wallet-mobile and /booking-page
- Inline mobile branch in src/pages/HajjGuidance/HajjGuidance.jsx

Implementation rules:
- Use one consistent Huz theme, layout system, spacing rhythm, and visual language across all affected pages.
- Follow /Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md as a reference guide only.
- Enforce one page, one responsive design. Do not preserve separate mobile-only page trees for normal rendering.
- Prefer reusable shared components, section primitives, and modular responsive layouts instead of duplicated JSX.
- Keep routes, business logic, data flow, and user-facing features stable unless a mobile-only route must become a compatibility alias to the unified responsive page.
- Keep the work clean, optimized, aligned, maintainable, and consistent with modern React and JavaScript practices already suitable for this repo.
- Preserve feature parity across breakpoints. Do not remove fields, actions, states, or payment/message flow behavior.
- Remove dead mobile wrappers only when the shared responsive page has absorbed their behavior safely.
- Keep the scope focused on responsive unification and structural cleanup, not unrelated redesign.

Important constraints:
- Do not run npm install, npm ci, npm run build, npm test, or other heavy verification/build commands in this run.
- Verify by code inspection, route/component dependency tracing, and scoped static consistency checks only.
- Update the bot workspace docs and run summaries as the run progresses.

Execution priority:
1. Booking and payment flow pages first.
2. Remaining user-setting pages next.
3. Listing, wishlist, HajjGuidance, and route cleanup after the flow-critical pages.

Completion standard:
The task is complete only when the listed routes no longer depend on separate mobile page implementations for normal rendering and responsive behavior is handled by shared page structures.
