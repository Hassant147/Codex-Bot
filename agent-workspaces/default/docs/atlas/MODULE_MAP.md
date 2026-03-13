# Module Map

Update this file whenever modules, folders, or responsibilities change.

| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| App bootstrap | `src/index.js`, `src/App.js` | Root render, provider stacking, router mount, suspense fallback | App-level `Suspense` fallback uses `src/shared/ui/PageLoader` |
| Route registry | `src/routes/AppRoutes.jsx` | All route declarations and lazy page imports | Includes both public and protected routes; `/listing-page` is declared twice |
| Route guard | `src/components/ProtectedRoute/ProtectedRoute.js` | Enforces auth for protected routes and renders login prompt fallback | Reads `login` + `loading` from auth context |
| Global navigation shell | `src/components/Header/*`, `src/components/Footer/*` | Main nav, account menu, global links, locale/currency controls | Header navigates to `/my-reviews`, but AppRoutes currently has no matching route |
| Auth context | `src/context/AuthContext.js`, `src/context/AuthContextProvider.js` | Session bootstrap, profile hydration, login state | Refresh/token bootstrap uses cookies and `AuthApi` helpers |
| Currency context | `src/context/CurrencyContext.js` | Currency selection and conversion helpers | Fetches exchange rates hourly via utility layer |
| Modal + booking contexts | `src/context/ModalContext.js`, `src/context/BookingContext.jsx` | Global modal state + booking payload handoff | Booking context is lightweight and state-based |
| HTTP transport | `src/services/api/httpClient.js` | Axios clients, auth headers, token refresh, cookie persistence | Supports app token profile and legacy token profile |
| Auth API wrappers | `src/api/AuthApi.js`, `src/api/UserAuthApis.js` | Login/signup/OTP/profile/logout/address calls | Modern and legacy login wrappers coexist |
| Discovery API wrappers | `src/api/homepageApi.js`, `src/api/listingApi.js` | Homepage/listing package fetch contracts and normalization | Listing uses query-param-aware endpoint switching |
| Shared domain API service | `src/api/apiService.js` | Mixed-domain endpoints: packages, booking, traveler, complaints, wallet, custom package | High-volume file with mixed ownership and both modern/legacy endpoint groups; `fetchBookingsByUser` currently unwraps `apiGet` as `response?.data`, which can hide transport failures as undefined payloads |
| Homepage domain | `src/pages/HomePage/*`, `src/hooks/useHomepageData.js` | Hero/search surface, package showcase, deferred section loading | Hook includes 5-minute in-memory cache for featured data |
| Listing domain | `src/pages/ListingPage/*`, `src/features/listing/*` | Package listing UI, filter/sort/pagination state, route query sync | `useListingPageData` is the central listing orchestrator |
| Package detail domain | `src/pages/PackageDetailPage/*`, `src/features/packageDetail/*` | Package detail fetching and desktop/mobile rendering | Uses `PackageId` query param and responsive view split; mobile primary action routes to `/bookings` while legacy drawer form component remains mounted but dormant |
| Booking domain | `src/features/booking/*`, `src/features/travelersInfo/*`, `src/features/bookingStatus/*` | Traveler grouping, pricing totals, booking payload construction, booking status actions | `useBookingLogic` drives booking validation and API submission; booking status and traveler hooks depend on `fetchBookingsByUser` response shape from `apiService` |
| User settings domain | `src/pages/UserSetting/*`, `src/features/paymentMethods/*`, `src/features/remainingPayment/*` | Authenticated account workflows (bookings, payment methods, wallet, messages, wishlist) | Sidebar includes `/help` and `/reviews` links without AppRoutes entries |
| Static content domain | `src/features/staticPages/*`, `src/pages/PolicyPages/*`, `src/pages/GenericPages/*` | Reusable static page shells and content mapping for policy/generic routes | Policy and generic routes share `StaticContentPage` composition |
| Shared utilities + assets | `src/components/*`, `src/shared/*`, `src/Utilities/*`, `src/styles/*` | Reusable primitives, assets, utility hooks/helpers, global styles | Includes `ScrollToTop`, dropdown outside-click helper, asset catalog |
| Build and maintenance scripts | `scripts/*`, root `package.json` scripts | Asset/build analysis and optimization entrypoints | `optimize:images`, `analyze:build`, `analyze:bundle` available |
