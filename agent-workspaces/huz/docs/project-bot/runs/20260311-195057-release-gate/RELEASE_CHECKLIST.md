# Release Checklist

Run: `20260311-195057-release-gate`
Date: `2026-03-11`
Target project: `/Users/macbook/Desktop/Huz`

## Goal

Clear the final March 11 booking-contract release gate with one explicit checklist, one blocker list, and one verification baseline for all four touched surfaces.

## Mandatory Automated Checks

### Huz-Admin-Frontend

- Working directory: `/Users/macbook/Desktop/Huz/Huz-Admin-Frontend`
- Required command:
  - `npm run build`
- Notes:
  - No committed frontend unit/integration test files were found under `src/`; the production build is the repo-native automated gate for this surface in the current tree.

### Huz-Operator-Frontend

- Working directory: `/Users/macbook/Desktop/Huz/Huz-Operator-Frontend`
- Required commands:
  - `npm run lint`
  - `npm run check:tokens`
  - `npm run check:keys`
  - `npm run check:blankrel`
  - `npm run check:bundle`
  - `npm run build`
  - `npm run test:e2e`
- Notes:
  - `npm run test:e2e` uses the checked-in mocked Playwright smoke (`tests/e2e/operator-panel.smoke.spec.js`) and does not require live backend fixtures.

### Huz-Web-Frontend

- Working directory: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`
- Required command:
  - `npm run build`
- Notes:
  - No committed frontend unit/integration test files were found under `src/`; build verification plus source/manual smoke remains the available automated gate here.

### Huz-Backend

- Working directory: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Required commands:
  - `./.venv/bin/python manage.py check --settings=huz.settings_test`
  - `./.venv/bin/python manage.py test --settings=huz.settings_test --noinput booking.tests.BookingWorkflowServiceValidationTests.test_v1_booking_detail_locks_actions_for_full_payment_under_review booking.tests.BookingWorkflowServiceValidationTests.test_v1_payment_endpoint_accepts_path_booking_identifier booking.tests.BookingWorkflowServiceValidationTests.test_v1_payment_endpoint_accepts_receipt_upload_in_single_request booking.tests.BookingWorkflowServiceValidationTests.test_v1_complaint_endpoint_creates_record_and_user_list_returns_it booking.tests.BookingWorkflowServiceValidationTests.test_v1_request_endpoint_creates_record_and_user_list_returns_it booking.tests.ApproveBookingPaymentViewTests.test_admin_review_queue_includes_pending_full_payment_bookings booking.tests.ApproveBookingPaymentViewTests.test_full_payment_approval_without_minimum_unlocks_the_correct_lifecycle_states booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_returns_paginated_empty_payload booking.tests.ManagePartnerBookingViewsTests.test_receivable_payment_statistics_are_scoped_to_partner booking.tests.ManagePartnerBookingViewsTests.test_booking_list_filters_by_booking_number booking.tests.ManagePartnerBookingViewsTests.test_complaints_list_supports_status_and_search_filters booking.tests.ManagePartnerBookingViewsTests.test_delete_booking_documents_rejects_completed_booking booking.tests.ManagePartnerBookingViewsTests.test_report_booking_marks_issue_status_and_serializes_reported_traveler`
- Notes:
  - Use `--settings=huz.settings_test` as the durable backend signal for this release gate. Earlier MySQL `--keepdb` runs were environment-sensitive and should not be the primary release verdict evidence.

## Manual and Source Smoke Checks

- Admin `issue_status=REPORTED` detail must render reported traveler data after any `BOOKING-009` fix and must not depend on operator-only aliases.
- Admin booking routes under `/booking/:bookingNumber/*` must remain route-owned and must not regress to `localStorage("bookingNumber")` coupling.
- Super-admin settlement review must still show payment proof after any admin booking detail normalization.
- Operator dashboard must stay truthfully labeled as a ready-queue fallback while `Huz-Operator-Frontend/.env` leaves `VITE_DASHBOARD_SUMMARY_ENDPOINT` unset.
- Web support complaint/request attachments and audio must resolve against `REACT_APP_API_BASE_URL`, not the frontend origin.
- Workspace docs and project-local March 11 booking docs must agree on the final status before the release verdict is written.

## Known Blockers and High-Risk Notes

- Hard blocker: `BOOKING-009` is still open and is the only unresolved item in `BOOKING-001` through `BOOKING-011`. Phase 1 must fix it or record a concrete blocker before any GO verdict.
- Release automation blocker: `/Users/macbook/Desktop/Huz/scripts/release-gate.sh` is stale for the current repo state. It runs `check:api-contract`, `check:asset-sizes`, `check:no-console`, `report:build-sizes`, and `e2e` inside `Huz-Web-Frontend`, but those scripts do not exist in the current `Huz-Web-Frontend/package.json`. Run the scoped commands above directly.
- Documentation blocker: the project-local March 11 booking docs had drifted behind the workspace memory before this phase. Phase 2 must preserve the sync performed here when writing the final verdict.
- Warning watchlist: `WEB-001` unused imports in `Huz-Web-Frontend/src/pages/PackageDetailPage/components/LeftColumn/Itinerary.js` and `WEB-002` bundle-size advisory remain known non-booking warnings unless Phase 1 shows a regression.
- Working-tree note: all four target repos currently contain March 11 campaign changes, so verification must be recorded against the live working tree rather than an assumed clean `HEAD`.
