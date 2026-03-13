# API Surface

Track endpoints, service modules, request/response contracts, and important integration notes here.

## APIs

| API Group | Endpoint(s) | Contract Status | Implementation Notes |
| --- | --- | --- | --- |
| Partner Public Packages | `/partner/get_package_short_detail_for_web/`, `/partner/get_featured_packages/`, `/partner/get_package_detail_by_city_and_date/`, `/partner/get_package_detail_by_package_id_for_web/` | Stable | Phase 1 added shared optimized queryset strategy and relation prefetching; response shape preserved. |
| Booking Serialization Consumers | Endpoints using `DetailBookingSerializer` / `ShortBookingSerializer` in `booking` module | Stable | Phase 1 changed relation fallback internals to avoid redundant DB queries when prefetched relations are empty. |
| User OTP SMS | `/common/send_otp_sms/` and OTP send path in `/common/manage_user_account/` | Stable | Phase 1 introduced timeout + retry wrapper for outbound SMS requests; no request/response schema change. |
| DB Schema Performance Layer | N/A (model + migration layer) | Additive | Phase 1 introduced new additive indexes in partner/booking/common models with migrations for rollout. |
| Web Booking API | `POST /api/v1/bookings/`, `GET /api/v1/users/me/bookings/`, `GET|DELETE /api/v1/bookings/{booking_number}/`, `POST|PUT /api/v1/bookings/{booking_number}/passports/`, `POST|PUT /api/v1/bookings/{booking_number}/payments/` | Canonical | Active web-panel consumers now use `Huz-Web-Frontend/src/api/bookingApi.js` only; legacy `/bookings/*` fallbacks were removed from the main code path. |
| Web Support API | `POST /api/v1/bookings/{booking_number}/reviews/`, `POST /api/v1/bookings/{booking_number}/complaints/`, `GET /api/v1/users/me/complaints/`, `POST /api/v1/bookings/{booking_number}/requests/`, `GET /api/v1/users/me/requests/`, `PUT /api/v1/bookings/{booking_number}/objections/{objection_id}/response/` | Canonical | Backend `v1` support resources were added and `Huz-Web-Frontend/src/api/supportApi.js` is actively consumed by `/help` and `/operator-response`; Batch 04 Phase 1 now resolves relative support-history media URLs against `REACT_APP_API_BASE_URL` on the frontend without changing the serializer contract. |
| Web Profile API | `GET|PUT /api/v1/users/me/profile/`, `GET|POST|PUT /api/v1/users/me/address/` | Canonical | Active self-service profile/address consumers now use `Huz-Web-Frontend/src/api/profileApi.js`; `AuthApi.js` remains for auth/session work only. |
| Web Wallet API | `GET|POST|DELETE /api/v1/users/me/wallet/banks/`, `GET|POST /api/v1/users/me/wallet/withdrawals/`, `GET /api/v1/users/me/wallet/transactions/` | Canonical | Active wallet page now uses `Huz-Web-Frontend/src/api/walletApi.js`; older `/wallet/apis/*` routes are no longer in the active audited path. |
| Web Public Package API | `/partner/get_package_short_detail_for_web/`, `/partner/get_featured_packages/`, `/partner/get_package_detail_by_city_and_date/`, `/partner/get_package_detail_by_package_id_for_web/` | Canonical for now | Frontend ownership was centralized in `Huz-Web-Frontend/src/api/publicPackagesApi.js`; namespace renaming remains a deliberate future decision, not current contract drift. |
| Web Traveler Serialization Consumers | FE traveler and booking-status utilities | Updated | FE mapping supports backend `passport_validity_detail` and `passport_id`, and uploads now flow through the canonical passport resource. |
| Backend Legacy Partner Booking API | `/bookings/get_all_booking_detail_for_partner/`, `/bookings/get_booking_detail_by_booking_number/`, `/bookings/partner_action_for_booking/`, `/bookings/manage_booking_documents/`, `/bookings/manage_booking_airline_details/`, `/bookings/manage_booking_hotel_or_transport_details/`, `/bookings/delete_booking_documents/`, `/bookings/update_booking_status_into_close/`, `/bookings/update_booking_status_into_report_rabbit/` | Active legacy | Operator and admin panels still depend on partner-session-token contracts for booking list/detail/actions and fulfillment document flows; `/bookings/get_all_booking_detail_for_partner/` and `/bookings/get_all_complaints_for_partner/` are paginated contracts, `/bookings/get_booking_detail_by_booking_number/` still serializes partner detail with `hide_payment_detail`, and Release Gate Phase 1 made the traveler branch additive by exposing `traveller_detail` alongside `passport_validity_detail` plus reloading the booking before report responses serialize. Batch 02 Phase 1 aligned the admin consumer to route-owned booking identity plus the backend `operator_can_act` gate, Batch 03 verified the shared fulfillment-state gate on `delete_booking_documents`, and the Phase 1 release gate closed `BOOKING-009` on that legacy detail/report surface. |
| Backend Booking Summary Endpoints | `/bookings/get_overall_booking_statistics/`, `/bookings/get_yearly_earning_statistics/`, `/bookings/get_receivable_payment_statistics/`, `/bookings/get_overall_complaints_counts/`, `/bookings/get_overall_partner_rating/`, `/bookings/get_rating_and_review_package_wise/`, `/bookings/get_overall_rating_package_wise/` | Active legacy indirect | Operator and admin dashboards, complaints, reviews, and wallet/receivable views depend on these booking-derived aggregates even when no booking-detail page is open; `/bookings/get_receivable_payment_statistics/` returns a paginated envelope, the admin wallet consumers now normalize that envelope before slicing/mapping plus page through it on `/all-payments`, and Batch 04 Phase 1 now exposes the operator recent-bookings fallback as a ready-queue feed when no unified summary endpoint exists. |
| Management Payment Approval API | `/management/fetch_all_paid_bookings/`, `/management/approve_booking_payment/`, `/management/fetch_all_partner_receive_able_payments_details/`, `/management/transfer_partner_receive_able_payments/` | Active admin-only | Super-admin approval flows read pending paid bookings and mutate payment approval state, which can advance booking workflow for web, operator, and admin consumers; partner settlement review now reuses `/management/fetch_all_paid_bookings/` as the payment-proof source so it no longer relies on hidden `payment_detail` from the legacy partner-detail read. |
| Management Booking Reports | `/management/all-booking-status/`, `/management/count-of-bookings-with-their-prices/`, `/management/total-booking-with-traveller-and-finance/`, `/management/top-five-partners-bookings/`, `/management/top-five-partners-traveller/` | Active admin-only | Booking-derived reports live outside the `booking` namespace and need to stay in scope because they summarize booking status, value, and traveler counts. |
| Operator Panel Booking Consumers | Legacy `/bookings/*` routes via `Huz-Operator-Frontend/src/api/BookingApi.js`, `src/api/DashboardApi.js`, `src/api/complaintsAPI.js`, `src/api/ReviewRatingAPI.js` | Live consumer | `BookingRoutes`, recent bookings, dashboard summaries, complaints, and reviews all normalize legacy booking shapes and workflow buckets locally; Batch 03 Phase 1 now treats completed fulfillment detail as read-only and blocks subflow routes when backend fulfillment mutations would be rejected, while Batch 04 Phase 1 relabels the dashboard fallback as a ready queue and makes the booking-search contract explicitly booking-number-only. |
| Admin Panel Booking Consumers | Legacy `/bookings/*` and `/management/*` routes via `Huz-Admin-Frontend/src/utility/Api.js` and `src/utility/Super-Admin-Api.js` | Live consumer | Partner dashboard, bookings, receivable payments, and super-admin approval pages still mix booking detail endpoints with management queues, but March 11 Batch 01 resolved the first-page-only booking/complaint/receivable assumptions, Batch 02 Phase 1 moved booking detail/subflows onto route-owned booking identity while gating pending actions on `operator_can_act`, and Batch 03 verified the completed-state read-only behavior. Release Gate Phase 1 closed `BOOKING-009` by making the backend legacy detail/report payload itself expose `traveller_detail`, so the admin reported-travelers surface now renders against the same field it already consumes. |

### Verification Snapshot (2026-03-11 Release Gate Phase 1)
- `npm --prefix Huz-Admin-Frontend run build`: passed with pre-existing warnings only.
- `npm --prefix Huz-Operator-Frontend run lint`: passed.
- `npm --prefix Huz-Operator-Frontend run check:tokens`: passed.
- `npm --prefix Huz-Operator-Frontend run check:keys`: passed.
- `npm --prefix Huz-Operator-Frontend run check:blankrel`: passed.
- `npm --prefix Huz-Operator-Frontend run check:bundle`: passed.
- `npm --prefix Huz-Operator-Frontend run build`: passed.
- `npm --prefix Huz-Operator-Frontend run test:e2e`: passed (`1/1` mocked Playwright smoke).
- `npm --prefix Huz-Web-Frontend run build`: passed with known `WEB-001` unused-import warnings plus the existing bundle-size advisory only.
- `Huz-Backend/.venv/bin/python manage.py check --settings=huz.settings_test`: passed.
- `Huz-Backend/.venv/bin/python manage.py test --settings=huz.settings_test --noinput ...`: passed (`13/13`) after the release-gate compatibility fix for the legacy `REPORTED` traveler payload and the targeted approval-test helper restoration.

### Verification Snapshot (2026-03-11)
- `npm --prefix Huz-Operator-Frontend run build`: passed after Batch 04 dashboard truthfulness and booking-search contract alignment.
- `npm --prefix Huz-Web-Frontend run build`: passed after the support-media origin fix; warnings stayed limited to `WEB-001` unused imports in `src/pages/PackageDetailPage/components/LeftColumn/Itinerary.js` and the existing bundle-size advisory.
- Backend verification was not required because Batch 04 did not change backend search filters or support-media serializer output.
- Source smoke confirmed the checked-in operator `.env` still omits `VITE_DASHBOARD_SUMMARY_ENDPOINT`, the dashboard fallback now advertises `recentBookingsScope=READY`, operator search still forwards only `booking_number`, and web support history links resolve relative media through `API_BASE_URL`.

### Verification Snapshot (2026-03-09)
- `manage.py check`: passed.
- Focused backend tests for new `common` `v1` endpoints: passed.
- Focused backend tests for booking `v1` payment/support flows: passed.
- `npm --prefix Huz-Web-Frontend run build`: passed after profile module extraction (warnings only, no compile failures).
- `npm --prefix Huz-Web-Frontend run build`: passed after the user-setting `accountModule` migration; no API contract changes were introduced by the layout refactor.

### Historical Verification Snapshot (2026-03-06)
- `manage.py check`: passed.
- `manage.py makemigrations --check --dry-run partners booking common`: passed (no drift after manual migration files).
- Focused regression tests for touched backend areas: passed (`15` tests).
- `npm --prefix Huz-Web-Frontend run build`: passed after contract-sync changes (warnings only, no compile failures).
