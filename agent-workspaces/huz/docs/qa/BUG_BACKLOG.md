# Bug and Improvement Backlog

Use this backlog for prioritized follow-up work discovered during scans or implementation.

| ID | Priority | Module | Summary | Status | Verification |
| --- | --- | --- | --- | --- | --- |
| WEB-001 | Medium | `src/pages/PackageDetailPage/components/LeftColumn/Itinerary.js` | Remove the unused `Bed` and `Building2` imports so the production build returns cleanly without warnings. | Open | `npm run build` on 2026-03-09 completed with warnings for these unused imports. |
| WEB-002 | Medium | Frontend bundling | Investigate the current production bundle-size warning and identify the next route/module split opportunities after the account-route cleanup. | Open | `npm run build` on 2026-03-09 completed successfully but still reported the existing bundle-size advisory. |
| WEB-003 | High | `src/pages/UserSetting/*` | Replace the route-by-route account page wrappers with one shared module shell and shared hero/section primitives so sidebar-backed pages stop drifting. | Resolved | Completed in project-bot run `20260309-230923-migration-batch` via `src/features/accountModule/*` and route migration without URL or API changes. |
| BOOKING-001 | High | `Huz-Admin-Frontend/src/pages/Admin-Panel/Wallet/components/ReceivablePayments/*` | Normalize `/bookings/get_receivable_payment_statistics/` before admin wallet pages use array helpers; the backend returns a paginated object, not a raw list. | Resolved | Fixed on 2026-03-11 via `Huz-Admin-Frontend/src/utility/Api.js:21-49,1220-1240`, `Huz-Admin-Frontend/src/pages/Admin-Panel/Wallet/components/ReceivablePayments/CardList.jsx:77-90`, and `Huz-Admin-Frontend/src/pages/Admin-Panel/Wallet/components/ReceivablePayments/AllPayments.jsx:23-145`. Verified with `npm run build` (passed) and backend `manage.py check` (passed). |
| BOOKING-002 | High | `Huz-Admin-Frontend/src/pages/dashboard/dashboard-pages/ApproveAmountsPartners/*` | Stop using legacy `/bookings/get_booking_detail_by_booking_number/` for partner settlement review; that response hides `payment_detail` and blanks the transaction-proof panel. | Resolved | Fixed on 2026-03-11 via `Huz-Admin-Frontend/src/utility/Super-Admin-Api.js:79-107,356-397` and `Huz-Admin-Frontend/src/pages/dashboard/dashboard-pages/ApproveAmountsPartners/BookingDetailsPage/BookingDetailsComponent.js:19-44`. The shared approval package card also now falls back to `package_cost` in `Huz-Admin-Frontend/src/pages/dashboard/dashboard-pages/ApproveAmountsPages/BookingDetailsPage/PackageDetails.js:21-27`. Verified with `npm run build` (passed) and backend `manage.py check` (passed). |
| BOOKING-003 | Medium | `Huz-Operator-Frontend/src/pages/Dashboard/*` | Remove the hardcoded `workflow_bucket=READY` fallback from the dashboard recent-bookings feed or relabel the card so it no longer implies full recent booking activity. | Resolved | Closed in run `20260311-192319-fix-backlog`. Phase 2 on 2026-03-11 passed `npm run build` in `Huz-Operator-Frontend` and source smoke confirmed the checked-in no-summary-endpoint path now renders a truthful ready-queue fallback in `DashboardApi.js`, `dashboardViewModel.js`, `RecentBookingsMiniList.jsx`, and `Dashboard.jsx`. |
| BOOKING-004 | High | `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/*` | Replace the current one-page admin booking list flow with page-aware backend consumption; the screen currently searches and paginates only inside the first `results` page from `/bookings/get_all_booking_detail_for_partner/`. | Resolved | Fixed on 2026-03-11 via `Huz-Admin-Frontend/src/utility/Api.js:703-737` and `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/components/Tabs.jsx:31-178`. The screen now sends `workflow_bucket`, `booking_number`, `page`, and `page_size` to the backend and renders server-driven pagination metadata. Verified with `npm run build` (passed). |
| BOOKING-005 | High | `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Pending.js` | Gate admin booking decisions on backend `operator_can_act` before rendering the action form; the operator panel already does this but admin still offers forbidden transitions. | Resolved | Implemented on 2026-03-11 in Phase 1 via `Pending.js` and verified in Phase 2 with `npm run build`, `Huz-Backend/.venv/bin/python manage.py check`, and targeted `huz.settings_test` backend tests covering booking-detail action locking plus partner booking action flow (`BookingWorkflowServiceValidationTests.test_v1_booking_detail_locks_actions_for_full_payment_under_review`, `ManagePartnerBookingViewsTests.test_take_action_sends_email_only_for_objection`). |
| BOOKING-006 | High | `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/*` | Remove the global `localStorage("bookingNumber")` handoff from admin booking subflows and move booking identity into the route; current subflows can edit the wrong booking across tabs. | Resolved | Implemented on 2026-03-11 in Phase 1 via `src/App.js`, `bookingRouteUtils.js`, `BookingDetailsPage/useAdminBookingLoader.js`, `BookingDetails.js`, `Active.js`, the four subflow wrappers, and `src/context/BookingContext.js`. Phase 2 verified the route-owned flow with a passing admin build, passing backend `manage.py check`, and source smoke confirming `BookingDetails.js`, `UploadEvisa.jsx`, `AirlineTickets.jsx`, `TransportArrangement.jsx`, and `HotelArrangement.jsx` all load booking data through `useAdminBookingLoader()` instead of shared `localStorage`. |
| BOOKING-007 | High | `Huz-Admin-Frontend/src/pages/Admin-Panel/Complaints/*` | Make admin complaints consumption page-aware and expose the backend complaint-id/search/date filters; the current screen only fetches one status page and renders `results`. | Resolved | Fixed on 2026-03-11 via `Huz-Admin-Frontend/src/utility/Api.js:999-1040` and `Huz-Admin-Frontend/src/pages/Admin-Panel/Complaints/Complaints.js:21-320`. The admin complaints screen now consumes paginated payload metadata and forwards backend search/date filters instead of rendering only one page of `results`. Verified with `npm run build` (passed). |
| BOOKING-008 | Medium | `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/*`, `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/*` | Hide completed-state edit/update entrypoints or change the backend contract; create/update fulfillment endpoints still reject `COMPLETED` even though both panels keep routing users into edit forms. | Resolved | Fixed on 2026-03-11 in run `20260311-184716-fix-backlog`. Phase 2 verification passed with `npm run build` in `Huz-Admin-Frontend` (compile success, pre-existing warnings outside this batch), `npm run build` in `Huz-Operator-Frontend`, `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py check`, `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py test booking.tests.ManagePartnerBookingViewsTests.test_delete_booking_documents_rejects_completed_booking`, and source smoke across the admin/operator fulfillment subflow guards. |
| BOOKING-009 | Medium | `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/*` | Surface reported-traveler detail when `issue_status=REPORTED`; backend and operator detail support the state, but admin currently treats only `OPERATOR_OBJECTION` as a distinct issue flow. | Resolved | Closed in release-gate run `20260311-195057-release-gate` Phase 1. `Huz-Backend/booking/serializers.py` now exposes additive `traveller_detail` on the legacy detail payload, `Huz-Backend/booking/manage_partner_booking.py` reloads the booking before the `REPORTED` response is serialized, and `Huz-Backend/booking/tests.py` now covers the corrected release-gate approval/report fixtures. Verified with passing admin/operator/web builds, passing operator lint/check scripts and Playwright smoke, passing `manage.py check --settings=huz.settings_test`, and a passing targeted backend 13-test gate suite including `test_report_booking_marks_issue_status_and_serializes_reported_traveler`. |
| BOOKING-010 | Medium | `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/*` | Either add traveler-name search support or correct the operator booking search copy; the current API/backend path only filters by booking number. | Resolved | Closed in run `20260311-192319-fix-backlog`. Phase 2 on 2026-03-11 passed `npm run build` in `Huz-Operator-Frontend` and source smoke confirmed operator search now sends `booking_number` only while all user-facing copy in `BookingApi.js` and `Tabs.jsx` matches the live backend filter contract. |
| BOOKING-011 | Low | `Huz-Web-Frontend/src/pages/UserSetting/Support/*` | Resolve complaint/request attachment and audio links against `REACT_APP_API_BASE_URL` when the backend returns relative media paths; current help-history links assume same-origin hosting. | Resolved | Closed in run `20260311-192319-fix-backlog`. Phase 2 on 2026-03-11 passed `npm run build` in `Huz-Web-Frontend` with pre-existing warnings outside this batch, and source smoke confirmed `help.jsx` now resolves complaint/request attachments plus complaint audio links through `supportUtils.js` and the shared `API_BASE_URL` helper. |

## Release Gate Notes (2026-03-11)

- Run `20260311-195057-release-gate` Phase 0 assembled the final cross-surface checklist in `docs/project-bot/runs/20260311-195057-release-gate/RELEASE_CHECKLIST.md`.
- Phase 1 closed `BOOKING-009`, so `BOOKING-001` through `BOOKING-011` are now resolved in the scoped March 11 booking campaign.
- Phase 2 recorded a `GO` verdict for the scoped March 11 booking-contract release gate in `docs/project-bot/runs/20260311-195057-release-gate/RELEASE_VERDICT.md`.
- `/Users/macbook/Desktop/Huz/scripts/release-gate.sh` is not a safe source of truth for this run because its web checks are stale relative to the current `Huz-Web-Frontend/package.json`; the release verdict is based on the scoped checklist commands run in Phase 1 instead.
- Remaining non-blocking watch items after the `GO` verdict: the stale repo-local `scripts/release-gate.sh` automation plus the pre-existing `WEB-001` unused-import warning and `WEB-002` bundle-size advisory reported by the web build.
- Project-local March 11 booking docs had drifted behind this workspace memory before Phase 0; Phase 2 resynced the final verdict across both locations.

## Booking Contract Audit Notes (Phase 2)

### BOOKING-001
- Owner: Frontend consumption in `Huz-Admin-Frontend`.
- Recommended change:
  - Normalize `fetchReceivablePayments` so consumers receive a stable shape such as `{ items, count, next, previous, message }`.
  - Update `AllPayments.jsx` to render `items.length` and `items.map(...)` rather than treating the raw payload as an array.
  - Update `CardList.jsx` to slice `items` instead of `result`, while preserving the existing no-data message path.
- Verification steps:
  - Trigger `/bookings/get_receivable_payment_statistics/` with at least one real or mocked receivable entry and confirm the returned paginated object renders in `/all-payments` without `data.map` failures.
  - Confirm the receivable dashboard card renders the first five rows without `result.slice is not a function`.
  - Confirm the empty state still renders correctly when the backend returns the current 404/message branch.

### BOOKING-002
- Owner: Both frontend and backend contract selection, with the immediate fix starting in `Huz-Admin-Frontend`.
- Recommended change:
  - Stop replacing the route-state booking with `/bookings/get_booking_detail_by_booking_number/` when the page needs payment proof review.
  - Prefer an existing management review payload that already exposes `payment_detail`, or add a management-scoped detail endpoint/serializer that does not set `hide_payment_detail`.
  - Keep the page copy aligned with the actual contract so settlement reviewers are not shown a false "No transaction records" state.
- Verification steps:
  - Open the partner settlement review page with a booking that has uploaded transaction evidence and confirm `TransactionDetails` renders at least one payment row.
  - Verify the same booking still loads package, visa, airline, transport, and hotel sections after the contract swap.
  - Confirm the review action flow still succeeds for approve/reject operations after the detail source changes.

### BOOKING-003
- Owner: Frontend dashboard consumption unless the team decides to formalize a backend summary endpoint for recent activity.
- Recommended change:
  - Decide whether the card should show true recent activity across workflow buckets or a `READY` queue snapshot.
  - If the intent is true recent activity, stop defaulting `getRecentBookings` to `workflow_bucket=READY` for the summary fallback path and use a summary endpoint or a backend route that supports unbucketed recency.
  - If the intent is a queue snapshot, rename the card title/description so it does not claim to represent "Recent Bookings".
- Verification steps:
  - Compare the dashboard card output against bookings in `READY`, `IN_FULFILLMENT`, `READY_FOR_TRAVEL`, and `ISSUES` states for the same operator account.
  - Confirm the card either surfaces mixed-status recent activity or clearly labels itself as a ready-queue view.
  - Recheck the dashboard with and without `VITE_DASHBOARD_SUMMARY_ENDPOINT` configured so both summary code paths stay honest.

## Booking Contract Audit Verification (Phase 3)

- Rechecked `BOOKING-001`, `BOOKING-002`, and `BOOKING-003` directly in source; all three remain open and their priorities stay unchanged.
- No new booking mismatch backlog items were added in this phase.
- Refreshed the atlas docs so the backlog now aligns with the current project memory for receivable-payment pagination, settlement proof-review contract selection, and the operator dashboard recent-bookings fallback behavior.

## Booking Contract Batch 01 Implementation (2026-03-11)

- Resolved `BOOKING-004`, `BOOKING-007`, `BOOKING-001`, and `BOOKING-002` in the scoped admin booking-contract batch.
- Kept backend contracts stable; the settlement proof fix stayed frontend-side by merging management review payment data into the partner settlement detail flow.
- Verification outcomes:
  - `npm run build` in `Huz-Admin-Frontend`: passed with pre-existing warnings outside the scoped batch.
  - `Huz-Backend/.venv/bin/python manage.py check`: passed.
  - `Huz-Backend/.venv/bin/python manage.py test booking.tests --keepdb --noinput`: environment issue, not a code regression signal. The suite reused a stale MySQL test DB and then hit `Lost connection to MySQL server during query`.

## Booking Contract Batch 01 Phase 2 Verification (2026-03-11)

- Confirmed `BOOKING-001`, `BOOKING-002`, `BOOKING-004`, and `BOOKING-007` remain `Resolved` after scoped Phase 2 verification; no backlog status changes were needed beyond preserving those resolutions.
- Additional verification completed for this batch:
  - `npm run build` in `Huz-Admin-Frontend`: passed again with compile success and only pre-existing warnings outside the scoped booking-contract files.
  - `Huz-Backend/.venv/bin/python manage.py check`: passed again.
  - `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py test booking.tests.ManagePartnerBookingViewsTests.test_booking_list_filters_by_booking_number booking.tests.ManagePartnerBookingViewsTests.test_complaints_list_supports_status_and_search_filters booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_returns_paginated_empty_payload booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_are_scoped_to_partner booking.tests.ApproveBookingPaymentViewTests.test_admin_review_queue_includes_pending_full_payment_bookings --noinput`: passed (`5/5`) against the repo's SQLite test settings.
- Residual risk:
  - settlement-review verification is still code-level rather than browser-session smoke because this phase did not use seeded UI data or authenticated manual flows
  - the legacy MySQL-backed `booking.tests --keepdb` path remains environment-sensitive, so Phase 2 uses the repository's local SQLite test settings as the durable backend verification signal for the touched booking/management endpoints

## Frontend/Backend Audit Extension (2026-03-11)

- New remediation order after the expanded audit:
  - fix `BOOKING-004`, `BOOKING-001`, `BOOKING-002`, and `BOOKING-005` first because they can hide work or surface invalid actions in money-sensitive and operational booking flows
  - then fix `BOOKING-006` and `BOOKING-007` because they are structural state-ownership problems in the admin panel
  - then fix `BOOKING-008`, `BOOKING-009`, and `BOOKING-010` to align late-stage partner UX with the actual backend workflow contract
  - finish with `BOOKING-011`, which is lower-severity and deployment-dependent but still a real contract/hosting assumption mismatch
- Full audit report:
  - `docs/codex_reports/BOOKING_FRONTEND_BACKEND_AUDIT_2026-03-11.md`

## Booking Contract Batch 01 Phase 2 Re-Verification (2026-03-11)

- Re-ran the scoped Phase 2 verification for `BOOKING-001`, `BOOKING-002`, `BOOKING-004`, and `BOOKING-007` against the current target project state; all four items remain `Resolved`.
- Commands re-run in this pass:
  - `npm run build` in `Huz-Admin-Frontend`: passed again with the same pre-existing lint/CSS-order warnings outside the scoped booking-contract files.
  - `Huz-Backend/.venv/bin/python manage.py check`: passed again.
  - `DJANGO_SETTINGS_MODULE=huz.settings_test Huz-Backend/.venv/bin/python manage.py test booking.tests.ManagePartnerBookingViewsTests.test_booking_list_filters_by_booking_number booking.tests.ManagePartnerBookingViewsTests.test_complaints_list_supports_status_and_search_filters booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_returns_paginated_empty_payload booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_are_scoped_to_partner booking.tests.ApproveBookingPaymentViewTests.test_admin_review_queue_includes_pending_full_payment_bookings --noinput`: passed (`5/5`) again using the repository SQLite test settings.
- No backlog priority or status changes were required in this rerun.
- Residual risk remains unchanged:
  - settlement-review confidence is still based on build plus targeted contract tests rather than an authenticated browser-session smoke
  - the older MySQL-backed `booking.tests --keepdb` path remains environment-sensitive and is not used as the durable signal for this batch

## Booking Contract Batch 01 Phase 3 Handoff (2026-03-11)

- Batch 01 is closed for this campaign: `BOOKING-001`, `BOOKING-002`, `BOOKING-004`, and `BOOKING-007` remain `Resolved` after implementation plus repeated scoped verification.
- Exact next recommended backlog target:
  - Booking Contract Batch 02
  - Source doc: `docs/project-bot/BOOKING_CONTRACT_BATCH_02_2026-03-11.md`
  - Items: `BOOKING-005` and `BOOKING-006`
- Why Batch 02 is next:
  - `BOOKING-005` is still a high-severity admin workflow guard drift because the admin pending-action UI can expose actions the backend contract will reject when `operator_can_act` is false.
  - `BOOKING-006` is still a high-severity state-ownership drift because admin booking fulfillment subflows rely on global `localStorage("bookingNumber")`, which can target the wrong booking across tabs and reloads.
  - Fixing these two items next preserves the campaign dependency order already captured in the audit and clears the admin booking-detail state layer before the later completed-state and reported-traveler batches.
- Starting point for the next run:
  - use the current workspace atlas docs plus `docs/project-bot/BOOKING_CONTRACT_BATCH_02_2026-03-11.md`
  - reuse the Batch 01 verification baseline (`Huz-Admin-Frontend` build, backend `manage.py check`, and targeted `huz.settings_test` booking/management tests) and extend it only for the route/state wiring touched by Batch 02
- Remaining downstream booking batches stay unchanged after this handoff:
  - Batch 03: `BOOKING-008` and `BOOKING-009`
  - Batch 04: `BOOKING-003`, `BOOKING-010`, and `BOOKING-011`

## Fix Backlog Run 20260311-180137 Phase 0 Target Selection (2026-03-11)

- Selected execution target for run `20260311-180137-fix-backlog`: Booking Contract Batch 02 only (`BOOKING-005` and `BOOKING-006`).
- Selection stayed unchanged after re-reading the run request, workspace atlas/backlog docs, the Batch 02 scoped request doc, and the current admin/operator/backend source.
- Confirmed in-scope admin booking files for the next implementation phase:
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Pending.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Active.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/UploadVisa/UploadEvisa.jsx`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/AirlineTickets/AirlineTickets.jsx`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/TransportArrangement/TransportArrangement.jsx`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/HotelArrangement/HotelArrangement.jsx`
  - `Huz-Admin-Frontend/src/App.js`
  - `Huz-Admin-Frontend/src/context/BookingContext.js`
- Confirmed backend contract anchors for the batch:
  - `Huz-Backend/booking/serializers.py` is the active source of `operator_can_act`.
  - `Huz-Backend/booking/workflow.py` still defines operator action readiness through `READY_FOR_OPERATOR`.
- Locked implementation direction for Phase 1:
  - mirror the healthier operator route ownership by carrying booking identity through the admin detail/subflow route or parent-owned navigation state instead of global `localStorage("bookingNumber")`
  - keep the admin access-operator-profile module and later completed-state/reported-traveler/operator-dashboard/web-support batches out of scope
- Phase 2 verification plan for this batch:
  - `npm run build` in `Huz-Admin-Frontend`
  - `Huz-Backend/.venv/bin/python manage.py check`
  - targeted `DJANGO_SETTINGS_MODULE=huz.settings_test` booking tests covering workflow readiness and touched partner booking endpoints, starting from `booking.tests.ApproveBookingPaymentViewTests.test_full_payment_approval_without_minimum_unlocks_the_correct_lifecycle_states`, `booking.tests.ManagePartnerBookingViewsTests.test_take_action_sends_email_only_for_objection`, `booking.tests.ManagePartnerBookingViewsTests.test_manage_booking_documents_rejects_invalid_document_type`, `booking.tests.ManagePartnerBookingViewsTests.test_hotel_transport_post_requires_booking_number`, and `booking.tests.ManagePartnerBookingViewsTests.test_airline_put_is_scoped_to_booking_airline_id`
- Status note:
  - `BOOKING-005` and `BOOKING-006` remain `Open` until implementation and verification complete; this phase only locks the batch and execution boundary.

## Fix Backlog Run 20260311-180137 Phase 1 Implementation (2026-03-11)

- Implemented the bounded Batch 02 admin-booking changes for `BOOKING-005` and `BOOKING-006`.
- Admin booking detail/subflow identity now comes from route params under `/booking/:bookingNumber/...`, with legacy `/bookingdetails` and `/package/*` entrypoints redirected into the canonical paths.
- Admin pending booking decisions now gate on backend `operator_can_act` before rendering or submitting the action form.
- No verification commands were run in this phase because the run boundary explicitly defers build/backend/test/smoke work to Phase 2.

## Fix Backlog Run 20260311-180137 Phase 2 Verification (2026-03-11)

- Closed `BOOKING-005` and `BOOKING-006` as `Resolved` after scoped Batch 02 verification.
- Verification completed in this phase:
  - `npm run build` in `Huz-Admin-Frontend`: passed; warning output stayed limited to pre-existing unrelated lint/CSS-order issues outside the Batch 02 booking files.
  - `Huz-Backend/.venv/bin/python manage.py check`: passed with no issues.
  - `Huz-Backend/.venv/bin/python manage.py test booking.tests.BookingWorkflowServiceValidationTests.test_v1_booking_detail_locks_actions_for_full_payment_under_review booking.tests.ManagePartnerBookingViewsTests.test_take_action_sends_email_only_for_objection --settings=huz.settings_test --noinput -v 2`: passed (`2/2`) against the repo's SQLite-backed test settings.
  - Route/state smoke was completed at source level by confirming `BookingDetails.js` plus the visa, airline, transport, and hotel admin subflow wrappers all resolve booking identity through `useAdminBookingLoader()` and no longer read `localStorage("bookingNumber")`.
- Verification-only finding captured for later cleanup:
  - `booking.tests.ApproveBookingPaymentViewTests.test_full_payment_approval_without_minimum_unlocks_the_correct_lifecycle_states` currently errors under `huz.settings_test` because the class is missing `_approve_full`; this is test debt in the backend suite, not evidence that Batch 02 regressed the live booking contract.
- Residual risk:
  - this phase did not run an authenticated browser session, so UI confidence comes from the successful production build plus route-loader/source smoke and the targeted backend contract tests rather than seeded manual interaction.

## Fix Backlog Run 20260311-180137 Phase 3 Handoff (2026-03-11)

- Status: Completed for durable handoff only. No target-project code changed in this phase.
- Batch 02 closeout state:
  - `BOOKING-005` and `BOOKING-006` remain `Resolved` with the existing verification baseline: passing `Huz-Admin-Frontend` production build, passing backend `manage.py check`, passing targeted `huz.settings_test` booking tests (`2/2`), and route/source smoke confirming the admin booking detail plus visa/airline/transport/hotel subflows now resolve booking identity through `useAdminBookingLoader()`.
  - `booking.tests.ApproveBookingPaymentViewTests.test_full_payment_approval_without_minimum_unlocks_the_correct_lifecycle_states` remains separate backend test debt because `ApproveBookingPaymentViewTests` still lacks `_approve_full`; do not treat this as a reason to reopen Batch 02 unless a live workflow regression appears.
- Exact next recommended batch:
  - Booking Contract Batch 03
  - source doc: `docs/project-bot/BOOKING_CONTRACT_BATCH_03_2026-03-11.md`
  - scope items: `BOOKING-008` completed-state edit/update guard alignment and `BOOKING-009` admin reported-traveler detail
- Why Batch 03 is next:
  - `BOOKING-008` is the next workflow-contract gap on the same booking-detail surface because both admin and operator completed-state screens still advertise create/update fulfillment actions that the backend rejects for `COMPLETED`.
  - `BOOKING-009` is the adjacent admin detail-state gap because the backend and operator panel already support `issue_status=REPORTED`, but the admin detail flow still does not surface the reported-traveler branch.
  - Keeping the next run on Batch 03 continues the booking-detail contract cleanup while staying inside the campaign boundaries and avoiding unrelated operator dashboard/search or web support-origin work.
- Future-run starting context:
  - reuse the current workspace atlas docs, this backlog entry, the latest deep-scan notes, and `docs/project-bot/BOOKING_CONTRACT_BATCH_03_2026-03-11.md`; no fresh repo-wide booking scan is needed before starting the next implementation run.
  - likely primary touchpoints are `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/Completed.jsx`, `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/ActiveSatusComponents/shared/ArrangementDetailsCard.jsx`, `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Completed.js`, `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`, and `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/bookingWorkflowUtils.js`.
  - minimum verification for the next run should include scoped `npm run build` in both `Huz-Admin-Frontend` and `Huz-Operator-Frontend`, plus backend verification for any touched booking workflow guards or fulfillment endpoints.

## Fix Backlog Run 20260311-184716 Phase 0 Target Selection (2026-03-11)

- Selected execution target for run `20260311-184716-fix-backlog`: Booking Contract Batch 03 only (`BOOKING-008` and `BOOKING-009`).
- Selection stayed unchanged after re-reading the run request, workspace atlas/backlog docs, the Batch 03 scoped request doc, the booking audit reports, and the current admin/operator/backend source.
- Confirmed in-scope frontend touchpoints for the next implementation phase:
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Completed.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/bookingWorkflowUtils.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/UploadVisa/VisaDetails.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/AirlineTickets/AirlineDetails.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/TransportArrangement/TransportDetails.js`
  - `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/HotelArrangement/HotelDetails.js`
  - `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/Completed.jsx`
  - `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/BookingDetails.jsx`
  - `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/components/ReportedTravelers.jsx`
  - `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/ActiveSatusComponents/AirlineTickets/AirlineDetails.jsx`
  - `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/ActiveSatusComponents/shared/ArrangementDetailsCard.jsx`
  - `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/BookingDetailsPage/useBookingDocumentActions.js`
- Confirmed backend contract anchors for the batch:
  - `Huz-Backend/booking/manage_partner_booking.py` defines fulfillment mutation eligibility through `can_update_booking_documents()` and only allows create/update document-style mutations in `IN_FULFILLMENT` and `READY_FOR_TRAVEL`.
  - `DeleteBookingDocumentsView` currently deletes by booking/document identity without a matching completed-state status gate, so completed-state delete bypasses must be checked and closed in this batch.
  - `ReportBookingView` already permits `READY_FOR_TRAVEL` and `COMPLETED`, so `BOOKING-009` should surface existing backend behavior rather than invent a new contract.
  - `Huz-Backend/booking/workflow.py` and `Huz-Backend/booking/statuses.py` remain the canonical booking-status, issue-status, and workflow-bucket definitions.
- Locked implementation direction for Phase 1:
  - remove, disable, or status-gate completed-state edit/update entrypoints and delete affordances in both panels unless the underlying backend mutation is still allowed for that status
  - close any completed-state bypass through document deletion or subflow routing in the same batch while keeping existing route paths stable
  - add an admin reported-traveler surface aligned to the operator panel's `ReportedTravelers` presentation and the backend's `issue_status=REPORTED` plus traveler `report_rabbit` data
  - keep operator dashboard/search truthfulness, web support-origin fixes, and admin access-operator-profile out of scope unless a directly adjacent blocker appears
- Phase 2 verification plan for this batch:
  - `npm run build` in `Huz-Admin-Frontend`
  - `npm run build` in `Huz-Operator-Frontend`
  - `Huz-Backend/.venv/bin/python manage.py check`
  - targeted `DJANGO_SETTINGS_MODULE=huz.settings_test` booking tests covering touched partner booking guard/report endpoints, extending `ManagePartnerBookingViewsTests` if completed-state rejection or reported-traveler detail assertions are not already covered
  - source and route smoke after implementation to confirm completed booking screens no longer route into fulfillment edit forms and the admin detail renders reported travelers when `issue_status=REPORTED`
- Status note:
  - `BOOKING-008` and `BOOKING-009` remain `Open` until implementation and verification complete; this phase only locks the batch and execution boundary.

## Fix Backlog Run 20260311-184716 Phase 1 Implementation (2026-03-11)

- Implemented the bounded Batch 03 code changes for `BOOKING-008` and `BOOKING-009`.
- Admin and operator completed-booking detail screens now render fulfillment documents and arrangements as read-only when `booking_status=COMPLETED`; the direct fulfillment subflow pages also block entry unless the booking is in `IN_FULFILLMENT` or `READY_FOR_TRAVEL`.
- `DeleteBookingDocumentsView` now uses the same `can_update_booking_documents()` gate as the create/update fulfillment endpoints, closing the completed-state delete bypass that still existed server-side.
- Admin booking detail now surfaces reported travelers from `traveller_detail[].report_rabbit` whenever the legacy detail payload returns `issue_status=REPORTED`.
- Added targeted backend tests for the completed-state delete rejection and reported-traveler serialization paths, but keep `BOOKING-008` and `BOOKING-009` marked `Open` until Phase 2 runs the required builds/checks/tests.

## Fix Backlog Run 20260311-184716 Phase 2 Verification (2026-03-11)

- Closed `BOOKING-008` after Phase 2 verification confirmed the completed-state guard path end to end: both partner frontends still build, backend `manage.py check` passes, the targeted delete-guard test passes, and source smoke shows the routed admin/operator fulfillment entrypoints now stop at read-only guard surfaces instead of entering edit flows for completed bookings.
- Kept `BOOKING-009` open. The admin reported-travelers section was added in Phase 1, but Phase 2 verification found the admin detail flow still consumes `/bookings/get_booking_detail_by_booking_number/` without the operator-style `passport_validity_detail -> traveller_detail` normalization.
- The targeted backend serializer assertion for the reported-traveler branch failed under `huz.settings_test`, which matches the source-level contract drift: `ReportBookingView` reserializes `DetailBookingSerializer`, the operator panel aliases `passport_validity_detail` in `src/api/apiUtils.js`, and the admin `getBookingDetails()` path in `src/utility/Api.js` still returns `response.data` unchanged.
- Follow-up for the next bounded fix:
  - normalize `passport_validity_detail` inside `Huz-Admin-Frontend/src/utility/Api.js`, or
  - update the admin `ReportedTravelers` surface to read the legacy field directly,
  - then rerun the same admin/operator builds plus the targeted `test_report_booking_marks_issue_status_and_serializes_reported_traveler` verification.

## Fix Backlog Run 20260311-184716 Phase 3 Handoff (2026-03-11)

- Status: Completed for summary and queueing only. No target-project code changed in this phase.
- Durable closeout for Batch 03:
  - `BOOKING-008` remains `Resolved` with the existing verification baseline: passing `Huz-Admin-Frontend` build, passing `Huz-Operator-Frontend` build, passing backend `manage.py check`, passing `test_delete_booking_documents_rejects_completed_booking`, and source smoke confirming completed-state fulfillment routes now stop at read-only guard surfaces.
  - `BOOKING-009` remains `Open` because the admin reported-travelers UI still expects `booking.traveller_detail`, while the active legacy booking-detail contract continues to serialize the traveler rows under `passport_validity_detail`.
- Exact next recommended backlog target:
  - `BOOKING-009` follow-up only
  - primary fix direction: normalize `passport_validity_detail -> traveller_detail` in `Huz-Admin-Frontend/src/utility/Api.js`, or make `ReportedTravelers.js` consume the legacy field directly without changing backend contracts
- Why this target is next:
  - it is the only unresolved item left in Booking Contract Batch 03, so closing it finishes the current booking-detail contract batch before moving to later dashboard/search or web support-origin cleanup
  - it stays on the same admin booking-detail surface already changed and verified in this run, which keeps the next diff bounded and low-risk
- Future-run starting context:
  - no fresh repo-wide booking scan is required; reuse the current workspace atlas docs, this backlog entry, the Phase 2 verification notes, and the existing Batch 03 run history
  - likely primary touchpoints are `Huz-Admin-Frontend/src/utility/Api.js`, `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/components/ReportedTravelers.js`, and `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`
  - minimum verification for the next run should include `npm run build` in `Huz-Admin-Frontend` plus the targeted `DJANGO_SETTINGS_MODULE=huz.settings_test ... test_report_booking_marks_issue_status_and_serializes_reported_traveler`; rerun the operator build as well if the follow-up is used to formally close the full Batch 03 verification set
- Downstream order after `BOOKING-009` remains:
  - Batch 04: `BOOKING-003`, `BOOKING-010`, and `BOOKING-011`

## Fix Backlog Run 20260311-192319 Phase 0 Target Selection (2026-03-11)

- Selected execution target for run `20260311-192319-fix-backlog`: Booking Contract Batch 04 only (`BOOKING-003`, `BOOKING-010`, and `BOOKING-011`).
- This selection intentionally follows the newer scoped run request instead of the prior backlog recommendation to finish `BOOKING-009` first; no global backlog reprioritization was made, and `BOOKING-009` remains `Open`.
- Selection stayed unchanged after re-reading the run request, workspace atlas/backlog docs, booking audit docs, and the current operator/web/backend source.
- Confirmed in-scope frontend touchpoints for the next implementation phase:
  - `Huz-Operator-Frontend/src/api/DashboardApi.js`
  - `Huz-Operator-Frontend/src/pages/Dashboard/components/overview/RecentBookingsMiniList.jsx`
  - `Huz-Operator-Frontend/src/pages/Dashboard/BookingsModule/components/Tabs.jsx`
  - `Huz-Operator-Frontend/src/api/BookingApi.js`
  - `Huz-Web-Frontend/src/pages/UserSetting/Support/supportUtils.js`
  - `Huz-Web-Frontend/src/pages/UserSetting/Support/help.jsx`
- Confirmed backend and config anchors for the batch:
  - `Huz-Operator-Frontend/.env` still omits `VITE_DASHBOARD_SUMMARY_ENDPOINT`, so the current dashboard fallback path remains active in this repo configuration.
  - `Huz-Backend/booking/manage_partner_booking.py` still requires `booking_status` or `workflow_bucket` and only applies search through `booking_number__icontains`, so traveler-name search is still unsupported on the active operator booking list contract.
  - `Huz-Backend/booking/serializers.py` still emits raw `complaint_attachment`, `request_attachment`, and `audio_message` media fields, so the split-origin fix remains a frontend URL-resolution responsibility unless the backend contract is deliberately expanded.
  - `Huz-Web-Frontend/src/services/api/httpClient.js` already exposes the API-origin base URL helper that the support history media links can reuse.
- Locked implementation direction for Phase 1:
  - make the operator dashboard recent-bookings card truthful in the no-summary-endpoint path by removing the misleading `READY`-only fallback semantics or by relabeling the widget to match the real scope
  - either add real traveler-name support end to end for the operator booking list or narrow the search copy/behavior so it matches booking-number-only filtering
  - resolve web help/support attachment and complaint-audio URLs against the API origin for relative media paths, and keep the fix bounded to the same support-history helper surface
  - keep the admin access-operator-profile module and the unresolved `BOOKING-009` admin reported-traveler follow-up out of scope unless a directly adjacent blocker appears
- Verification plan for later phases:
  - `npm run build` in `Huz-Operator-Frontend`
  - `npm run build` in `Huz-Web-Frontend`
  - backend verification only if the operator search contract or support-media serialization changes
  - source smoke after implementation to confirm the dashboard card copy/data scope is honest, the operator search UX no longer promises unsupported traveler-name matching, and support-history links open against the API origin in split-origin deployments
- Status note:
  - `BOOKING-003`, `BOOKING-010`, and `BOOKING-011` remain `Open` until implementation and verification complete; this phase only locks the batch and execution boundary.

## Fix Backlog Run 20260311-192319 Phase 1 Implementation (2026-03-11)

- Status: Implemented, verification pending.
- Implemented changes:
  - `BOOKING-003`: operator dashboard fallback summaries now store `recentBookingsScope=READY`, render the widget as "Ready Queue", report ready-scope totals, and mark the dashboard source chip as a ready-queue fallback when no unified summary endpoint is configured.
  - `BOOKING-010`: operator booking list search now passes `bookingNumber` explicitly and the UI copy/empty-state messaging state that search is booking-number-only.
  - `BOOKING-011`: web help/support history now resolves relative complaint/request attachment and complaint-audio links against `REACT_APP_API_BASE_URL` via the shared HTTP client helper.
- Phase boundary note:
  - no build, test, or backend check commands were run in this phase because verification is reserved for Phase 2 in this run.
- Remaining risk until Phase 2 completes:
  - `BOOKING-003`, `BOOKING-010`, and `BOOKING-011` stay `Open` until the required `Huz-Operator-Frontend` and `Huz-Web-Frontend` builds plus source/UI smoke confirm the new ready-queue labeling, booking-number-only search copy, and API-origin support media links.

## Fix Backlog Run 20260311-192319 Phase 2 Verification (2026-03-11)

- Closed `BOOKING-003`, `BOOKING-010`, and `BOOKING-011` as `Resolved` after the scoped Batch 04 verification completed successfully.
- Verification completed in this phase:
  - `npm run build` in `Huz-Operator-Frontend`: passed.
  - `npm run build` in `Huz-Web-Frontend`: passed with pre-existing warnings limited to `WEB-001` unused imports in `src/pages/PackageDetailPage/components/LeftColumn/Itinerary.js` plus the long-standing bundle-size advisory.
  - Source smoke confirmed the checked-in operator `.env` still omits `VITE_DASHBOARD_SUMMARY_ENDPOINT`, the dashboard fallback now renders as a ready queue instead of generic recent activity, the operator booking list now presents booking-number-only search semantics, and web support history links resolve relative media through the API origin helper.
- Backend verification was not required in this phase because Batch 04 stayed frontend-only and did not change the operator search backend contract or support-media serialization.
- Residual risk:
  - no authenticated browser session was run in this phase; confidence comes from the passing production builds plus source-level smoke on the exact affected consumer paths.

## Fix Backlog Run 20260311-192319 Phase 3 Handoff (2026-03-11)

- Status: Completed for summary and queueing only. No target-project code changed in this phase.
- Durable closeout for Batch 04:
  - `BOOKING-003`, `BOOKING-010`, and `BOOKING-011` remain `Resolved` with the existing Phase 2 verification baseline: passing `Huz-Operator-Frontend` and `Huz-Web-Frontend` builds plus source smoke on the ready-queue labeling, booking-number-only operator search, and API-origin support media link resolution.
  - Batch 04 stays frontend-only; no backend search filter, serializer, or route follow-up was introduced by this run.
- Exact next recommended backlog target:
  - `BOOKING-009` follow-up only
  - primary fix direction: normalize `passport_validity_detail -> traveller_detail` in `Huz-Admin-Frontend/src/utility/Api.js`, or make the admin `ReportedTravelers` surface consume the legacy field directly without changing backend contracts
- Why this target is next:
  - it is the only remaining unresolved booking-contract item in the current campaign after Batch 04 closed
  - it stays on the already-isolated admin booking-detail consumer path, so the next run can stay bounded instead of reopening the newly verified operator/web fixes
- Future-run starting context:
  - no fresh repo-wide booking scan is required; reuse the current atlas docs, this backlog entry, the Batch 03 Phase 2 verification notes, and the existing run history
  - likely primary touchpoints are `Huz-Admin-Frontend/src/utility/Api.js`, `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/components/ReportedTravelers.js`, and `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`
  - minimum verification for the next run should include `npm run build` in `Huz-Admin-Frontend` plus the targeted `DJANGO_SETTINGS_MODULE=huz.settings_test ... test_report_booking_marks_issue_status_and_serializes_reported_traveler`; rerun the operator build only if that follow-up is used to formally close the earlier full Batch 03 verification set
- Separate non-booking backlog items remain unchanged:
  - `WEB-001`
  - `WEB-002`
