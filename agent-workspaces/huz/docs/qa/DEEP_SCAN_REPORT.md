# Deep Scan Report

Use this report for on-demand deep analysis of logic, structures, routes, contracts, and mismatch risks.

## Findings
- Add findings grouped by module or concern.

### Release Gate Run 20260311-195057 Phase 2 Verdict
- Status: `GO` for the scoped March 11 booking-contract release gate. No target-project source files changed in this phase.
- Final release-state record written to:
  - `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-195057-release-gate/RELEASE_VERDICT.md`
- Final gate basis:
  - `BOOKING-001` through `BOOKING-011` are resolved with verification evidence.
  - The Phase 1 gate passed across all required surfaces: admin build; operator lint, check scripts, build, and Playwright smoke; web build; backend `manage.py check --settings=huz.settings_test`; and the targeted 13-test booking/payment/support/report suite.
- Non-blocking watch items carried into the verdict:
  - `/Users/macbook/Desktop/Huz/scripts/release-gate.sh` remains stale for the current repo state and should not replace the scoped checklist commands until it is repaired.
  - `WEB-001` and `WEB-002` remain open as separate non-booking follow-up items and do not change the March 11 booking verdict.

### Release Gate Run 20260311-195057 Phase 1 Execution
- Status: Completed. The scoped March 11 booking-contract blocker set is now fully resolved for release-verdict handoff.
- Safe blocker fix completed in this phase:
  - `BOOKING-009` closed by adding additive `traveller_detail` compatibility to the legacy partner booking detail/report serializer path and by reloading the booking before the `REPORTED` traveler response is serialized, eliminating the stale prefetched-passport response that had kept the admin reported-travelers surface unverified.
  - the targeted release-gate approval test debt inside `ApproveBookingPaymentViewTests` was also corrected so the gate suite exercises the intended full-payment lifecycle instead of failing on a missing helper.
- Automated verification completed in this phase:
  - `Huz-Admin-Frontend`: `npm run build` passed with pre-existing warnings only.
  - `Huz-Operator-Frontend`: `npm run lint`, `npm run check:tokens`, `npm run check:keys`, `npm run check:blankrel`, `npm run check:bundle`, `npm run build`, and `npm run test:e2e` all passed.
  - `Huz-Web-Frontend`: `npm run build` passed; warning output stayed limited to `WEB-001` plus the existing bundle-size advisory.
  - `Huz-Backend`: `manage.py check --settings=huz.settings_test` passed; the targeted 13-test booking/payment/support/report suite passed after the compatibility fix.
- Release-gate state after Phase 1:
  - `BOOKING-001` through `BOOKING-011` are now resolved in code with verification evidence.
  - `/Users/macbook/Desktop/Huz/scripts/release-gate.sh` remains stale for the current repo state and should not be used for the final verdict; keep using the scoped checklist commands instead.
  - `WEB-001` and `WEB-002` remain non-booking watch items, not March 11 booking blockers.

### Release Gate Run 20260311-195057 Phase 0 Checklist Assembly
- Status: Ready for execution planning only. No target-project code changed in this phase.
- Checklist written to:
  - `docs/project-bot/runs/20260311-195057-release-gate/RELEASE_CHECKLIST.md`
- Mandatory gate coverage locked for the next phase:
  - `Huz-Admin-Frontend`: `npm run build`
  - `Huz-Operator-Frontend`: `npm run lint`, `npm run check:tokens`, `npm run check:keys`, `npm run check:blankrel`, `npm run check:bundle`, `npm run build`, `npm run test:e2e`
  - `Huz-Web-Frontend`: `npm run build`
  - `Huz-Backend`: `manage.py check --settings=huz.settings_test` plus targeted booking/payment/support/report tests under `booking.tests.*`
- Hard blockers and execution risks identified before Phase 1:
  - `BOOKING-009` remains the only unresolved item in `BOOKING-001` through `BOOKING-011`, so the release gate cannot end in `GO` until that admin reported-traveler path is fixed or explicitly blocked with proof.
  - `/Users/macbook/Desktop/Huz/scripts/release-gate.sh` is stale for the current repo state because it invokes several `Huz-Web-Frontend` scripts that no longer exist in `package.json`; the release gate must use the scoped commands captured in the checklist instead.
  - The project-local March 11 booking docs were stale versus the workspace memory before this phase, so Phase 2 must keep those docs synchronized when writing the final verdict.
  - `WEB-001` and `WEB-002` remain known non-booking warnings to watch during build verification.
- Verification basis:
  - required atlas docs, workspace backlog/deep scan, project-local March 11 audit docs, current package scripts, backend test inventory in `Huz-Backend/booking/tests.py`, `scripts/release-gate.sh`, and live `git status` across all four repos

### Booking Contract Audit Scope Refresh (Phase 0)
- Status: Completed for atlas context refresh; mismatch analysis is deferred to later phases.
- Scope confirmed:
  - `Huz-Web-Frontend` customer routes `/bookings`, `/package-booking`, `/payment-methods`, `/booking-status`, `/remaining-payment`, `/help`, and `/operator-response`
  - `Huz-Admin-Frontend` partner routes `/dashboard`, `/partner-dashboard`, `/booking`, `/bookingdetails`, `/all-payments`, `/complaints`, `/reviews-ratings`, and `/package/*` booking subflows plus super-admin routes `/approve-amounts`, `/booking-details`, `/approve-partners-amounts`, and `/booking-details-for-partners`
  - `Huz-Operator-Frontend` dashboard `/`, `/booking-module/*`, `/complaints`, and `/reviews-ratings`
  - backend namespaces `/api/v1/`, `/bookings/`, and `/management/`
- Durable context added:
  - refreshed required atlas docs and filled the empty booking-relevant reference docs (`SYSTEM_BLUEPRINT.md`, `PANEL_MODULE_INDEX.md`, `ROUTE_MATRIX.md`, and `API_CONTRACT_REGISTRY.md`)
  - corrected a stale atlas claim: `Huz-Web-Frontend/src/api/supportApi.js` is actively imported by `src/pages/UserSetting/Support/help.jsx` and `src/pages/UserSetting/OperatorResponse/operatorresponse.jsx`
- Key phase-0 framing for later analysis:
  - customer web flows and operator/admin flows do not share one HTTP contract surface; the audit must compare canonical user `/api/v1` routes against active legacy partner/session `/bookings/*` and `/management/*` routes
  - dashboard, complaint, review, and receivable screens are in scope because they consume booking-derived summaries and can reveal booking-state drift without opening a booking-detail page
- Verification basis:
  - route owners confirmed from `Huz-Web-Frontend/src/routes/AppRoutes.jsx`, `Huz-Admin-Frontend/src/App.js`, `Huz-Operator-Frontend/src/routes/index.jsx`, `Huz-Operator-Frontend/src/pages/Dashboard/DashboardRoutes.jsx`, and `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingRoutes.jsx`
  - backend namespaces confirmed from `Huz-Backend/huz/urls.py`, `Huz-Backend/booking/api_urls.py`, `Huz-Backend/booking/urls.py`, `Huz-Backend/common/api_urls.py`, and `Huz-Backend/management/urls.py`
  - consumer ownership confirmed from `Huz-Web-Frontend/src/api/bookingApi.js`, `Huz-Web-Frontend/src/api/supportApi.js`, `Huz-Operator-Frontend/src/api/BookingApi.js`, `Huz-Operator-Frontend/src/api/DashboardApi.js`, `Huz-Admin-Frontend/src/utility/Api.js`, and `Huz-Admin-Frontend/src/utility/Super-Admin-Api.js`

### Account Route Design Drift
- Status: Resolved for the live outliers audited in this batch.
- Scope:
  - `src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx`
  - `src/pages/UserSetting/RemainingPayment/remainingPayment.jsx`
  - `src/pages/UserSetting/Wishlist/wishlist.jsx`
  - `src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx`
- Problems that existed before the cleanup:
  - manual `Header` plus custom wrapper composition instead of `BrandPageShell`
  - duplicated desktop/mobile page trees that drifted in spacing and state handling
  - one-off cards, filters, search bars, and message states that did not use the current shared surface language
- Resolution:
  - moved the live routes onto the common shell and homepage spacing tokens
  - collapsed route rendering into single responsive hierarchies
  - reused shared empty/loading/error/button/form styling primitives where practical

### Shared User-Setting Chrome Drift
- Status: Resolved for currently used account chrome.
- Scope:
  - `src/pages/UserSetting/sidebar.jsx`
  - `src/pages/UserSetting/stepper.jsx`
  - `src/pages/UserSetting/mobilestepper.jsx`
- Findings:
  - the previous account navigation and step indicators were visually older than the rest of the app and reinforced route-level inconsistency
- Resolution:
  - refreshed all three components to use the same branded card, border, spacing, and emphasis system as active public and authenticated surfaces

### Dead Message Wrapper Cleanup
- Status: Resolved.
- Deleted:
  - `src/pages/UserSetting/Message/message.jsx`
  - `src/pages/UserSetting/Message/messagechat.jsx`
  - `src/components/MessageDisplay/MessageDisplay.js`
- Basis for deletion:
  - no live route import
  - no remaining source imports after replacement of the wishlist/message-state usage

### Residual Follow-Up
- `npm run build` still reports unrelated unused imports in `src/pages/PackageDetailPage/components/LeftColumn/Itinerary.js`.
- The frontend production build still emits the existing bundle-size advisory, which should be handled as a separate performance pass.

### User-Setting Module Contract Drift
- Status: Resolved.
- Live routes sharing the account sidebar:
  - `src/pages/UserSetting/PersonalDetailsPage.js`
  - `src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx`
  - `src/pages/UserSetting/Wishlist/wishlist.jsx`
  - `src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx`
  - `src/pages/UserSetting/Support/help.jsx`
  - `src/pages/UserSetting/Message/messagePage.jsx`
  - `src/pages/UserSetting/RemainingPayment/remainingPayment.jsx`
- Root cause:
  - only `SidebarMenu` is shared
  - each route still owns its own `BrandPageShell` configuration, outer surface spacing, sidebar visibility rules, hero structure, metric cards, and section wrappers
  - profile double-wraps the sidebar in an extra shell, while help/messages keep the sidebar visible outside the `hidden xl:block` pattern used elsewhere
- Desired migration target:
  - one reusable account-page shell for all sidebar-backed routes
  - one shared hero contract for the top module banner, description, actions, and metric cards
  - one shared section-card grammar for primary content panels
- Compatibility constraints:
  - keep route paths and business/data hooks stable
  - preserve page-specific flows like booking filters, wallet actions, and profile forms inside the new shared shell
  - keep responsive behavior consistent by centralizing the sidebar breakpoint and sticky behavior in one component
- Rollback note:
  - the migration can be reverted route-by-route because it does not require URL changes or API contract changes
- Planned migration sequence:
  - introduce a shared account-module feature layer for the sidebar-backed route shell and shared banner/section primitives
  - migrate the main sidebar tabs first: profile, booking status, wishlist, wallet, and help
  - move the remaining sidebar-backed account routes (`messagePage`, `remainingPayment`) onto the same shell if the extraction stays contract-safe in the same batch
  - keep page-specific business hooks, route paths, and API calls unchanged so verification stays focused on structure and rendering
- Resolution:
  - introduced `src/features/accountModule/` with shared account shell, hero, section-card, sidebar, and navigation-state ownership
  - migrated the live sidebar-backed routes onto the shared module:
    - `src/pages/UserSetting/PersonalDetailsPage.js`
    - `src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx`
    - `src/pages/UserSetting/Wishlist/wishlist.jsx`
    - `src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx`
    - `src/pages/UserSetting/Support/help.jsx`
    - `src/pages/UserSetting/Message/messagePage.jsx`
    - `src/pages/UserSetting/RemainingPayment/remainingPayment.jsx`
  - normalized sidebar visibility/sticky behavior and the account hero/panel grammar across the migrated routes

### Booking Contract Audit Findings (Phase 1)
- Status: Open. Phase 1 traced booking route contracts across `Huz-Web-Frontend`, `Huz-Admin-Frontend`, `Huz-Operator-Frontend`, and `Huz-Backend`. Customer `/api/v1` flows were broadly aligned; the concrete drifts were concentrated in partner/session consumers.

#### Finding 1: Admin receivable-payments screens assume an array against a paginated backend response
- Affected backend endpoint:
  - `Huz-Backend/booking/urls.py` maps `/bookings/get_receivable_payment_statistics/` to `PartnersBookingPaymentView`.
  - `Huz-Backend/booking/manage_partner_booking.py:1609-1616` paginates and returns `paginator.get_paginated_response(...)`, so the payload shape is `{count,next,previous,results}` rather than a raw list.
- Affected frontend consumers:
  - `Huz-Admin-Frontend/src/utility/Api.js:1138-1152` returns `response.data` without normalizing pagination.
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Wallet/components/ReceivablePayments/AllPayments.jsx:28-29,58,71` treats the payload as an array with `data.length` and `data.map(...)`.
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Wallet/components/ReceivablePayments/CardList.jsx:80-85,120,130` treats the payload as an array and calls `result.slice(0, 5)`.
- Impact:
  - `CardList` can fail with `result.slice is not a function`.
  - `AllPayments` can mis-render or fail once the API returns the paginated object used by the backend.
- Fix ownership:
  - Frontend consumption. Normalize to `payload.results` plus pagination metadata, or move the admin wallet to the same shared list-normalization pattern already used in the operator wallet layer.

#### Finding 2: Super-admin partner settlement detail refetches a booking contract that hides payment evidence
- Affected backend endpoint:
  - `Huz-Backend/booking/manage_partner_booking.py:379-380` serializes `/bookings/get_booking_detail_by_booking_number/` with `hide_payment_detail: True`.
  - `Huz-Backend/booking/serializers.py:366-369` returns `[]` for `payment_detail` whenever that flag is set.
- Affected frontend consumers:
  - `Huz-Admin-Frontend/src/utility/Super-Admin-Api.js:309-319` refetches that legacy partner-detail endpoint for the partner settlement review route.
  - `Huz-Admin-Frontend/src/pages/dashboard/dashboard-pages/ApproveAmountsPartners/BookingDetailsPage/BookingDetailsComponent.js:27-35,77-85` replaces the route-state booking with the refetched object and passes it into `TransactionDetails`.
  - `Huz-Admin-Frontend/src/pages/dashboard/dashboard-pages/ApproveAmountsPages/BookingDetailsPage/TransactionDetails.js:7-20,82-87` expects `booking.payment_detail` and falls back to the "No transaction records" state when the array is empty.
- Impact:
  - The partner settlement approval flow can hide uploaded payment proofs even though the page is explicitly positioned as a transfer-validation screen.
- Fix ownership:
  - Both, but primarily frontend/API selection. The screen should use a management review serializer or management detail endpoint that exposes payment evidence instead of the partner-hidden detail contract.

#### Finding 3: Operator dashboard recent-bookings card is wired to the `READY` queue only in the current repo configuration
- Current repo configuration:
  - `Huz-Operator-Frontend/.env` defines only `VITE_API_BASE_URL`; there is no `VITE_DASHBOARD_SUMMARY_ENDPOINT`.
  - `Huz-Operator-Frontend/src/api/DashboardApi.js:13,216-218` skips the summary-endpoint path when that env var is empty.
- Fallback behavior:
  - `Huz-Operator-Frontend/src/api/DashboardApi.js:431-439` falls back to `getRecentBookings({ page: 1, pageSize: recentBookingsLimit })`.
  - `Huz-Operator-Frontend/src/api/DashboardApi.js:578-585` gives `getRecentBookings` a default `status = "READY"` and always sends `workflow_bucket=READY`.
- Backend contract:
  - `Huz-Backend/booking/manage_partner_booking.py:289-290` requires `booking_status` or `workflow_bucket` on `/bookings/get_all_booking_detail_for_partner/`.
  - `Huz-Backend/booking/manage_partner_booking.py:320-330` filters the queryset to the requested bucket before pagination.
- UI impact:
  - The dashboard card titled "Recent Bookings" with the description "Most recent booking updates for faster operational follow-up." (`Huz-Operator-Frontend/src/pages/Dashboard/components/overview/RecentBookingsMiniList.jsx:33-37`) excludes fulfillment, ready-for-travel, issue, and history bookings when the fallback path is active.
- Fix ownership:
  - Frontend consumption or backend summary-endpoint adoption. Either fetch recent activity without queue restriction through a dedicated dashboard contract, or rename the card so it accurately describes a ready-queue snapshot.

#### Verified non-findings captured during the audit
- Partner booking actions are aligned:
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Pending.js` and `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/Pending.jsx` send `IN_FULFILLMENT` and `OPERATOR_OBJECTION`.
  - `Huz-Backend/booking/manage_partner_booking.py:433-439` lowercases and accepts both values.
- Customer support file-type assumptions are aligned for complaint uploads:
  - `Huz-Web-Frontend/src/pages/UserSetting/Support/supportUtils.js:37-40` allows `.doc` and `.docx`.
  - `Huz-Backend/common/utility.py:71-77` accepts `.png`, `.jpg`, `.jpeg`, `.pdf`, `.doc`, and `.docx`.
- Operator dashboard summary counts are aligned:
  - `Huz-Backend/booking/manage_partner_booking.py:1486-1504` returns workflow-bucket counts, including `ISSUES`.
  - `Huz-Operator-Frontend/src/utils/bookingDomain.js:193-198` reads `ISSUES` correctly into the dashboard summary model.

### Booking Contract Audit Packaging (Phase 2)
- Status: Open. Phase 2 converted the Phase 1 mismatch evidence into a durable execution-ready package without changing application code.

#### Prioritized concern groups
- High: `BOOKING-001` admin receivable-payments views (`Huz-Admin-Frontend/src/utility/Api.js`, `src/pages/Admin-Panel/Wallet/components/ReceivablePayments/*`) still assume an array even though `/bookings/get_receivable_payment_statistics/` returns paginated data.
- High: `BOOKING-002` super-admin partner settlement review (`Huz-Admin-Frontend/src/utility/Super-Admin-Api.js`, `src/pages/dashboard/dashboard-pages/ApproveAmountsPartners/*`) still refetches a partner detail contract that intentionally strips `payment_detail`.
- Medium: `BOOKING-003` operator dashboard recent-bookings summary (`Huz-Operator-Frontend/src/api/DashboardApi.js`, `src/pages/Dashboard/components/overview/RecentBookingsMiniList.jsx`) still falls back to the `READY` workflow bucket when no summary endpoint is configured.
- Recommended execution order: fix `BOOKING-001` and `BOOKING-002` first because they can hide or break money-related review flows, then address `BOOKING-003` because it is a misleading summary/reporting issue rather than a blocking transaction failure.

#### Scope scanned
- `Huz-Web-Frontend` booking-dependent customer flows under `/bookings`, `/package-booking`, `/booking-status`, `/remaining-payment`, `/help`, and `/operator-response`.
- `Huz-Admin-Frontend` booking, settlement, complaint, review, wallet, and dashboard flows under `/dashboard`, `/partner-dashboard`, `/booking`, `/bookingdetails`, `/all-payments`, `/approve-amounts`, `/approve-partners-amounts`, `/booking-details`, and `/booking-details-for-partners`.
- `Huz-Operator-Frontend` dashboard, booking module, complaint, and review surfaces under `/`, `/booking-module/*`, `/complaints`, and `/reviews-ratings`.
- `Huz-Backend` booking/common/management routes that own booking detail, payment-detail visibility, workflow buckets, receivable summaries, and dashboard-dependent list/detail serializers.

#### Files examined
- Route and perimeter confirmation:
  - `Huz-Web-Frontend/src/routes/AppRoutes.jsx`
  - `Huz-Admin-Frontend/src/App.js`
  - `Huz-Operator-Frontend/src/routes/index.jsx`
  - `Huz-Operator-Frontend/src/pages/Dashboard/DashboardRoutes.jsx`
  - `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingRoutes.jsx`
  - `Huz-Backend/huz/urls.py`
  - `Huz-Backend/booking/api_urls.py`
  - `Huz-Backend/booking/urls.py`
  - `Huz-Backend/common/api_urls.py`
  - `Huz-Backend/management/urls.py`
- Customer booking/support contract samples:
  - `Huz-Web-Frontend/src/api/bookingApi.js`
  - `Huz-Web-Frontend/src/api/supportApi.js`
  - `Huz-Web-Frontend/src/pages/UserSetting/Support/supportUtils.js`
- Admin and super-admin booking consumers:
  - `Huz-Admin-Frontend/src/utility/Api.js`
  - `Huz-Admin-Frontend/src/utility/Super-Admin-Api.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Wallet/components/ReceivablePayments/AllPayments.jsx`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Wallet/components/ReceivablePayments/CardList.jsx`
  - `Huz-Admin-Frontend/src/pages/dashboard/dashboard-pages/ApproveAmountsPartners/BookingDetailsPage/BookingDetailsComponent.js`
  - `Huz-Admin-Frontend/src/pages/dashboard/dashboard-pages/ApproveAmountsPages/BookingDetailsPage/TransactionDetails.js`
- Operator booking/dashboard consumers:
  - `Huz-Operator-Frontend/.env`
  - `Huz-Operator-Frontend/src/api/BookingApi.js`
  - `Huz-Operator-Frontend/src/api/DashboardApi.js`
  - `Huz-Operator-Frontend/src/pages/Dashboard/components/overview/RecentBookingsMiniList.jsx`
  - `Huz-Operator-Frontend/src/utils/bookingDomain.js`
- Backend contract owners and supporting logic:
  - `Huz-Backend/booking/manage_partner_booking.py`
  - `Huz-Backend/booking/serializers.py`
  - `Huz-Backend/booking/workflow.py`
  - `Huz-Backend/booking/statuses.py`
  - `Huz-Backend/management/approval_task.py`
  - `Huz-Backend/common/utility.py`

#### Remaining blind spots
- This audit stayed static-analysis only. No live API requests, seeded bookings, or production payload captures were available in this phase.
- The `VITE_DASHBOARD_SUMMARY_ENDPOINT` branch was not exercised because the checked-in `Huz-Operator-Frontend/.env` does not define it; deployments with a configured summary endpoint may avoid `BOOKING-003`.
- Booking timers and status side effects were traced from code ownership, but no background job or time-based transition was executed against real data in this phase.
- Permission checks were verified from route ownership, request helpers, and backend guards, not from authenticated runtime sessions for each actor type.
- Customer `/api/v1` booking flows sampled cleanly during this run, but no byte-for-byte serializer snapshot suite exists yet across all booking statuses and historical edge cases.

### Booking Contract Audit Verification (Phase 3)
- Status: Completed for verification and atlas sync. No new booking mismatches were added in this phase.
- Sanity-check results:
  - `BOOKING-001` remains valid: `Huz-Backend/booking/manage_partner_booking.py` still returns `paginator.get_paginated_response(...)` from `/bookings/get_receivable_payment_statistics/`, while `Huz-Admin-Frontend/src/pages/Admin-Panel/Wallet/components/ReceivablePayments/AllPayments.jsx` and `CardList.jsx` still treat the payload as a raw array.
  - `BOOKING-002` remains valid: `Huz-Admin-Frontend/src/utility/Super-Admin-Api.js` still refetches `/bookings/get_booking_detail_by_booking_number/`, and the backend still serializes that partner-detail response with `hide_payment_detail=True`, leaving `TransactionDetails` dependent on an empty `payment_detail` array.
  - `BOOKING-003` remains valid in this repo configuration: `Huz-Operator-Frontend/.env` still omits `VITE_DASHBOARD_SUMMARY_ENDPOINT`, and `Huz-Operator-Frontend/src/api/DashboardApi.js` still defaults fallback recent-bookings requests to `workflow_bucket=READY`.
- Atlas sync completed:
  - refreshed `docs/atlas/PROJECT_BLUEPRINT.md`, `docs/atlas/MODULE_MAP.md`, `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`, `docs/atlas/API_SURFACE.md`, and `docs/atlas/CHANGE_MAP.md` so future runs inherit these contract caveats without reconstructing them from the scan report alone.
- Blind-spot status unchanged:
  - no runtime API captures, seeded data, or actor-specific authenticated sessions were added in Phase 3.

### Frontend/Backend Booking Audit Expansion (2026-03-11)
- Status: Open. This pass expanded the booking-contract scan across the web, operator, and admin panels with a stronger focus on pagination ownership, state sourcing, and route-to-workflow gating.
- Full report:
  - `docs/codex_reports/BOOKING_FRONTEND_BACKEND_AUDIT_2026-03-11.md`

#### New high-severity drifts
- `BOOKING-004`: Admin booking list still fetches only one paginated backend page, then performs search and pagination only on `data.results`.
- `BOOKING-005`: Admin booking `Pending` action ignores backend `operator_can_act`, unlike the operator panel.
- `BOOKING-006`: Admin booking subflows still use one global `localStorage("bookingNumber")` instead of route-owned booking identity.
- `BOOKING-007`: Admin complaints review also consumes only one backend page and drops available complaint-id/search/date filters.

#### New medium/low-severity drifts
- `BOOKING-008`: Admin and operator completed-booking detail screens still expose edit/update entrypoints even though backend fulfillment create/update endpoints reject `COMPLETED`.
- `BOOKING-009`: Admin booking detail has no reported-travelers surface for `issue_status=REPORTED`, even though backend and operator detail support it.
- `BOOKING-010`: Operator booking search promises traveler-name search while the API/backend filter only supports booking number.
- `BOOKING-011`: Web help/support history resolves relative attachment/audio URLs against the frontend origin instead of `REACT_APP_API_BASE_URL`.

#### Audit-level conclusion
- The customer web booking flow is currently the cleanest FE/BE contract surface in this repo.
- Most remaining risk is concentrated in legacy admin partner-session consumers, with operator drift limited mainly to summary/search honesty and completed-flow affordances.
- The admin panel is still the biggest source of state-ownership drift because it mixes paginated backend contracts, global `localStorage` booking identity, and UI gates that are weaker than the backend workflow contract.

### Fix Backlog Phase 1 - Booking Contract Batch 01 (2026-03-11)
- Status: Completed for the bounded implementation batch covering `BOOKING-004`, `BOOKING-007`, `BOOKING-001`, and `BOOKING-002`.
- Implemented changes:
  - admin booking list now consumes `/bookings/get_all_booking_detail_for_partner/` with backend `page`, `page_size`, and `booking_number` parameters instead of searching/paginating inside one fetched page
  - admin complaints view now consumes paginated complaint envelopes and forwards backend search/date filters instead of rendering only `results` from one page
  - admin receivable card and `/all-payments` now normalize `/bookings/get_receivable_payment_statistics/` before slicing/mapping and paginate through the normalized envelope on the full page
  - partner settlement review now preserves the richer booking detail payload but hydrates `payment_detail` from `/management/fetch_all_paid_bookings/`, removing the false empty-proof state caused by the hidden legacy detail contract
  - adjacent approval-page hardening fixed the shared package review card to fall back to `package_cost` when `base_cost` is not present in the serializer payload
- Verification:
  - `npm run build` in `Huz-Admin-Frontend`: passed with existing unrelated warnings
  - `Huz-Backend/.venv/bin/python manage.py check`: passed
  - `Huz-Backend/.venv/bin/python manage.py test booking.tests --keepdb --noinput`: could not be used as a clean signal because the environment hit existing MySQL test database/connection issues (`test_defaultdb` reuse plus lost MySQL connection)
- Remaining admin booking drift after this batch:
  - route-owned booking identity is still not fixed for admin booking subflows (`BOOKING-006`)
  - admin pending-action gating against backend `operator_can_act` is still open (`BOOKING-005`)
  - reported-traveler handling and completed-state edit affordance fixes remain deferred to later bounded batches

### Fix Backlog Phase 2 - Verification and Backlog Sync (2026-03-11)
- Status: Completed for scoped verification and durable backlog sync. No new booking mismatches were added in this phase.
- Verification completed:
  - `npm run build` in `Huz-Admin-Frontend`: passed again; the build still emits unrelated pre-existing lint/CSS-order warnings outside the scoped booking-contract files, but there were no compile failures.
  - `Huz-Backend/.venv/bin/python manage.py check`: passed again.
  - `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py test booking.tests.ManagePartnerBookingViewsTests.test_booking_list_filters_by_booking_number booking.tests.ManagePartnerBookingViewsTests.test_complaints_list_supports_status_and_search_filters booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_returns_paginated_empty_payload booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_are_scoped_to_partner booking.tests.ApproveBookingPaymentViewTests.test_admin_review_queue_includes_pending_full_payment_bookings --noinput`: passed (`5/5`) using the repository's local SQLite test settings instead of the flaky MySQL test-db path.
- Contract confidence gained in this phase:
  - admin booking pagination is backed by a passing backend filter test for `booking_number` on `/bookings/get_all_booking_detail_for_partner/`
  - admin complaints pagination/filtering is backed by a passing backend filter test for status/search on `/bookings/get_all_complaints_for_partner/`
  - admin receivable views are backed by passing backend pagination/scope tests for `/bookings/get_receivable_payment_statistics/`
  - settlement review now depends on `/management/fetch_all_paid_bookings/` as the payment-proof source, and the management paid-bookings queue remains covered by the passing pending-full-payment review-queue test
- Residual risk:
  - this phase still did not run an authenticated browser smoke for the partner settlement review page, so UI confidence comes from the successful admin build, unchanged detail-page composition, and backend contract tests rather than seeded manual interaction
  - the legacy MySQL `booking.tests --keepdb` path remains an environment problem, not a newly observed product regression

### Fix Backlog Phase 2 - Re-Verification (2026-03-11)
- Status: Re-run completed on the same bounded batch with unchanged results.
- Verification re-run:
  - `npm run build` in `Huz-Admin-Frontend`: passed again; warning output stayed limited to unrelated pre-existing lint/CSS-order issues outside the scoped booking-contract files.
  - `Huz-Backend/.venv/bin/python manage.py check`: passed again.
  - `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py test booking.tests.ManagePartnerBookingViewsTests.test_booking_list_filters_by_booking_number booking.tests.ManagePartnerBookingViewsTests.test_complaints_list_supports_status_and_search_filters booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_returns_paginated_empty_payload booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_are_scoped_to_partner booking.tests.ApproveBookingPaymentViewTests.test_admin_review_queue_includes_pending_full_payment_bookings --noinput`: passed (`5/5`) again.
- Outcome:
  - no new contract drift was observed in the scoped admin booking, complaints, receivable, or settlement-review surfaces
  - no atlas refresh was required in this rerun because routes, API ownership, and structure findings stayed unchanged from the earlier Phase 1 and Phase 2 sync

### Fix Backlog Phase 3 - Queue Next Batch (2026-03-11)
- Status: Completed for durable handoff only. No target-project code changed in this phase.
- Batch 01 closeout state:
  - the resolved items from this run remain `BOOKING-001`, `BOOKING-002`, `BOOKING-004`, and `BOOKING-007`
  - the verification baseline for these fixes remains the passing `Huz-Admin-Frontend` build, passing backend `manage.py check`, and passing targeted `huz.settings_test` booking/management tests (`5/5`)
- Exact next recommended batch:
  - Booking Contract Batch 02
  - source doc: `docs/project-bot/BOOKING_CONTRACT_BATCH_02_2026-03-11.md`
  - scope items: `BOOKING-005` admin pending-action gating and `BOOKING-006` admin route-owned booking identity
- Why this is the next bounded step:
  - the highest remaining risk is still concentrated in the admin booking-detail state layer, not in pagination or payment-proof visibility anymore
  - `BOOKING-005` leaves the admin UI weaker than the backend workflow contract by exposing actions when `operator_can_act` is false
  - `BOOKING-006` keeps fulfillment subflows coupled to global storage, which can misdirect edits and document actions across tabs or reloads
  - resolving both items first reduces the chance that later completed-state/reporting fixes are built on top of stale booking identity or invalid action affordances
- Future-run starting context:
  - reuse the current workspace atlas docs plus the Batch 02 scoped request doc; no fresh repo-wide booking scan is needed before starting the next implementation run
  - later sequence remains unchanged after Batch 02: Batch 03 for `BOOKING-008` and `BOOKING-009`, then Batch 04 for `BOOKING-003`, `BOOKING-010`, and `BOOKING-011`

### Fix Backlog Phase 0 - Batch 02 Target Selection (2026-03-11)
- Status: Completed for target selection only. No target-project code changed in this phase.
- Selected batch for run `20260311-180137-fix-backlog` remains Booking Contract Batch 02 with `BOOKING-005` and `BOOKING-006`; no reprioritization was needed after re-reading the current atlas, backlog, and booking audit docs.
- Concrete implementation scope confirmed in live source:
  - admin pending-action gating lives in `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Pending.js`
  - admin route/state ownership drift spans `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`, `Active.js`, the four admin `/package/*` subflow pages, `Huz-Admin-Frontend/src/App.js`, and `Huz-Admin-Frontend/src/context/BookingContext.js`
  - operator reference pattern for route-owned identity remains `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingRoutes.jsx`
  - backend readiness contract remains anchored in `Huz-Backend/booking/serializers.py` and `Huz-Backend/booking/workflow.py`
- Locked implementation direction for the next phase:
  - gate admin pending booking actions on backend `operator_can_act` before showing or enabling decision controls
  - carry booking identity through the admin detail/subflow route or parent-owned state instead of global `localStorage("bookingNumber")`
  - keep admin access-operator-profile and later booking batches excluded unless a directly adjacent blocker appears
- Verification plan for later phases:
  - `npm run build` in `Huz-Admin-Frontend`
  - `Huz-Backend/.venv/bin/python manage.py check`
  - targeted `DJANGO_SETTINGS_MODULE=huz.settings_test` booking tests for workflow readiness plus touched partner booking action/document endpoints
  - route smoke after implementation to confirm admin booking detail subflows still load booking, visa, airline, transport, and hotel sections for the selected booking
- No new booking drifts were discovered during this confirmation pass; the backlog order after Batch 02 remains Batch 03 (`BOOKING-008`, `BOOKING-009`) then Batch 04 (`BOOKING-003`, `BOOKING-010`, `BOOKING-011`).

### Fix Backlog Phase 1 - Batch 02 Implementation (2026-03-11)
- Status: Implemented, verification pending.
- Implemented changes:
  - admin partner booking detail and fulfillment subflows now own booking identity in the route under `/booking/:bookingNumber/...`, with legacy `/bookingdetails` and `/package/*` paths redirected into those canonical routes
  - admin booking detail loading now flows through `bookingRouteUtils.js` and `BookingDetailsPage/useAdminBookingLoader.js`, and the selected booking no longer persists through shared `localStorage`
  - admin `Pending.js` now checks backend `operator_can_act` before rendering decision controls, matching the existing backend workflow contract
- Phase boundary note:
  - no build/test/backend-check commands were run here because verification is reserved for Phase 2 in this run
- Remaining risk until Phase 2 completes:
  - this batch is not yet verified against the admin production build, backend `manage.py check`, targeted booking tests, or a route smoke covering booking detail plus the visa/airline/transport/hotel subflows

### Fix Backlog Phase 2 - Batch 02 Verification (2026-03-11)
- Status: Verified and backlog synced; `BOOKING-005` and `BOOKING-006` are now resolved for this bounded batch.
- Verification completed:
  - `npm run build` in `Huz-Admin-Frontend`: passed; warning output remained limited to unrelated pre-existing lint/CSS-order issues outside the scoped booking-contract files.
  - `Huz-Backend/.venv/bin/python manage.py check`: passed with no issues.
  - `Huz-Backend/.venv/bin/python manage.py test booking.tests.BookingWorkflowServiceValidationTests.test_v1_booking_detail_locks_actions_for_full_payment_under_review booking.tests.ManagePartnerBookingViewsTests.test_take_action_sends_email_only_for_objection --settings=huz.settings_test --noinput -v 2`: passed (`2/2`).
  - Route smoke was completed from source wiring: `BookingDetails.js`, `UploadEvisa.jsx`, `AirlineTickets.jsx`, `TransportArrangement.jsx`, and `HotelArrangement.jsx` all consume `useAdminBookingLoader()` so the selected booking is resolved from the route-owned path instead of `localStorage("bookingNumber")`.
- New verification-only finding:
  - `booking.tests.ApproveBookingPaymentViewTests.test_full_payment_approval_without_minimum_unlocks_the_correct_lifecycle_states` is currently broken test code under `huz.settings_test` because `ApproveBookingPaymentViewTests` lacks `_approve_full`; this is backend test debt that should be repaired separately, not a Batch 02 product regression.
- Remaining downstream booking order stays unchanged:
  - Batch 03: `BOOKING-008` and `BOOKING-009`
  - Batch 04: `BOOKING-003`, `BOOKING-010`, and `BOOKING-011`

### Fix Backlog Phase 3 - Batch 02 Handoff (2026-03-11)
- Status: Completed for summary and queueing only. No target-project code changed in this phase.
- Durable closeout for this run:
  - Batch 02 remains closed with `BOOKING-005` and `BOOKING-006` resolved on the verified route-owned admin booking-detail flow.
  - the existing verification signal for this batch remains the passing `Huz-Admin-Frontend` build, passing backend `manage.py check`, passing targeted `huz.settings_test` booking tests (`2/2`), and route/source smoke across `BookingDetails.js`, `UploadEvisa.jsx`, `AirlineTickets.jsx`, `TransportArrangement.jsx`, and `HotelArrangement.jsx`.
  - the broken `_approve_full` helper inside `ApproveBookingPaymentViewTests` stays logged as separate backend test debt, not as an unresolved Batch 02 product issue.
- Exact next recommended batch:
  - Booking Contract Batch 03
  - source doc: `docs/project-bot/BOOKING_CONTRACT_BATCH_03_2026-03-11.md`
  - scope items: `BOOKING-008` completed-state fulfillment action gating and `BOOKING-009` admin reported-traveler visibility for `issue_status=REPORTED`
- Why the next run should stay bounded to Batch 03:
  - `BOOKING-008` is the next adjacent booking-detail contract drift because completed-state edit/update entrypoints still route users toward backend-rejected mutations in both admin and operator panels.
  - `BOOKING-009` is the remaining admin booking-detail state hole in the same area because the operator panel and backend already understand `REPORTED`, but the admin panel still collapses that path.
  - Batch 03 continues the booking-detail/workflow cleanup unlocked by Batch 02 without expanding into later operator search truthfulness or web support-origin fixes.
- Future-run starting context:
  - reuse the current workspace atlas docs plus `docs/project-bot/BOOKING_CONTRACT_BATCH_03_2026-03-11.md`; no fresh full-project scan is required.
  - start from the verified Batch 02 route-owned admin booking flow, then inspect `Completed.jsx`, admin `Completed.js`, the operator shared arrangement detail card, admin `BookingDetails.js`, and `bookingWorkflowUtils.js`.
  - expected minimum verification for the next run is scoped builds in both `Huz-Admin-Frontend` and `Huz-Operator-Frontend`, plus backend guard verification for any touched fulfillment endpoints or workflow branches.

### Fix Backlog Phase 0 - Batch 03 Target Selection (2026-03-11)
- Status: Completed for target selection only. No target-project code changed in this phase.
- Selected batch for run `20260311-184716-fix-backlog` remains Booking Contract Batch 03 with `BOOKING-008` and `BOOKING-009`; no reprioritization was needed after re-reading the current atlas, backlog, batch request, and booking audit docs.
- Concrete implementation scope confirmed in live source:
  - completed-state admin booking detail uses `Completed.js` plus the admin visa/airline/transport/hotel detail cards, which still expose edit or delete affordances even when the backend fulfillment create/update contract no longer allows `COMPLETED`
  - completed-state operator booking detail uses `Completed.jsx`, `AirlineDetails.jsx`, `ArrangementDetailsCard.jsx`, and `useBookingDocumentActions.js`, which still keep edit or delete paths alive for the same legacy fulfillment surfaces
  - admin reported-traveler visibility needs to land in `BookingDetails.js` and stay aligned with the existing operator `ReportedTravelers.jsx` component plus `bookingWorkflowUtils.js`
  - backend contract anchors remain `manage_partner_booking.py` for fulfillment guards, delete/report endpoints, and `workflow.py` plus `statuses.py` for canonical status/issue mapping
- Locked implementation direction for the next phase:
  - keep the backend contract unchanged unless a directly adjacent blocker appears, and instead bring the admin/operator completed-booking UI into line with the existing fulfillment guard rules
  - remove or status-gate completed-state edit/update entrypoints and any delete/document bypass that still mutates fulfillment data after a booking reaches `COMPLETED`
  - surface `issue_status=REPORTED` in the admin booking detail using the traveler/report data the backend already serializes, matching the operator detail semantics
  - keep operator dashboard/search truthfulness, web support-origin fixes, and admin access-operator-profile out of scope in this run
- Verification plan for later phases:
  - `npm run build` in `Huz-Admin-Frontend`
  - `npm run build` in `Huz-Operator-Frontend`
  - `Huz-Backend/.venv/bin/python manage.py check`
  - targeted `DJANGO_SETTINGS_MODULE=huz.settings_test` booking tests for touched partner booking guard/report endpoints, with new assertions added if completed-state rejection or reported-traveler serialization is not already covered
  - source and route smoke after implementation to confirm completed booking routes no longer navigate into illegal fulfillment edits and the admin detail shows reported travelers for `issue_status=REPORTED`
- No new booking drifts were discovered during this confirmation pass; downstream order remains Batch 04 for `BOOKING-003`, `BOOKING-010`, and `BOOKING-011` after Batch 03.

### Fix Backlog Phase 1 - Batch 03 Implementation (2026-03-11)
- Status: Implemented, verification pending.
- Implemented changes:
  - admin and operator completed-booking detail cards now hide fulfillment edit/delete affordances when the booking reaches `COMPLETED`
  - routed fulfillment subflow pages in both partner panels now refuse entry unless `booking_status` is still `IN_FULFILLMENT` or `READY_FOR_TRAVEL`, so manual URL entry no longer leads into backend-rejected fulfillment mutations
  - backend `DeleteBookingDocumentsView` now uses `can_update_booking_documents()`, closing the completed-state delete bypass that remained after the UI affordance audit
  - admin booking detail now renders a reported-travelers surface using `issue_status=REPORTED` plus `traveller_detail[].report_rabbit`, matching the existing operator detail semantics
  - Phase 1 also added targeted backend tests for the completed-state delete rejection and the reported-traveler serializer branch
- Phase boundary note:
  - no build, check, or test commands were run in this phase because verification is reserved for Phase 2 in this run
- Remaining risk until Phase 2 completes:
  - the batch still needs the required `Huz-Admin-Frontend` and `Huz-Operator-Frontend` builds, backend `manage.py check`, targeted `huz.settings_test` booking tests, and route/source smoke before `BOOKING-008` and `BOOKING-009` can be closed

### Fix Backlog Phase 2 - Batch 03 Verification (2026-03-11)
- Status: Partially verified.
- Verification completed:
  - `npm run build` in `Huz-Admin-Frontend`: passed with compile success and pre-existing warnings outside the Batch 03 booking files.
  - `npm run build` in `Huz-Operator-Frontend`: passed.
  - `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py check`: passed.
  - `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py test booking.tests.ManagePartnerBookingViewsTests.test_delete_booking_documents_rejects_completed_booking`: passed.
  - `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py test booking.tests.ManagePartnerBookingViewsTests.test_delete_booking_documents_rejects_completed_booking booking.tests.ManagePartnerBookingViewsTests.test_report_booking_marks_issue_status_and_serializes_reported_traveler`: failed (`1/2`) because the reported-traveler serialization assertion did not find the expected `traveller_detail` entry.
  - Source smoke confirms the fulfilled `BOOKING-008` guard wiring: admin subflow wrappers (`UploadEvisa.jsx`, `AirlineTickets.jsx`, `TransportArrangement.jsx`, `HotelArrangement.jsx`) all render `FulfillmentEditUnavailable`, and operator detail still normalizes legacy traveler payloads in `src/api/apiUtils.js`.
- New verification finding:
  - `BOOKING-008` is now resolved.
  - `BOOKING-009` remains open because the admin reported-travelers UI expects `booking.traveller_detail`, while the legacy detail contract still serializes traveler rows under `passport_validity_detail`. The operator panel already aliases that payload in `src/api/apiUtils.js`; the admin `getBookingDetails()` path still returns the raw response unchanged.
- Updated downstream order after this phase:
  - finish `BOOKING-009`
  - then resume Batch 04 for `BOOKING-003`, `BOOKING-010`, and `BOOKING-011`

### Fix Backlog Phase 3 - Batch 03 Handoff (2026-03-11)
- Status: Completed for summary and queueing only. No additional source scan or target-project code changes were needed in this phase.
- Durable outcome:
  - `BOOKING-008` is closed with verified alignment between the admin/operator completed-booking UI and the backend fulfillment mutation guards.
  - `BOOKING-009` remains the sole unresolved Batch 03 contract drift because the admin booking-detail consumer still expects `traveller_detail`, while the legacy partner-detail response keeps traveler rows under `passport_validity_detail`.
- Exact next bounded target:
  - finish `BOOKING-009` only before moving to Batch 04
  - preferred implementation direction is admin-side normalization in `Huz-Admin-Frontend/src/utility/Api.js`; the lower-touch fallback is to make `ReportedTravelers.js` consume `passport_validity_detail` directly
- Future-run starting context:
  - no fresh full-project booking scan is required; the current atlas, backlog, and this report already capture the implementation state, verification baseline, and unresolved contract edge
  - likely next touchpoints are `Huz-Admin-Frontend/src/utility/Api.js`, `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/components/ReportedTravelers.js`, and `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`
  - minimum verification should include `npm run build` in `Huz-Admin-Frontend` and the targeted `ManagePartnerBookingViewsTests.test_report_booking_marks_issue_status_and_serializes_reported_traveler`; rerun the operator build as part of the full Batch 03 closure pass if desired
- Downstream order remains unchanged after the `BOOKING-009` follow-up:
  - Batch 04: `BOOKING-003`, `BOOKING-010`, and `BOOKING-011`

### Fix Backlog Run 20260311-192319 Phase 0 Target Selection (2026-03-11)
- Status: Completed for target selection only. No target-project code changed in this phase.
- Selected batch for run `20260311-192319-fix-backlog` is Booking Contract Batch 04 with `BOOKING-003`, `BOOKING-010`, and `BOOKING-011`; this is an explicit scoped-request override, not a silent backlog reprioritization. `BOOKING-009` remains open but is isolated to the admin booking-detail consumer and is not a direct blocker for the requested operator/web batch.
- Concrete implementation scope confirmed in live source:
  - operator dashboard truthfulness work is centered in `Huz-Operator-Frontend/src/api/DashboardApi.js`, `Huz-Operator-Frontend/src/pages/Dashboard/components/overview/RecentBookingsMiniList.jsx`, and the checked-in `Huz-Operator-Frontend/.env` configuration that currently lacks `VITE_DASHBOARD_SUMMARY_ENDPOINT`
  - operator search-contract work is centered in `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/components/Tabs.jsx`, `Huz-Operator-Frontend/src/api/BookingApi.js`, and `Huz-Backend/booking/manage_partner_booking.py`, where the active partner booking list still filters only `booking_number__icontains`
  - web support media-origin work is centered in `Huz-Web-Frontend/src/pages/UserSetting/Support/supportUtils.js` and `help.jsx`; no other current support-history consumer in the audited scope resolves those media links
  - the existing `Huz-Web-Frontend/src/services/api/httpClient.js` API-base helper is the cleanest reuse path for split-origin media resolution
- Locked implementation direction for the next phase:
  - prefer truthful frontend/UI fixes first, consistent with the run request, unless extending the backend contract for traveler-name search is clearly safer and can be verified end to end
  - keep the operator dashboard change bounded to the recent-bookings widget and its fallback fetch path rather than reopening unrelated summary cards or admin/dashboard modules
  - keep the web fix bounded to complaint/request attachment and complaint-audio URL resolution in the help/support history surface, while correcting nearby helper usage only if it shares the same API-origin bug
  - keep Batch 03 follow-up work, earlier admin contract batches, and the excluded access-operator-profile module out of scope
- Verification plan for later phases:
  - `npm run build` in `Huz-Operator-Frontend`
  - `npm run build` in `Huz-Web-Frontend`
  - backend verification only if the operator search contract or support-media serialization changes
  - source or UI smoke after implementation to confirm the dashboard card no longer implies global recency when the fallback is bucketed, the operator search UI aligns with the real backend filter contract, and support-history media links resolve against the API origin
- No new booking drifts were discovered during this confirmation pass; this phase only records the bounded Batch 04 execution target and its implementation constraints.

### Fix Backlog Run 20260311-192319 Phase 1 Implementation (2026-03-11)
- Status: Implemented, verification pending.
- Implemented bounded frontend-side Batch 04 changes only; no backend routes or serializers changed in this phase.
- Operator dashboard recent-bookings fallback now keeps the READY-bucket request but publishes `recentBookingsScope=READY` through the dashboard summary/view-model so the widget title, description, totals, and dashboard source chip all acknowledge the ready-queue fallback when no unified summary endpoint exists.
- Operator booking list search now uses explicit `bookingNumber` consumer semantics and all user-facing copy states that the backend search filters booking numbers only.
- Web help/support history now resolves relative complaint/request attachment and complaint-audio URLs against `REACT_APP_API_BASE_URL` via the shared HTTP client helper already used elsewhere in the web panel.
- Phase boundary note:
  - no build, test, or backend check commands were run because verification remains in Phase 2 for this run.
- Remaining Phase 2 checks stay unchanged:
  - `npm run build` in `Huz-Operator-Frontend`
  - `npm run build` in `Huz-Web-Frontend`
  - source/UI smoke confirming ready-queue labeling, booking-number-only search copy, and API-origin support media links

### Fix Backlog Run 20260311-192319 Phase 2 Verification (2026-03-11)
- Status: Completed for verification and backlog sync. No new target-project source files changed in this phase.
- Verification completed:
  - `npm run build` in `Huz-Operator-Frontend`: passed.
  - `npm run build` in `Huz-Web-Frontend`: passed with pre-existing warnings outside Batch 04 (`WEB-001` unused imports in `src/pages/PackageDetailPage/components/LeftColumn/Itinerary.js` and the existing bundle-size advisory).
  - Source smoke confirmed the checked-in operator `.env` still lacks `VITE_DASHBOARD_SUMMARY_ENDPOINT`, the recent-bookings widget now labels the fallback as a ready queue, operator search copy and request parameters remain booking-number-only, and web support history media links resolve through `API_BASE_URL`.
- Backlog state updated in this phase:
  - `BOOKING-003`: `Resolved`
  - `BOOKING-010`: `Resolved`
  - `BOOKING-011`: `Resolved`
- No backend verification was required because this batch did not change backend search filters or support-media serialization.
- No new booking drifts were discovered during this verification pass; `BOOKING-009` remains open separately and unchanged by Batch 04.

### Fix Backlog Run 20260311-192319 Phase 3 Queue Next Batch (2026-03-11)
- Status: Completed for summary and queueing only. No new source scan or target-project code changes were needed in this phase.
- Durable outcome:
  - Batch 04 is closed with verified frontend-only fixes for operator dashboard truthfulness, operator booking-number-only search honesty, and web support media API-origin resolution.
  - `BOOKING-009` remains the only unresolved booking-contract drift in the current campaign; it is isolated to the admin booking-detail consumer path and unchanged by this run.
- Exact next bounded target:
  - finish `BOOKING-009` only before starting unrelated backlog work
  - preferred implementation direction is admin-side normalization in `Huz-Admin-Frontend/src/utility/Api.js`; the lower-touch fallback is to make the admin reported-travelers UI read `passport_validity_detail` directly
- Future-run starting context:
  - no fresh full-project booking scan is required; the current atlas docs, backlog notes, and prior Batch 03 verification already capture the unresolved contract edge and expected fix surface
  - likely next touchpoints are `Huz-Admin-Frontend/src/utility/Api.js`, `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/components/ReportedTravelers.js`, and `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`
  - minimum verification should include `npm run build` in `Huz-Admin-Frontend` and the targeted `ManagePartnerBookingViewsTests.test_report_booking_marks_issue_status_and_serializes_reported_traveler`; rerun the operator build only if the follow-up is used to formally close the earlier Batch 03 verification envelope
- Separate web cleanup/performance backlog items (`WEB-001`, `WEB-002`) remain open but unchanged by this booking-contract run.
