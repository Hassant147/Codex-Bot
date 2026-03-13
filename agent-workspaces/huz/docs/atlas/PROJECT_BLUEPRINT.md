# Project Blueprint

Keep this file current whenever code changes touch architecture, flows, or module boundaries.

## Scope
- Project goals
- High-level architecture
- Critical flows

## Current Notes

### 2026-03-11 - Release Gate Phase 1 Booking Contract Closeout
- Closed `BOOKING-009` without changing frontend routes by adding an additive `traveller_detail` alias to the legacy partner booking detail/report payload and reloading the booking after `REPORTED` status updates so the serialized traveler branch reflects the updated `report_rabbit` flag immediately.
- Release-gate verification now clears all scoped March 11 booking findings (`BOOKING-001` through `BOOKING-011`): admin build passed with pre-existing warnings only, operator lint/check scripts/build/Playwright smoke passed, web build passed with the known `WEB-001` and bundle-size warnings only, and backend `manage.py check` plus the targeted 13-test booking suite passed under `huz.settings_test`.
- No route or schema migrations were required in this phase; the release-gate blocker was removed through a legacy-contract compatibility fix in `Huz-Backend/booking/serializers.py`, `Huz-Backend/booking/manage_partner_booking.py`, and the targeted backend gate tests.

### 2026-03-11 - Fix Backlog Phase 2 Booking Contract Batch 04 Verification
- Verified `BOOKING-003`, `BOOKING-010`, and `BOOKING-011` as resolved with passing operator and web production builds plus source smoke on the affected dashboard, booking-search, and support-history consumer paths.
- No backend route or serializer changes were required for Batch 04; verification confirmed the fixes remain frontend-only and the active operator/web contracts stayed unchanged.
- Web build warnings remain limited to the pre-existing `WEB-001` unused imports in `src/pages/PackageDetailPage/components/LeftColumn/Itinerary.js` and the long-standing bundle-size advisory, so those stay tracked as separate backlog items.

### 2026-03-11 - Fix Backlog Phase 1 Booking Contract Batch 04
- Implemented truthful frontend-side fixes for `BOOKING-003`, `BOOKING-010`, and `BOOKING-011` without changing backend routes or serializer payloads.
- Operator dashboard fallback summaries now carry explicit `recentBookingsScope` metadata; when `VITE_DASHBOARD_SUMMARY_ENDPOINT` is absent, the card renders as "Ready Queue", reports ready-scope totals, and marks the dashboard source chip as a ready-queue fallback instead of implying cross-bucket recency.
- Operator booking list search now sends `booking_number` explicitly and the UI copy states that search is booking-number-only, matching the active `/bookings/get_all_booking_detail_for_partner/` filter contract.
- Web support history attachment/audio links now resolve relative media paths against `REACT_APP_API_BASE_URL` via the shared HTTP client helper, keeping split-origin deployments correct without changing the canonical `v1` support endpoints.
- Verification remains intentionally deferred to Phase 2 by the run boundary; this phase only implemented the scoped UI/consumer changes and refreshed workspace memory.

### 2026-03-11 - Fix Backlog Phase 2 Booking Contract Batch 03 Verification
- Verified `BOOKING-008` as resolved with passing admin/operator builds, passing backend `manage.py check`, a passing targeted delete-guard test, and source smoke across the admin/operator completed-booking fulfillment routes.
- `BOOKING-009` remains open. Phase 2 found that admin booking detail still consumes the legacy `/bookings/get_booking_detail_by_booking_number/` payload without the operator-style `passport_validity_detail -> traveller_detail` normalization, so the new reported-travelers section does not yet have verified runtime data.
- No routes or serializer schemas changed in this phase; atlas memory was corrected to reflect partial Batch 03 completion instead of treating both backlog items as closed.

### 2026-03-11 - Fix Backlog Phase 1 Booking Contract Batch 03
- Implemented `BOOKING-008` and `BOOKING-009` across `Huz-Admin-Frontend`, `Huz-Operator-Frontend`, and `Huz-Backend` without adding new routes or changing serializer schemas.
- Admin and operator completed-booking detail screens now treat fulfillment documents and arrangements as read-only once `booking_status=COMPLETED`; direct fulfillment subflow pages also block entry unless the booking is still in `IN_FULFILLMENT` or `READY_FOR_TRAVEL`.
- The backend legacy partner-booking contract now applies the same fulfillment-state gate to `/bookings/delete_booking_documents/` that already existed on the create/update fulfillment endpoints, closing the completed-state delete bypass.
- Phase 1 also added an admin reported-travelers section, but Phase 2 later confirmed the admin data path still needs a `passport_validity_detail -> traveller_detail` normalization step before `BOOKING-009` can be treated as complete.
- Verification is intentionally deferred to Phase 2 by the run boundary; Phase 1 added targeted backend tests for the new delete/report contract expectations but did not run build/check/test commands yet.

### 2026-03-11 - Fix Backlog Phase 1 Booking Contract Batch 02
- Implemented `BOOKING-005` and `BOOKING-006` in `Huz-Admin-Frontend` without changing backend routes or schema.
- Admin partner booking detail and fulfillment subflows now carry booking identity in the URL under `/booking/:bookingNumber/...`; legacy `/bookingdetails` and `/package/*` entrypoints now redirect into those route-owned paths.
- The admin booking detail flow now centralizes booking-number parsing/fetch behavior in `bookingRouteUtils.js` and `BookingDetailsPage/useAdminBookingLoader.js`, and `BookingContext` no longer persists the selected booking or booking number in `localStorage`.
- Admin `Pending.js` now honors backend `operator_can_act` before rendering the decision form, so the partner panel no longer offers actions the workflow contract says are unavailable.
- Verification is intentionally deferred to Phase 2 by the run boundary; no build, backend-check, or test commands were run in this implementation phase.

### 2026-03-11 - Fix Backlog Phase 1 Booking Contract Batch 01
- Implemented the first bounded booking-contract remediation batch in `Huz-Admin-Frontend` without changing backend route contracts.
- Admin partner-panel contract consumers now align to the backend’s paginated booking, complaint, and receivable payloads instead of filtering or slicing one fetched page locally.
- Super-admin partner settlement review no longer depends on the hidden `payment_detail` branch of `/bookings/get_booking_detail_by_booking_number/`; it now hydrates payment proofs from the management paid-bookings queue while keeping the richer booking-detail payload for the rest of the page.
- Adjacent approval-page hardening included a `package_cost` fallback in the shared package review card so package pricing still renders correctly when the approval serializers do not expose `base_cost`.
- Verification for this phase:
  - `npm run build` passed in `Huz-Admin-Frontend` with pre-existing warnings only.
  - `manage.py check` passed in `Huz-Backend` via the project virtualenv.
  - `manage.py test booking.tests --keepdb --noinput` did not complete cleanly because the environment hit existing MySQL test-database/connection issues (`test_defaultdb` already existed, then the suite hit `Lost connection to MySQL server during query`).

### 2026-03-11 - Dead Code Prune
- Completed a workspace dead-code prune after static import-graph verification from the active frontend entrypoints.
- Removed retired web-panel legacy surfaces:
  - `Huz-Web-Frontend/src/api/apiService.js`
  - `Huz-Web-Frontend/src/pages/UserSetting/sidebar.jsx`
- Removed unreferenced admin/operator legacy UI leftovers:
  - old admin onboarding/signup/account-review source under `Huz-Admin-Frontend/src/pages/AccountSetup`, `src/pages/Signup`, `src/pages/OTP`, `src/pages/PasswordSignupPage`, and related unused shared components/helpers
  - unused operator booking-detail `Close.jsx` and `src/utils/createHuzBasicDetailUtil.js`
- Removed generated build output and cache folders created during verification (`build`, `dist`, backend `__pycache__`) plus empty source folders left behind by the prune.
- Post-prune state:
  - static import-graph scan reports `0` unreachable source files under `Huz-Web-Frontend/src`, `Huz-Admin-Frontend/src`, and `Huz-Operator-Frontend/src`
  - active account navigation ownership now lives entirely in `Huz-Web-Frontend/src/features/accountModule/*`; the older page-local sidebar file no longer exists
  - web-panel legacy API wrapper retirement is complete; audited active consumers now route through domain-specific API modules only

### 2026-03-11 - Deep Scan Booking Contract Audit Scope Refresh
- Phase 0 refreshed atlas context for a booking contract audit spanning `Huz-Web-Frontend`, `Huz-Admin-Frontend`, `Huz-Operator-Frontend`, and `Huz-Backend`; the previous atlas heavily favored the web-panel `/api/v1` work and under-described admin/operator consumers.
- Scope confirmed for this run:
  - customer booking/support flows in `Huz-Web-Frontend/src/routes/AppRoutes.jsx`, `src/features/booking/*`, `src/features/bookingStatus/*`, `src/features/paymentMethods/*`, `src/features/remainingPayment/*`, `src/features/travelersInfo/*`, `src/api/bookingApi.js`, and `src/api/supportApi.js`
  - partner/admin booking flows in `Huz-Admin-Frontend/src/App.js`, `src/pages/Admin-Panel/Bookings/*`, `src/pages/Admin-Panel/Dashboard/*`, `src/pages/Admin-Panel/Complaints/*`, `src/pages/Admin-Panel/ReviewsRatings/*`, and super-admin approval queues under `src/pages/dashboard/dashboard-pages/ApproveAmounts*`
  - operator flows in `Huz-Operator-Frontend/src/routes/index.jsx`, `src/pages/Dashboard/DashboardRoutes.jsx`, `src/pages/Dashboard/BookingsModule/*`, `src/pages/Dashboard/components/overview/*`, `src/pages/Dashboard/Complaints/*`, `src/pages/Dashboard/ReviewsRatings/*`, `src/api/BookingApi.js`, `src/api/DashboardApi.js`, `src/api/complaintsAPI.js`, and `src/api/ReviewRatingAPI.js`
  - backend contract owners in `Huz-Backend/booking/*`, `Huz-Backend/common/api_urls.py`, `Huz-Backend/management/*`, and `Huz-Backend/huz/urls.py`
- Contract split to carry into Phase 1:
  - `Huz-Web-Frontend` is primarily on canonical `/api/v1` booking and support resources.
  - `Huz-Admin-Frontend` and `Huz-Operator-Frontend` still depend on legacy partner-session `/bookings/*` endpoints plus booking-derived dashboard, complaint, rating, and receivable summary APIs.
  - super-admin payment approval flows bridge `/management/*` endpoints with legacy booking detail reads, so booking-state changes can affect multiple panels even when the UI is not on a booking-detail route.
- No mismatch fixes were implemented in this phase; this refresh only establishes the exact scan perimeter and the shared vocabulary for statuses, workflow buckets, issue states, timers, permissions, and side-effect-bearing summary APIs.

### 2026-03-11 - Deep Scan Booking Contract Audit Verification
- Phase 3 revalidated the three documented booking drifts directly in source and synced the atlas with the concrete contract edges uncovered during the audit.
- Confirmed contract realities:
  - `/bookings/get_receivable_payment_statistics/` returns a paginated envelope (`count`, `next`, `previous`, `results`), while the current admin receivable views still call array helpers on the raw payload.
  - super-admin partner settlement review refetches `/bookings/get_booking_detail_by_booking_number/`, and that partner-detail contract still forces `hide_payment_detail=True`, so payment-proof review cannot rely on `payment_detail` from this endpoint.
  - the operator dashboard "Recent Bookings" card is only cross-bucket when `VITE_DASHBOARD_SUMMARY_ENDPOINT` is configured; in the checked-in repo config the fallback path is active and forces `workflow_bucket=READY`.
- Operational implication:
  - customer `/api/v1` booking flows remain the cleaner contract surface, but admin/operator summaries and settlement review still hinge on legacy partner-session contracts whose payload semantics are not interchangeable.
- This phase stayed audit-only; the verified drifts remain open backlog items `BOOKING-001`, `BOOKING-002`, and `BOOKING-003`.

### 2026-03-11 - Booking Frontend/Backend Audit Expansion
- A second audit pass widened the contract review from the three existing documented drifts to the broader state-ownership and pagination behavior across all three panels.
- New realities confirmed in source:
  - `Huz-Admin-Frontend` booking and complaints modules still fetch one server page and then search/paginate locally, so the UI can silently hide backend records.
  - `Huz-Admin-Frontend` booking detail still has weaker workflow gating than the backend because its pending-action form ignores `operator_can_act`.
  - admin booking subflows still rely on one global `localStorage("bookingNumber")`, while operator subflows are route-scoped under `/booking-module/booking/:bookingNumber/...`.
  - completed-booking edit/update entrypoints remain visible in both partner panels even though backend fulfillment create/update endpoints only allow `IN_FULFILLMENT` and `READY_FOR_TRAVEL`.
  - the web customer panel is now the cleanest booking-contract consumer in the repo, with only a lower-severity support-media URL origin issue left in the audited live path.
- The durable audit report for this pass lives at:
  - `docs/codex_reports/BOOKING_FRONTEND_BACKEND_AUDIT_2026-03-11.md`

### 2026-03-09 - Account Module Consolidation
- Sidebar-backed account routes now share a dedicated frontend feature module under `Huz-Web-Frontend/src/features/accountModule/`.
- New shared ownership boundary:
  - `components/AccountPageShell.jsx` owns `BrandPageShell`, ambient/promo usage, surface spacing, and the sidebar grid contract
  - `components/AccountPageHero.jsx` owns the top banner/title/actions/metric-card grammar
  - `components/AccountSectionCard.jsx` owns the main account panel/card grammar
  - `components/AccountSidebarMenu.jsx` plus `accountNavigation.js` own the account navigation structure and active-state rules
- Migrated routes in this batch:
  - `src/pages/UserSetting/PersonalDetailsPage.js`
  - `src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx`
  - `src/pages/UserSetting/Wishlist/wishlist.jsx`
  - `src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx`
  - `src/pages/UserSetting/Support/help.jsx`
  - `src/pages/UserSetting/Message/messagePage.jsx`
  - `src/pages/UserSetting/RemainingPayment/remainingPayment.jsx`
- Route paths, API modules, and data hooks remained unchanged; the migration is structural/layout-focused only.
- Verification for the batch:
  - `npm run build` passed
  - remaining warnings stayed limited to the unrelated package-detail unused imports and the existing bundle-size advisory

### 2026-03-09 - Account Route Design-System Alignment
- Active user-setting routes that were still visually and structurally off-system now follow the same shell rules as the homepage/auth/profile/listing references.
- Standardized route surfaces:
  - `src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx`
  - `src/pages/UserSetting/RemainingPayment/remainingPayment.jsx`
  - `src/pages/UserSetting/Wishlist/wishlist.jsx`
  - `src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx`
- Shared account chrome was refreshed at the component level:
  - `src/pages/UserSetting/sidebar.jsx`
  - `src/pages/UserSetting/stepper.jsx`
  - `src/pages/UserSetting/mobilestepper.jsx`
- Design-system alignment decisions for this batch:
  - use `BrandPageShell` instead of manual `Header` plus custom page wrappers
  - keep one responsive component tree per route instead of separate mobile and desktop page implementations
  - reuse shared spacing, promo, empty/loading/error, and surface patterns where possible instead of page-local gray utility stacks
- Dead code removal stayed conservative: only orphaned message aliases/components with no live route or import path were deleted.
- Verification for the batch:
  - `npm run build` passed
  - remaining warnings are unrelated package-detail unused imports plus the existing bundle-size advisory

### 2026-03-09 - Web Panel API Refactor Execution
- Implemented canonical web-panel self-service routes across frontend and backend for active booking, profile, and wallet flows.
- Active frontend consumers no longer depend on `Huz-Web-Frontend/src/api/apiService.js`; domain ownership now lives in:
  - `src/api/bookingApi.js`
  - `src/api/profileApi.js`
  - `src/api/walletApi.js`
  - `src/api/supportApi.js`
  - `src/api/publicPackagesApi.js`
- Backend added authenticated `v1` self-service route groups for:
  - `/api/v1/users/me/profile/`
  - `/api/v1/users/me/address/`
  - `/api/v1/users/me/wallet/...`
  - booking reviews / complaints / requests / objection response under `/api/v1/bookings/...`
- Booking payments and traveler passport updates now support multipart uploads through their canonical `v1` resource endpoints instead of legacy file-only routes.
- Public package reads were centralized in one frontend module but intentionally remain on `/partner/...` until a separate namespace decision is made.
- Verification completed for the refactor batch:
  - frontend production build passed
  - Django `manage.py check` passed
  - focused backend tests for new `common` and `booking` `v1` flows passed

### 2026-03-06 - Backend Optimize Phase 1
- Backend optimization pass completed for `Huz-Backend` with contract-preserving changes.
- Public package discovery flow now uses a shared optimized queryset path (`select_related + prefetch_related`) for:
  - `/partner/get_package_short_detail_for_web/`
  - `/partner/get_featured_packages/`
  - `/partner/get_package_detail_by_city_and_date/`
  - `/partner/get_package_detail_by_package_id_for_web/`
- Serializer relation access was normalized in partner and booking serializer stacks to avoid redundant fallback queries when relations are already prefetched-empty.
- OTP SMS gateway calls in user profile flows now use explicit timeout + retry behavior to bound blocking external dependency calls.
- Additive DB index coverage was introduced for package, booking, and OTP/user lookup hotspots (via new model `Meta.indexes` + migrations).
- Security/auth migration work (principal-based partner auth and legacy booking permission alignment) remains intentionally deferred to follow-on compatibility-focused phases.

### 2026-03-06 - Backend Optimize Phase 2 Verification
- Django runtime verification completed from project virtualenv:
  - `manage.py check` passed.
  - `manage.py makemigrations --check --dry-run partners booking common` passed.
  - Focused regression tests passed (`15/15`) for touched areas:
    - OTP throttle/API behavior
    - Partner package management flows
    - Booking user list/detail flow coverage.
- Full system-wide perf benchmark rerun remains pending deployment-like environment availability.

### 2026-03-06 - Contract Sync Frontend Alignment (Huz-Web-Frontend)
- Web frontend booking/complaint/request/traveler wrappers were reconciled to current backend contracts.
- Contract direction chosen:
  - Prefer `/api/v1` booking endpoints where available.
  - Keep compatibility fallbacks to `/bookings/*` legacy routes for controlled migration.
- Frontend consumer assumptions were updated for backend serializer shapes:
  - Traveler detail now resolves from `passport_validity_detail`.
  - Passport records use `passport_id` instead of deprecated client-only `traveller_id`.
  - Payment extraction supports direct serializer response (`payment_detail`) and nested legacy envelopes.
- Auth migration note:
  - Frontend now injects legacy `session_token` payload value from auth cookies when required by legacy booking endpoints, reducing contract breakage during backend permission migration.
