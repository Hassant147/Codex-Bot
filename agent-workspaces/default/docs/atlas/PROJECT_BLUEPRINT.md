# Project Blueprint

Keep this file current whenever code changes touch architecture, flows, or module boundaries.

## Scope
- Project goals
- High-level architecture
- Critical flows

## Current Notes
- Last refreshed: 2026-03-05 (Phase 3 - Verify and Summarize, run `20260305-152546-deep-scan`)
- Previous refresh: 2026-03-05 (Phase 1 - Refresh Atlas Docs, run `20260305-152520-system-atlas`)

## Project Purpose
- Frontend for HajjUmrah.co booking experience: package discovery, package details, booking creation, and authenticated user self-service flows.
- Primary stack: React 18, `react-scripts` (CRA), React Router v6, Tailwind CSS, Axios, Context API.
- Operates as a frontend client for backend APIs under auth, partner packages, booking, wallet, and profile domains.

## High-Level Architecture
- Bootstrap: `src/index.js` mounts `src/App.js` under `React.StrictMode`.
- App shell (`src/App.js`) composes providers and router in this order:
  - `AuthContextProvider`
  - `CurrencyProvider`
  - `ModalProvider`
  - `BookingProvider`
  - `BrowserRouter` + `AppRoutes`
- Routing source-of-truth: `src/routes/AppRoutes.jsx` with lazy-loaded route components and route-level `ProtectedRoute` wrapping.
- View composition pattern:
  - `src/pages/*` defines route-level screens.
  - `src/features/*` contains domain logic/hooks/utilities reused by pages.
  - `src/components/*` + `src/shared/*` provide reusable UI blocks.
- Service/data layer:
  - Core transport in `src/services/api/httpClient.js`.
  - Domain wrappers in `src/api/AuthApi.js`, `src/api/UserAuthApis.js`, `src/api/homepageApi.js`, `src/api/listingApi.js`, `src/api/apiService.js`.
- Key runtime helpers:
  - Route scroll reset via `ScrollToTop` (`src/Utilities/UtilityFunctions.js`).
  - Homepage package cache via `useHomepageData` (`src/hooks/useHomepageData.js`, 5-minute in-memory TTL).

## Critical Flows
1. Discovery flow
- Home (`/`) search (`SearchBar`) builds query params (`departureLocation`, `departureDate`) and navigates to `/listing-page`.
- Listing reads query params in `useListingPageData` and fetches package lists via `src/api/listingApi.js`.

2. Package detail flow
- Listing/package cards navigate to `/package-detail-page?PackageId=...`.
- Package detail hook (`usePackageDetailLogic`) resolves `PackageId` and requests package detail through `apiService.getPackageDetailByPackageId`.
- Mobile package detail primary CTA currently navigates directly to `/bookings` (`buildBookingNavigationState`) while still mounting a legacy drawer component (`pages/PackageDetailPage/Mobile/components/Booking.jsx`) that is never opened because `showBookingDrawer` is never toggled `true`.

3. Booking + payment continuation flow
- Booking payload is built in `features/booking` utilities and posted through `apiService.createBookingRequest` (`/booking/new/create/`).
- On success, flow continues to `/payment-methods` with booking and invoice state.
- Additional payment/receipt, traveler update, objection, and status screens are protected routes under user settings.

4. Auth and session flow
- Auth bootstrap (`AuthContextProvider`) reads `accessToken`/`refreshToken` cookies, attempts refresh via `/api/token/refresh/`, then hydrates profile from `/auth/api/get-user-profile/`.
- `ProtectedRoute` gates private routes and shows login prompt for unauthenticated users.

5. User self-service flow
- Authenticated users manage bookings, wallet/payment methods, messages, wishlist, profile data, and remaining payment through routes under `src/pages/UserSetting/*`.

## Ownership Boundaries and Constraints
- Route ownership boundary is centralized in `src/routes/AppRoutes.jsx`; components navigate to many paths, but only AppRoutes declares valid route entries.
- Current route ambiguity exists: `/listing-page` is declared twice (`ListingPage` then `ComingSoon`), so first-match ordering determines behavior.
- Auth context contract mismatch exists: `ProtectedRoute` reads `loading`, but `AuthContextProvider` currently provides `{ login, setLogin, signOut }` only.
- API ownership is partially split between modern and legacy wrappers:
  - Modern: `AuthApi`, `homepageApi`, `listingApi`.
  - Legacy/mixed: `UserAuthApis` and parts of `apiService`.
- Endpoint naming drift is present (`/auth/api/...` and `/auth/apis/...`; modern partner endpoints and legacy `/partner/apis/...` endpoints both remain).
- Booking list contract mismatch remains: `fetchBookingsByUser` returns `response?.data` from normalized `apiGet`, so HTTP failures can degrade into `undefined` payloads instead of thrown errors at call sites.

## Scoped Area For Current Run
- Run target project: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`.
- Effective analysis scope for this atlas phase: frontend source (`src/`) plus root config (`package.json`, `.env`) needed for route/API context.
- Run state scope value remains `/Users/macbook/Desktop/Huz`; this phase was executed against the target frontend project only.
