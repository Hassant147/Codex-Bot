# Project Blueprint

Keep this file current whenever code changes touch architecture, flows, or module boundaries.

## Scope
- Target project: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Runtime: Django 5.0.6 + Django REST Framework 3.15 + drf-yasg
- Primary domains: customer identity and wallets, partner onboarding and package catalog, booking lifecycle, admin approvals and payouts
- Refresh basis: live working tree as inspected on 2026-03-12 during `system-atlas` Phase 1

## System Purpose
Huz-Backend is the backend for a Hajj and Umrah marketplace. It supports:

- Customer onboarding, profile management, addresses, wallets, and withdrawals
- Partner onboarding for individual and company operators
- Package enrollment and website package discovery
- Customer booking creation, staged payment submission, traveller passport capture, post-booking support, and review flows
- Partner booking fulfillment, operator document uploads, complaints handling, and receivable tracking
- Admin approval of partner companies, payment review, master hotel catalog maintenance, and partner payout release

## Runtime Architecture
### Application Shell
- `manage.py` boots Django with `huz.settings`.
- Operationally relevant management commands currently include `booking/management/commands/process_booking_timers.py` for lifecycle reconciliation and `partners/management/commands/seed_huz_packages.py` for local/dev catalog seeding.
- `huz/urls.py` mounts five route surfaces: `/api/v1/`, `/common/`, `/partner/`, `/bookings/`, and `/management/`, plus `/admin/`.
- `huz/settings.py` uses MySQL in normal environments, disables `DEBUG`, and conditionally exposes Swagger/Redoc plus Django-served media/static via environment flags.
- `huz/settings_test.py` swaps the database to SQLite and uses in-memory channel layers for non-interactive test runs.

### Installed Apps
- `common`: user identity, OTP, wallet, address, notifications, auth bridge, email/SMS/Firebase utilities
- `partners`: partner identity, company and individual profiles, package catalog, website package reads, partner wallet and withdrawals
- `booking`: booking workflow, payments, passports, complaints, requests, partner fulfillment, receivables
- `management`: back-office approvals, payment review queues, master hotel catalog, partner receivable release

### Authentication Model
- Modern authenticated endpoints use `SessionTokenHeaderAuthentication` with `Authorization: Bearer <token>` or `Authorization: Token <token>`.
- A compatibility bridge still accepts `session_token` and `partner_session_token` in query params or request payloads through `LegacySessionTokenAuthentication`.
- `common.middleware.LegacyAuthDeprecationHeaderMiddleware` marks fallback usage with `X-Auth-Deprecated`.
- The modern `/api/v1/` surface consistently uses `IsAdminOrAuthenticatedUserProfile` or `IsAdminOrAuthenticatedPartnerProfile`.
- Many legacy `/partner/` and `/common/` endpoints still declare `AllowAny` or `IsAdminUser` and resolve tokens manually inside the view.

## Core Data Domains
### Customer and Shared Platform (`common`)
- `UserProfile` is the customer identity root keyed by `session_token`.
- `Wallet`, `UserBankAccount`, `UserTransactionHistory`, and `UserWithdraw` hold customer wallet state.
- `MailingDetail` stores customer address state.
- `ManageNotification` stores outbound notification records for booking and account events.
- `UserOTP` stores phone OTP verification attempts with rate limiting.

### Partner and Package Catalog (`partners`)
- `PartnerProfile` is the operator identity root keyed by `partner_session_token`.
- `BusinessProfile`, `IndividualProfile`, `PartnerServices`, and `PartnerMailingDetail` expand partner identity and approval completeness.
- `Wallet`, `PartnerBankAccount`, `PartnerTransactionHistory`, and `PartnerWithdraw` hold partner financial state.
- `HuzBasicDetail` is the package aggregate root.
- `HuzPackageDateRange`, `HuzAirlineDetail`, `HuzTransportDetail`, `HuzHotelDetail`, `HuzHotelImage`, and `HuzZiyarahDetail` expand package itinerary and hotel media.

### Booking Lifecycle (`booking`)
- `Booking` owns customer-to-partner transaction state, staged payment windows, expiry windows, and workflow status.
- `Payment` stores minimum/full payment submissions and admin review metadata.
- `PassportValidity` stores one traveller record per passenger for each booking.
- `BookingDocuments`, `DocumentsStatus`, `BookingAirlineDetail`, and `BookingHotelAndTransport` capture operator fulfillment state.
- `BookingComplaints`, `BookingRequest`, `BookingObjections`, and `BookingRatingAndReview` capture customer support and feedback flows.
- `PartnersBookingPayment` tracks operator receivable settlements for completed fulfillment.

## Critical Flows
### 1. Customer onboarding and wallet bootstrap
- Legacy user onboarding starts in `common/user_profile.py`.
- OTP SMS is rate-limited by `common/throttling.py`, restricted to `+92`, and can use a dev bypass in local/debug contexts.
- User creation also provisions wallet state and downstream notification flows.
- Modern authenticated read/update flows for profile, address, bank accounts, withdrawals, and transactions live in `common/api_v1.py`.

### 2. Partner onboarding and approval
- Partner creation, login, email OTP, identity detail capture, address updates, and password changes live in `partners/partner_profile.py`.
- Company approval and optional sales-director assignment live in `management/approval_task.py`.
- Pending company review requires a fairly complete profile, services block, business block, mailing detail, and media assets.

### 3. Operator package catalog
- Routed operator package endpoints now go through `partners/package_management_operator.py` via `partners/views/operator_packages.py`.
- Packages can be created with date ranges, hotel/media, airline, transport, and ziyarah data.
- Website read endpoints still come from `partners/package_management.py`.
- Admin-maintained master hotel templates are stored as a synthetic package owned by the system in `management/approval_task.py`.

### 4. Booking creation and lifecycle progression
- Customer booking creation, lookup, removal, payment submission, and passport capture live in `booking/views/bookings.py`, `booking/views/api_v1.py`, and `booking/services.py`.
- Current-user retrieve plus the payment and passport mutation responses now reload through a preloaded detail queryset before `DetailBookingSerializer` runs, keeping the nested booking payload bounded to the booking detail read path.
- `booking/workflow.py` is the lifecycle state machine. It derives status transitions across `HOLD`, traveller detail collection, full payment, operator readiness, fulfillment, ready-for-travel, completion, cancellation, and expiry.
- `booking/querysets.py` annotates effective status, payment status, user buckets, operator buckets, and capacity filters to keep list queries aligned with workflow state.
- `booking/management/commands/process_booking_timers.py` is the scheduled catch-up mechanism for hold expiry, rejected-payment correction expiry, and post-travel auto-completion.

### 5. Admin payment review
- Admins review booking payments in `management/approval_task.py`.
- Payment-review queue summary metadata now comes from filtered aggregates over the annotated reviewable queryset instead of per-queue `.count()` fan-out.
- Approval creates missing traveller passport placeholders, clears correction windows, advances workflow, and sends email/push notifications.
- Rejection sets a two-hour correction deadline and stores a review message for the customer.

### 6. Operator fulfillment and payout release
- Partner-facing booking operations live in `booking/manage_partner_booking.py`.
- Operators can view bucketed bookings, upload visa/airline/hotel/transport documents, manage complaints, publish arrangement details, and close/report bookings.
- Partner dashboard booking totals and rating histograms now aggregate inside the database rather than looping through per-bucket counts or every rating row in Python.
- Once a booking reaches `READY_FOR_TRAVEL` or `COMPLETED`, admin payout release can move `PartnersBookingPayment` amounts into partner wallet state.

### 7. Customer support and objections
- Customers can raise complaints or requests through `booking/views/api_v1.py`.
- Operators manage those complaints in `booking/manage_partner_booking.py`.
- Operator objections against traveller documents route back to customers through the booking objection response action on the `/api/v1/bookings/<identifier>/objections/<objection_id>/response/` endpoint.

## Ownership Boundaries
| Domain | Owner modules | Boundary notes |
| --- | --- | --- |
| Platform auth and identity | `common/authentication.py`, `common/auth_utils.py`, `common/permissions.py`, `common/user_profile.py`, `common/api_v1.py` | Shared bridge for both customer and partner session-token auth; legacy token fallback remains active. |
| Partner identity and onboarding | `partners/partner_profile.py`, `partners/forgot_password.py` | High overlap with admin approval rules; changes here affect `/partner/` and `/management/`. |
| Package catalog and website discovery | `partners/package_management_operator.py`, `partners/package_management.py`, `partners/serializers.py` | Routed operator writes come from the operator module, but website reads still live in the legacy package module. |
| Booking customer workflow | `booking/views/bookings.py`, `booking/views/api_v1.py`, `booking/services.py`, `booking/workflow.py`, `booking/querysets.py` | Central booking contract and lifecycle logic; changes here cascade into partner and admin views. |
| Partner booking fulfillment | `booking/manage_partner_booking.py` | Reads and mutates the same booking lifecycle state as customer and admin flows. |
| Back-office approvals and payouts | `management/approval_task.py` | Touches partner approval, payment review, master hotel catalog, and wallet release. |

## External Integrations
- MySQL is the default runtime database.
- SQLite is used for non-interactive tests through `huz/settings_test.py`.
- Firebase Admin credentials are loaded from `common/firebase.json` or `FIREBASE_CREDENTIAL_PATH`.
- SMTP email delivery is handled synchronously or via daemon threads in `common/utility.py`.
- SMS OTP delivery uses an external VeevoTech endpoint from `common/user_profile.py`.
- Swagger and Redoc are available only when `ENABLE_API_DOCS=true`.

## Current Implementation Constraints
- The target repo is mid-refactor with a dirty working tree; atlas docs should be treated as mapping the current checked-out state, not the last clean commit.
- `partners/package_management.py` still contains legacy operator-style implementations, but routed operator package endpoints now use `partners/package_management_operator.py`. This duplicate seam is a collision risk for downstream refactors.
- `management/approval_task.py` defines `GetAllApprovedCompaniesView` and `ManageFeaturedPackageView`, but `management/urls.py` does not mount them.
- Legacy endpoints in `partners/partner_profile.py` and `partners/partner_accounts_and_transactions.py` still use `AllowAny` with token-in-payload/query handling, while modern `/api/v1/` routes use the auth bridge and explicit permission classes.
- The repository contains large media/static directories alongside product code, so scans should stay focused on dev-relevant files.
- Test coverage exists for `common`, `partners`, and `booking`, but there is no dedicated `management/tests.py` in the live working tree.

## Highest-Risk Files and Flows
- `booking/manage_partner_booking.py`: partner fulfillment, complaints, payout visibility, and large view density
- `booking/services.py`: booking creation, payment submission, passport validation, and lifecycle side effects
- `partners/package_management_operator.py`: normalized operator package write path with large contract surface
- `partners/package_management.py`: legacy package logic plus public website reads
- `partners/partner_profile.py`: partner onboarding and permissive legacy auth boundary
- `management/approval_task.py`: admin approvals, payment review, master hotels, payout transfer, and cache invalidation

## Safe Downstream Lanes
- Shared auth/platform: `common/*`
- Partner identity and account security: `partners/partner_profile.py`, `partners/forgot_password.py`, `partners/partner_accounts_and_transactions.py`
- Partner package operator and website catalog: `partners/package_management_operator.py`, `partners/package_management.py`, `partners/serializers.py`
- Customer booking lifecycle: `booking/views/bookings.py`, `booking/views/api_v1.py`, `booking/services.py`, `booking/workflow.py`, `booking/querysets.py`
- Partner booking fulfillment: `booking/manage_partner_booking.py`
- Admin approval and payouts: `management/approval_task.py`
