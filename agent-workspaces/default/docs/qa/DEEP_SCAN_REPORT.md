# Deep Scan Report

Use this report for on-demand deep analysis of logic, structures, routes, contracts, and mismatch risks.

## Findings
### Phase 0 - Context Refresh (2026-03-05)
- Atlas baseline was stale (template-only) and has been refreshed from live code in `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`.
- Confirmed primary deep-scan code surfaces for subsequent phases:
  - Route registry: `src/routes/AppRoutes.jsx`
  - App/bootstrap context: `src/index.js`, `src/App.js`, `src/context/*`
  - API client and wrappers: `src/services/api/httpClient.js`, `src/api/*`
  - Domain modules: `src/features/*`, `src/pages/*`
- Confirmed run target is `Huz-Web-Frontend` while run-level scope value in state is `/Users/macbook/Desktop/Huz`; Phase 0 analysis was constrained to the target frontend project.
- No backlog defects were triaged in Phase 0; defect/risk findings will be recorded in later analysis phases.

### 2026-03-05 - System Atlas Run `20260305-152520-system-atlas` - Phase 0 (Inventory Scope)

#### Scope Coverage
- Target project scanned: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`
- Scope root scanned: `/Users/macbook/Desktop/Huz`
- Atlas baseline reviewed before scan:
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`

#### Project Shape Inventory
- Frontend stack: CRA (`react-scripts@5`) + React 18 + React Router 6 (from `package.json`).
- Main source entrypoints:
  - `src/index.js` -> renders `App`.
  - `src/App.js` -> wraps app with `AuthContextProvider`, `CurrencyProvider`, `ModalProvider`, `BookingProvider`, and `BrowserRouter`.
  - `src/routes/AppRoutes.jsx` -> centralized route table (lazy-loaded pages).
- Top-level source modules (`src/`): `Utilities`, `api`, `assets`, `components`, `context`, `features`, `hooks`, `pages`, `routes`, `services`, `shared`, `styles`.
- File density snapshot (inventory indicator):
  - `pages`: 107 files
  - `features`: 56 files
  - total JS/JSX files under `src`: 197

#### Route and Entrypoint Inventory
- Public routes include auth and marketing/discovery surfaces:
  - `/`, `/signup`, `/login`, `/otp`, `/listing-page`, `/package-detail-page`
  - `/visa-services`, `/Hajj-Guidance`, `/Umrah-Guidance`, `/browse-tips`, `/travel-essential`
  - `/makkah-holy-sites`, `/madina-holy-sites`, `/jeddah-holy-sites`, `/taif-holy-sites`
  - `/about-us`, `/core-values`, `/how-we-work`, `/hajjUmrah-partner`
  - `/frequently-asked-questions`, `/terms-services`, `/privacy-policy`
  - `/refund-policy`, `/cancellation-policy`, `/contact`, `/Media`, `/career`
- Protected routes (wrapped by `ProtectedRoute`):
  - `/bookings`, `/payment-methods`, `/data-table`, `/personal-details`
  - `/list-your-packages`, `/booking-page`, `/operator-response`, `/remaining-payment`
  - `/payment-wallet`, `/payment-wallet-mobile`, `/wishlist`, `/booking-status`
  - `/messages`, `/messages-chat`

#### Service Layer and API Inventory
- HTTP transport boundary: `src/services/api/httpClient.js`
  - Uses `REACT_APP_API_BASE_URL` + optional `REACT_APP_AUTH_TOKEN`.
  - Maintains dual token profiles:
    - App tokens: `accessToken` / `refreshToken`
    - Legacy tokens: `access_token` / `refresh_token`
  - Exposes `publicClient`, `authHeaderClient`, `httpClient`, `legacyHttpClient`.
- API modules with overlapping ownership:
  - `src/api/AuthApi.js`: auth/profile OTP/signup/address APIs (app token profile, `/auth/api/...`).
  - `src/api/UserAuthApis.js`: login/check/otp APIs used by login pages, but legacy endpoint present (`/auth/apis/user-login-with-email/`).
  - `src/api/apiService.js`: large mixed domain surface (packages, bookings, travelers, objections, complaints, wallet, custom package requests, subscriptions).
  - `src/api/homepageApi.js` + `src/api/listingApi.js`: focused wrappers for homepage/listing package fetch.

#### Major Flow Inventory
- Discovery flow:
  - Home hero search (`SearchBar`) navigates to `/listing-page?departureLocation=&departureDate=`.
  - Listing uses `features/listing/hooks/useListingPageData` -> `api/listingApi`.
  - Package details use `features/packageDetail/hooks/usePackageDetailLogic` -> `apiService.getPackageDetailByPackageId`.
- Booking/payment lifecycle flow:
  - Package detail CTA -> `/bookings` with navigation state.
  - `features/booking` builds booking payload -> `apiService.createBookingRequest`.
  - `/payment-methods` and `/remaining-payment` use payment hooks -> transaction + receipt APIs.
  - `/data-table` (travelers info) updates traveler docs + uploads files, then routes to operator response/remaining payment as applicable.
  - `/booking-status` maps booking status to route continuations via `resolveBookingCardNavigation`.
- Auth/session flow:
  - `AuthContextProvider` checks cookies + refresh token via `AuthApi.refreshAccessToken`, then fetches profile.
  - `ProtectedRoute` gates private routes through `AuthContext`.

#### Structural Ambiguity / Drift Evidence (Phase 0 Findings)
- Duplicate route declaration for `/listing-page` in `src/routes/AppRoutes.jsx` (one mapped to `ListingPage`, later one mapped to `ComingSoon`), creating route ownership ambiguity.
- `ProtectedRoute` reads `loading` from auth context, but `AuthContextProvider` currently provides `{ login, setLogin, signOut }` only (loading state not exposed in provider value).
- Navigation links with no route ownership found in `AppRoutes`:
  - Sidebar links: `/help`, `/reviews`.
  - Header profile menu route: `/my-reviews`.
- API/auth ownership drift:
  - Login pages consume `UserAuthApis`, while broader auth flow consumes `AuthApi`.
  - Both app and legacy token profiles coexist, with mixed endpoint prefixes (`/auth/api/...` and `/auth/apis/...`), indicating partial migration.

#### Atlas Staleness Evidence (Reason for Phase 1 refresh)
- Current atlas files are placeholders and do not yet represent actual system inventory:
  - `PROJECT_BLUEPRINT.md` has no architecture/flow content.
  - `MODULE_MAP.md` has header table only.
  - `ROUTES_AND_ENTRYPOINTS.md` has no route inventory.
  - `API_SURFACE.md` has no endpoint inventory.
  - `CHANGE_MAP.md` has no historical entries.

### Phase 1 - Analyze Code Paths (2026-03-05)

#### Scope And Method
- Analyzed only `/Users/macbook/Desktop/Huz/Huz-Web-Frontend` with evidence from source files and shell inspection commands.
- Command set used for verification included:
  - `find src -maxdepth ... -type f|d`
  - `nl -ba <file>`
  - `grep -R "<pattern>" -n src`
  - `grep -n "path=\"...\"" src/routes/AppRoutes.jsx`

#### Execution Paths Traced
1. Auth/session guard path
- `src/App.js` -> `AuthContextProvider` -> `ProtectedRoute`.
- `AuthContextProvider.checkAuth` refreshes/fetches profile through `AuthApi` and cookies.
- Protected routes check `login` and `loading` from context.

2. Discovery and listing path
- Homepage hero search (`SearchBar`) pushes query params to `/listing-page`.
- Listing data path: `useListingPageData` -> `fetchListingPackages` -> `listingPackageUtils` filtering/sorting.
- Package open path: listing/home package cards navigate to `/package-detail-page?PackageId=...`.

3. Package detail to booking/payment path
- Package detail CTA builds state via `buildBookingNavigationState` and navigates to `/bookings`.
- Booking payload path: `useBookingLogic` -> `buildBookingPayload` -> `createBookingRequest`.
- Payment path: `/payment-methods` -> `usePaymentMethodsLogic` -> transaction + receipt endpoints.

4. Booking status and post-payment path
- `fetchBookingsByUser` feeds booking status, traveler info, operator-response, and mobile package pending-check logic.
- Route continuation logic is handled in `bookingStatusUtils.resolveBookingCardNavigation`.

#### Evidence-Based Risk Findings
1. High - Protected route loading state mismatch causes auth-gate race UX
- Evidence:
  - `ProtectedRoute` reads `loading` from context and branches on it (`src/components/ProtectedRoute/ProtectedRoute.js:7-17`).
  - `AuthContextProvider` defines `loading` state but does not provide it in context value (`src/context/AuthContextProvider.js:24`, `src/context/AuthContextProvider.js:71`).
- Impact:
  - Protected pages can render `LoginPrompt` before auth bootstrap completes, creating false unauthenticated prompts and unstable deep-link behavior.

2. High - Login OTP flow can double-send OTP and ignores non-404 existence-check failures
- Evidence:
  - `UserAuthApis.checkUserExistence` swallows non-404 errors (no throw) (`src/api/UserAuthApis.js:25-30`).
  - Desktop and mobile login both retry `sendOtp` inside `catch` even after an initial send failure (`src/pages/Login/Login.js:72-93`, `src/pages/Login/mobile/login.jsx:62-73`).
- Impact:
  - Duplicate OTP sends, rate-limit pressure, and ambiguous login errors when existence checks fail upstream.

3. High - Booking list API failures are silently collapsed to empty states
- Evidence:
  - `apiGet` converts HTTP failures to `{ success: false, error }` without throwing (`src/api/apiService.js:23-41`).
  - `fetchBookingsByUser` returns `response?.data` without checking `success` (`src/api/apiService.js:374-383`).
  - Consumer hooks rely on thrown errors to show failure state (`src/features/bookingStatus/hooks/useBookingStatusData.js:24-34`, `src/features/travelersInfo/hooks/useTravelersInfoLogic.js:56-81`).
- Impact:
  - Real API failures frequently look like “no bookings,” masking incidents and making troubleshooting difficult.

4. Medium - Duplicate `/listing-page` route creates dead path and route ownership drift
- Evidence:
  - Two identical path declarations exist: `ListingPage` and `ComingSoon` (`src/routes/AppRoutes.jsx:53`, `src/routes/AppRoutes.jsx:67`).
- Impact:
  - One route target is effectively unreachable, and future edits can accidentally change behavior by reordering declarations.

5. Medium - Mobile package-detail booking drawer flow is dead and diverges from active booking pipeline
- Evidence:
  - Drawer state is initialized but never toggled true in `PackageDetailMobilePage` (`src/pages/PackageDetailPage/Mobile/PackageDetailMobilePage.jsx:23`, `:95-106`, `:132-136`).
  - Drawer component short-circuits render when false (`src/pages/PackageDetailPage/Mobile/components/Booking.jsx:389`).
  - This legacy drawer also reimplements pricing/payload logic separately from `features/booking` (`src/pages/PackageDetailPage/Mobile/components/Booking.jsx`, `src/pages/PackageDetailPage/Mobile/components/pricing.jsx`).
- Impact:
  - Dead code increases maintenance cost and keeps a second, stale booking implementation in the codebase.

6. Medium - Navigation points to undefined routes
- Evidence:
  - Sidebar links include `/help` and `/reviews` (`src/pages/UserSetting/sidebar.jsx:23-24`).
  - Header profile menu navigates to `/my-reviews` (`src/components/Header/Header.js:323`).
  - No corresponding route definitions found in `AppRoutes` (`src/routes/AppRoutes.jsx`).
- Impact:
  - User navigation can land on non-existent pages, producing broken-account-experience paths.

7. Low - Mixed token surface leaves stale cookie behavior
- Evidence:
  - OTP flow sets `authToken` cookie (`src/pages/Otp/Otp.js:114`).
  - Main transport/auth flow uses `accessToken`/`refreshToken` (`src/services/api/httpClient.js:14-15`), and logout clears only those keys (`src/components/Header/Header.js:243-244`).
- Impact:
  - Token behavior is harder to reason about and may leave stale auth artifacts during debugging.

### 2026-03-05 - System Atlas Run `20260305-152520-system-atlas` - Phase 1 (Refresh Atlas Docs)

#### What Was Refreshed
- `docs/atlas/PROJECT_BLUEPRINT.md`
- `docs/atlas/MODULE_MAP.md`
- `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `docs/atlas/API_SURFACE.md`
- `docs/atlas/CHANGE_MAP.md`

#### Verification Evidence Used
- Entrypoints and provider stack: `src/index.js`, `src/App.js`
- Route inventory and protection boundaries: `src/routes/AppRoutes.jsx`, `src/components/ProtectedRoute/ProtectedRoute.js`
- Navigation route intents: `src/components/Header/Header.js`, `src/pages/UserSetting/sidebar.jsx`
- API transport and contract surface: `src/services/api/httpClient.js`, `src/api/AuthApi.js`, `src/api/UserAuthApis.js`, `src/api/homepageApi.js`, `src/api/listingApi.js`, `src/api/apiService.js`
- Flow hooks/pages: `src/hooks/useHomepageData.js`, `src/features/listing/hooks/useListingPageData.js`, `src/features/packageDetail/hooks/usePackageDetailLogic.js`, `src/features/booking/hooks/useBookingLogic.js`, `src/components/SearchBar/SearchBar.js`

#### Key Atlas-Level Findings Captured
- Duplicate route declaration remains in `AppRoutes` for `/listing-page` (first maps to `ListingPage`, later maps to `ComingSoon`), which creates route ownership ambiguity.
- Navigation includes targets without route declarations in `AppRoutes` (`/my-reviews`, `/help`, `/reviews`).
- `ProtectedRoute` consumes `loading` from `AuthContext`, while `AuthContextProvider` currently exposes only `{ login, setLogin, signOut }`.
- API contracts still span modern and legacy endpoint families (`/auth/api/...` vs `/auth/apis/...`, and `/partner/get_*` vs `/partner/apis/*`).

#### Phase Scope Notes
- This phase refreshed documentation only; no code changes were applied in `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`.
- Findings recorded here are intended for follow-up validation/fix planning in later phases, not implementation in Phase 1.

### Phase 2 - Write Findings and Backlog (2026-03-05)

#### Findings Grouped By Concern

##### Auth and Session Reliability
- `DS-001` (P1): `ProtectedRoute` reads `loading` but `AuthContextProvider` does not expose `loading`, which can show false login prompts during auth bootstrap.
- `DS-002` (P1): Login flow (`UserAuthApis` + desktop/mobile login pages) can swallow existence-check failures and trigger duplicate OTP sends.
- `DS-007` (P3): Token key drift (`authToken` vs `accessToken`/`refreshToken`) increases stale-session/debugging risk.

##### Booking Data Reliability
- `DS-003` (P1): `apiGet` error normalization plus `fetchBookingsByUser` return handling can mask real API failures as empty booking data.

##### Route Integrity and Navigation Quality
- `DS-004` (P2): Duplicate `/listing-page` route declarations create ambiguous ownership and a dead declaration.
- `DS-006` (P2): UI links (`/help`, `/reviews`, `/my-reviews`) route to undefined paths in `AppRoutes`.

##### Dead and Divergent Flow Debt
- `DS-005` (P2): Mobile package-detail booking drawer is unreachable and duplicates booking/pricing logic outside active booking features.

#### Prioritized Backlog Waves
- Wave 1 (stability blockers): `DS-001`, `DS-002`, `DS-003`
- Wave 2 (route and UX integrity): `DS-004`, `DS-006`, `DS-005`
- Wave 3 (contract cleanup hardening): `DS-007`

#### Scope Scanned, Files Examined, and Evidence Boundaries
- Scope scanned: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend` (frontend only) under run scope `/Users/macbook/Desktop/Huz`.
- Representative files examined in this deep scan:
  - App/router/auth shell: `src/index.js`, `src/App.js`, `src/routes/AppRoutes.jsx`, `src/components/ProtectedRoute/ProtectedRoute.js`, `src/context/AuthContextProvider.js`
  - Auth API + login flow: `src/api/AuthApi.js`, `src/api/UserAuthApis.js`, `src/pages/Login/Login.js`, `src/pages/Login/mobile/login.jsx`, `src/pages/Otp/Otp.js`
  - Discovery/listing/detail flow: `src/components/SearchBar/SearchBar.js`, `src/features/listing/hooks/useListingPageData.js`, `src/api/listingApi.js`, `src/features/packageDetail/hooks/usePackageDetailLogic.js`, `src/api/homepageApi.js`
  - Booking/payment/status flow: `src/features/booking/hooks/useBookingLogic.js`, `src/features/bookingStatus/hooks/useBookingStatusData.js`, `src/features/travelersInfo/hooks/useTravelersInfoLogic.js`, `src/pages/UserSetting/OperatorResponse/operatorresponse.jsx`, `src/features/paymentMethods/hooks/usePaymentMethodsLogic.js`, `src/api/apiService.js`
  - Mobile detail debt surface: `src/pages/PackageDetailPage/Mobile/PackageDetailMobilePage.jsx`, `src/pages/PackageDetailPage/Mobile/components/Booking.jsx`, `src/pages/PackageDetailPage/Mobile/components/pricing.jsx`
  - Navigation targets: `src/components/Header/Header.js`, `src/pages/UserSetting/sidebar.jsx`
  - Runtime config context: `.env`, `package.json`, `src/services/api/httpClient.js`

#### Remaining Blind Spots
- Backend service implementation and authoritative API schema were not scanned in this run, so contract findings are frontend-consumer-based.
- No browser-driven runtime trace was executed; findings are from static code-path analysis and source inspection.
- No test/build command was run in this reporting phase because Phase 2 was documentation-only.
- Additional legacy/dead paths may still exist outside the traced route and flow surfaces above.

### 2026-03-05 - System Atlas Run `20260305-152520-system-atlas` - Phase 2 (Validate Atlas Coverage)

#### Atlas Coverage Validation Result
- Revalidated the highest-risk atlas references against live source files and confirmed Phase 1 atlas docs still match current code behavior.
- No atlas drift requiring edits to `PROJECT_BLUEPRINT.md`, `MODULE_MAP.md`, `ROUTES_AND_ENTRYPOINTS.md`, or `API_SURFACE.md` was found in this phase.

#### High-Risk Files Reopened For Validation
- Routing and ownership boundaries:
  - `src/routes/AppRoutes.jsx`
  - `src/components/Header/Header.js`
  - `src/pages/UserSetting/sidebar.jsx`
- Auth gate and context contract:
  - `src/components/ProtectedRoute/ProtectedRoute.js`
  - `src/context/AuthContextProvider.js`
- API transport and contract drift surface:
  - `src/services/api/httpClient.js`
  - `src/api/AuthApi.js`
  - `src/api/UserAuthApis.js`
  - `src/api/homepageApi.js`
  - `src/api/listingApi.js`
  - `src/api/apiService.js`
- Flow validation touchpoints:
  - `src/components/SearchBar/SearchBar.js`
  - `src/features/listing/hooks/useListingPageData.js`
  - `src/features/packageDetail/hooks/usePackageDetailLogic.js`
  - `src/features/booking/hooks/useBookingLogic.js`
  - `src/hooks/useHomepageData.js`
  - `.env`

#### Confirmed Atlas Statements Still Accurate
- Duplicate `/listing-page` route declaration still exists in `AppRoutes` (first `ListingPage`, later `ComingSoon`).
- Navigation targets `/my-reviews`, `/help`, and `/reviews` still have no corresponding route declarations.
- `ProtectedRoute` still consumes `loading` while `AuthContextProvider` still does not provide `loading` in context value.
- Mixed endpoint families remain active (`/auth/api/...` with `/auth/apis/...`, and `/partner/get_*` with `/partner/apis/*`).
- Homepage in-memory cache TTL remains 5 minutes (`5 * 60 * 1000`) and listing query handling remains route-query driven.
- `.env` base URL and static auth header values still match atlas notes.

#### Assumptions And Unknowns
- Contract validation remains frontend-consumer-based; backend implementation and API schemas were not rescanned in this phase.
- Route behavior was validated statically from source; no browser-run navigation trace was executed in Phase 2.
- Legacy commented API paths remain non-active by source inspection, but production backend support status is unknown.

#### Next Recommended Atlas Refresh Targets
- Refresh route docs immediately after any cleanup of duplicate `/listing-page` declarations or addition of missing `/help`, `/reviews`, `/my-reviews` routes.
- Refresh auth/flow notes after resolving `AuthContextProvider` vs `ProtectedRoute` loading contract mismatch.
- Refresh API surface after consolidating legacy wrappers (`UserAuthApis`, mixed `apiService` endpoints, token profile split in `httpClient`).
- Re-run atlas verification when `.env` API host/token policy changes across environments.

#### Verification Method
- Source validation commands: `nl`, `grep`, `cat` over the high-risk files listed above.
- Phase 2 remained documentation-only; no target project source files were modified.

### Phase 3 - Verify and Summarize (2026-03-05)

#### Sanity-Check Outcome
- Revalidated all backlog findings (`DS-001` through `DS-007`) against live source and confirmed each remains accurate and open.
- Corrected stale file evidence in this report by replacing non-existent `src/features/operatorResponse/hooks/useOperatorResponseLogic.js` with active operator response page path `src/pages/UserSetting/OperatorResponse/operatorresponse.jsx`.
- Atlas docs were refreshed where structure/contract clarity improved (`PROJECT_BLUEPRINT.md`, `MODULE_MAP.md`, `API_SURFACE.md`).

#### Evidence Re-Validation Snapshot
1. `DS-001` remains valid:
- `ProtectedRoute` still consumes `{ login, loading }` (`src/components/ProtectedRoute/ProtectedRoute.js`, line 7 onward).
- `AuthContextProvider` still defines `loading` but does not expose it in provider value (`src/context/AuthContextProvider.js`, lines 24 and 71).

2. `DS-002` remains valid:
- `checkUserExistence` still suppresses non-404 errors (`src/api/UserAuthApis.js`, lines 25-30).
- Desktop and mobile login flows still retry `sendOtp` inside `catch` (`src/pages/Login/Login.js`, lines 83-93; `src/pages/Login/mobile/login.jsx`, lines 68-73).

3. `DS-003` remains valid:
- `apiGet` still normalizes failures into `{ success: false, error }` without throwing (`src/api/apiService.js`, lines 13-42).
- `fetchBookingsByUser` still returns `response?.data` from `apiGet` (`src/api/apiService.js`, lines 374-377), so failures can degrade to undefined payload.
- Booking-status and traveler hooks still rely on thrown-error paths for explicit failure states (`src/features/bookingStatus/hooks/useBookingStatusData.js`, lines 29-34; `src/features/travelersInfo/hooks/useTravelersInfoLogic.js`, lines 57-81).

4. `DS-004` remains valid:
- Duplicate `/listing-page` route entries persist (`src/routes/AppRoutes.jsx`, lines 53 and 67).

5. `DS-005` remains valid:
- `showBookingDrawer` remains initialized false and passed to drawer, with no `setShowBookingDrawer(true)` path (`src/pages/PackageDetailPage/Mobile/PackageDetailMobilePage.jsx`, lines 23 and 132-135; `src/pages/PackageDetailPage/Mobile/components/Booking.jsx`, line 389).

6. `DS-006` remains valid:
- Sidebar/header still navigate to `/help`, `/reviews`, `/my-reviews` (`src/pages/UserSetting/sidebar.jsx`, lines 23-24; `src/components/Header/Header.js`, line 323).
- No matching route declarations exist in `src/routes/AppRoutes.jsx`.

7. `DS-007` remains valid:
- OTP flow still sets `authToken` (`src/pages/Otp/Otp.js`, line 114).
- Transport/logout still use `accessToken`/`refreshToken` (`src/services/api/httpClient.js`, lines 14-15; `src/components/Header/Header.js`, lines 243-244).

#### Final Summary
- Deep scan quality is verified: the seven tracked risks remain reproducible in current source with line-level evidence.
- Highest-priority remediation remains Wave 1 (`DS-001`, `DS-002`, `DS-003`) because these directly affect auth reliability and booking failure visibility.
- Phase 3 remained documentation-only; no source code files were changed under `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`.
