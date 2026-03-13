# API Surface

Track endpoints, service modules, request/response contracts, and important integration notes here.

## Auth and Session Contract
| Surface | Auth contract | Primary modules | Notes |
| --- | --- | --- | --- |
| Modern customer and operator API | `Authorization: Bearer <session token>` or `Authorization: Token <session token>` | `common/authentication.py`, `common/auth_utils.py`, `common/permissions.py` | Preferred path for `/api/v1/` and routed operator package endpoints. |
| Legacy compatibility auth | `session_token` or `partner_session_token` in query params or request payload | `common/authentication.py`, legacy views across `partners/*`, `common/user_profile.py`, `booking/manage_partner_booking.py` | Still accepted; responses may include `X-Auth-Deprecated`. |
| Django admin auth | Standard Django staff session/auth backend | `django.contrib.auth`, `management/approval_task.py` | Used for `/management/` and `/admin/`. |

## Customer Identity and Wallet APIs
| Surface | Endpoints | Request contract | Response contract | Service/modules | Notes |
| --- | --- | --- | --- | --- | --- |
| Legacy phone OTP | `/common/send_otp_sms/`, `/common/verify_otp/` | Phone number and OTP fields; SMS send restricted to `+92`; admin-authenticated | Success/error message payloads | `common/user_profile.py`, `common/throttling.py` | OTP send uses external SMS gateway and optional dev bypass. |
| Legacy customer existence and creation | `/common/is_user_exist/`, `/common/manage_user_account/` | Phone number lookup or profile-creation payload | Serialized `UserProfile` or status message | `common/user_profile.py`, `common/serializers.py` | `/common/is_user_exist/` returns a full `UserProfileSerializer` payload, while `/common/manage_user_account/` remains `IsAdminUser` for both create and delete in the current tree; the create flow provisions wallet state and sends outbound side effects. |
| Current user profile | `/api/v1/users/me/profile/` | Optional `name`, `email`, `user_gender` on update | `UserProfileSerializer` with `wallet_amount` | `common/api_v1.py`, `common/serializers.py` | Modern read/update contract. |
| Current user address | `/api/v1/users/me/address/` | `street_address`, `city`, `state`, `country`, `postal_code`, optional lat/long and `address_id` on update | `MailingDetailSerializer` with `full_address` | `common/api_v1.py`, `common/models.py` | Toggles `UserProfile.is_address_exist`. |
| Current user bank accounts | `/api/v1/users/me/wallet/banks/` | Create: `account_title`, `account_number`, `bank_name`, `branch_code`; delete: `account_id` | `UserBankAccountSerializer[]` or message | `common/api_v1.py` | Duplicate bank records are rejected. |
| Current user withdrawals | `/api/v1/users/me/wallet/withdrawals/` | `account_id`, `withdraw_amount` | `UserWithdrawSerializer[]` or created withdrawal | `common/api_v1.py`, `common/models.py` | Uses wallet-balance checks and atomic decrement. |
| Current user transactions | `/api/v1/users/me/wallet/transactions/` | No body | `UserTransactionSerializer[]` | `common/api_v1.py` | Ordered newest-first. |

## Partner Identity and Onboarding APIs
| Surface | Endpoints | Request contract | Response contract | Service/modules | Notes |
| --- | --- | --- | --- | --- | --- |
| Partner auth | `/partner/partner_login/`, `/partner/forgot_password_request/`, `/partner/update_forgot_password_request/` | Email/password or reset token payloads | `PartnerProfileSerializer` or message | `partners/partner_profile.py`, `partners/forgot_password.py` | Password reset URL points at `OPERATOR_PANEL_BASE_URL/reset-password/<token>`. |
| Partner existence and registration | `/partner/is_user_exist/`, `/partner/create_partner_profile/` | Email or phone lookup; partner profile creation payload | `PartnerProfileSerializer` or message | `partners/partner_profile.py`, `partners/serializers.py` | Registration is open on POST in the current working tree. |
| Partner verification and services | `/partner/resend_otp/`, `/partner/verify_otp/`, `/partner/partner_service/` | Email OTP or service flags payloads | Message or serialized partner/service data | `partners/partner_profile.py` | Mostly legacy `AllowAny` endpoints using payload tokens. |
| Partner identity details | `/partner/register_as_individual/`, `/partner/update_individual_partner_profile/`, `/partner/register_as_company/`, `/partner/update_partner_company_profile/` | Individual or business profile media/text fields | Serialized partner detail | `partners/partner_profile.py`, `partners/models.py` | Completion of these blocks determines admin approval eligibility. |
| Partner profile maintenance | `/partner/get_partner_profile/`, `/partner/check_username_exist/`, `/partner/get_partner_address_detail/`, `/partner/update_partner_address_detail/`, `/partner/update_company_logo/`, `/partner/change_partner_password/` | Token plus profile/address/media fields | Serialized partner data or message | `partners/partner_profile.py` | Security-hardening work should revisit these `AllowAny` routes. |

## Partner Package and Catalog APIs
### Operator package write/read surface
| Surface | Endpoints | Request contract | Response contract | Service/modules | Notes |
| --- | --- | --- | --- | --- | --- |
| Package root | `/partner/enroll_package_basic_detail/` | Authenticated partner token plus package type/name, price fields, night counts, description, inclusion flags, and optional `package_date_range[]` | `HuzAlignedPackageSerializer`-style package payload | `partners/package_management_operator.py`, `partners/serializers.py` | Current canonical operator package contract; supports range-only packages without top-level summary dates. |
| Airline detail | `/partner/enroll_package_airline_detail/` | Airline fields and package token | Airline detail payload | `partners/package_management_operator.py` | Uses normalized partner auth. |
| Transport detail | `/partner/enroll_package_transport_detail/` | Transport fields and package token | Transport detail payload | `partners/package_management_operator.py` | Tied to package root. |
| Hotel detail and media | `/partner/enroll_package_hotel_detail/` | Hotel fields, package token, uploaded images | Hotel payload with flattened `images` | `partners/package_management_operator.py`, `partners/serializers.py` | Reuses admin master hotel templates where available. |
| Ziyarah detail | `/partner/enroll_package_ziyarah_detail/` | Ziyarah list and package token | Ziyarah payload | `partners/package_management_operator.py` | Optional package enrichment layer. |
| Package status and stats | `/partner/change_huz_package_status/`, `/partner/get_partner_overall_package_statistics/` | Partner token plus package or filter fields | Status message or aggregate stats | `partners/package_management_operator.py` | Stats are partner-scoped. |
| Partner package reads | `/partner/get_package_short_detail_by_partner_token/`, `/partner/get_package_detail_by_partner_token/`, `/partner/get_all_hotels_with_images/` | Partner token plus optional package token/filter params | Short or detailed package payloads | `partners/package_management_operator.py` | Routed through `partners/views/operator_packages.py`. |

### Public website package reads
| Surface | Endpoints | Request contract | Response contract | Service/modules | Notes |
| --- | --- | --- | --- | --- | --- |
| Website package list/detail | `/partner/get_package_short_detail_for_web/`, `/partner/get_package_detail_by_package_id_for_web/` | Public query params such as package token and filters | Public package serializer payloads | `partners/package_management.py`, `partners/serializers.py` | Depends on legacy package module. |
| Featured/search reads | `/partner/get_featured_packages/`, `/partner/get_package_detail_by_city_and_date/` | Public search params | Public package list payloads | `partners/package_management.py` | Search and featured behavior still live outside the new operator module. |

## Customer Booking APIs
| Surface | Endpoints | Request contract | Response contract | Service/modules | Notes |
| --- | --- | --- | --- | --- | --- |
| Booking create/list/detail/delete | `/api/v1/bookings/`, `/api/v1/bookings/<booking_identifier>/`, `/api/v1/users/me/bookings/`, `/api/v1/users/me/bookings/existing/` | `BookingCreateRequestSerializer` requires `session_token`, `partner_session_token`, `huz_token`, traveller counts, room mix, dates, total price, special request, and payment type | `CurrentUserBookingListSerializer` or detailed booking serializer with workflow fields | `booking/views/bookings.py`, `booking/services.py`, `booking/serializers.py` | Booking create can resume an existing booking when applicable, the viewset backfills `session_token` from the authenticated user context for non-admin callers before serializer validation, detail-style responses now reuse a preloaded booking detail queryset before serialization, and `booking/tests.py` contains focused regressions for the retrieve/payment/passport query budget. |
| Payment submission | `/api/v1/bookings/<booking_identifier>/payments/` | `session_token`, `booking_number`, stage (`transaction_type`), amount, optional transaction number/receipt file | Detailed booking payload after mutation | `booking/views/api_v1.py`, `booking/request_serializers.py`, `booking/services.py` | Supports minimum and full payment stages, enforces unique transaction numbers and correction windows, and returns a reloaded prefetch-heavy detail payload after mutation. |
| Traveller passports | `/api/v1/bookings/<booking_identifier>/passports/` | `session_token`, `booking_number`, traveller identity fields, passport document, traveller photo | Detailed booking payload after mutation | `booking/views/api_v1.py`, `booking/services.py` | One traveller record per expected passenger, and successful writes now return a reloaded prefetch-heavy detail payload. |
| Reviews | `/api/v1/bookings/<booking_identifier>/reviews/` | Rating payload with `partner_total_stars` plus optional Huz rating components and comments | Detailed booking payload | `booking/views/api_v1.py`, `booking/models.py` | Only allowed once booking reaches ready-for-travel or completed. |
| Complaints | `/api/v1/bookings/<booking_identifier>/complaints/` | Complaint title/message plus optional audio and attachment | `BookingComplaintsSerializer` payload | `booking/views/api_v1.py`, `common/utility.py` | Sends complaint email to partner and persists support ticket. |
| Requests | `/api/v1/bookings/<booking_identifier>/requests/` | Request title/message plus optional attachment | `BookingRequestSerializer` payload | `booking/views/api_v1.py` | Only allowed in fulfillment, ready-for-travel, or completed stages. |
| Objection response | `/api/v1/bookings/<booking_identifier>/objections/<objection_id>/response/` | Customer remarks plus objection document upload | Updated booking detail | `booking/views/api_v1.py` | Clears `issue_status` back to `NONE` when accepted. |

## Partner Booking Fulfillment APIs
| Surface | Endpoints | Request contract | Response contract | Service/modules | Notes |
| --- | --- | --- | --- | --- | --- |
| Booking queues and detail | `/bookings/get_all_booking_detail_for_partner/`, `/bookings/get_booking_detail_by_booking_number/` | `partner_session_token` plus queue filters such as `booking_status`, `workflow_bucket`, `booking_number` | Partner list/detail booking serializers with workflow fields | `booking/manage_partner_booking.py`, `booking/querysets.py`, `booking/serializers.py` | Queue visibility depends on minimum payment approval and issue state. |
| Operator actions | `/bookings/partner_action_for_booking/`, `/bookings/update_booking_status_into_close/`, `/bookings/update_booking_status_into_report_rabbit/` | Partner token, booking number, action/status data | Updated booking detail | `booking/manage_partner_booking.py`, `booking/workflow.py` | Operator actions and admin payment review must stay aligned with workflow transitions. |
| Fulfillment documents | `/bookings/manage_booking_documents/`, `/bookings/delete_booking_documents/`, `/bookings/manage_booking_airline_details/`, `/bookings/manage_booking_hotel_or_transport_details/` | Partner token, booking number, document or arrangement fields | Updated detail payload or message | `booking/manage_partner_booking.py`, `booking/models.py` | Drives `DocumentsStatus` completion and ready-for-travel transitions. |
| Ratings, complaints, and stats | `/bookings/get_overall_partner_rating/`, `/bookings/get_rating_and_review_package_wise/`, `/bookings/get_overall_rating_package_wise/`, `/bookings/get_overall_complaints_counts/`, `/bookings/get_all_complaints_for_partner/`, `/bookings/give_feedback_on_complaints/`, `/bookings/get_overall_booking_statistics/`, `/bookings/get_yearly_earning_statistics/`, `/bookings/get_receivable_payment_statistics/` | Partner token plus optional filter params | Aggregate stats or complaint/rating payloads | `booking/manage_partner_booking.py` | Uses prefetched/nested booking data extensively; Phase 1 backend-optimize moved workflow and rating summaries onto SQL aggregates, and `booking/tests.py` now bounds the optimized stats/rating routes to the expected low-query paths. |

`booking/manage_partner_booking.py` is only partially migrated to auth-context-first token handling. Queue/detail and several statistics reads prefer `extract_partner_session_token()` from the authenticated partner context when present, but many mutation handlers still fetch `PartnerProfile` from request-body `partner_session_token`.

## Admin APIs
| Surface | Endpoints | Request contract | Response contract | Service/modules | Notes |
| --- | --- | --- | --- | --- | --- |
| Company approvals | `/management/approved_or_reject_company/`, `/management/fetch_all_pending_companies/`, `/management/fetch_all_sale_directors/` | Admin session plus partner token/status filters | Partner or user profile payloads and messages | `management/approval_task.py`, `partners/models.py` | Pending-company list is cached and enforces completeness rules. |
| Payment review queue | `/management/approve_booking_payment/`, `/management/fetch_all_paid_bookings/` | Admin session plus `session_token`, `booking_number`, optional `payment_id`, `decision`, filters like `payment_queue` and `order_date` | Updated booking detail or paginated admin queue payload | `management/approval_task.py`, `booking/workflow.py`, `booking/querysets.py` | Approval/rejection emits email and push notifications, can create passport placeholders, now derives queue counts and queue-specific total amounts from consolidated filtered aggregates, defers operator-document reads until fulfillment-state workflow recalculation actually needs them, and is currently regression-covered from `booking/tests.py` because the repo has no dedicated `management/tests.py`. |
| Receivables | `/management/fetch_all_partner_receive_able_payments_details/`, `/management/transfer_partner_receive_able_payments/` | Admin session plus partner token and booking number | Paginated receivable payload or updated payout detail | `management/approval_task.py`, `booking/models.py`, `partners/models.py` | Release is only allowed once booking reaches ready-for-travel or completed. |
| Master hotel catalog | `/management/manage_master_hotels/` | CRUD payload with hotel city/name/rating/room-sharing fields and image uploads | Count/results list or created/updated hotel payload | `management/approval_task.py`, `partners/models.py` | Uses a synthetic system package token `__system_master_hotel_package__` and 30-second caching. |

## Workflow-Derived Response Fields
The booking serializers inject derived fields that downstream consumers rely on:

- `minimum_payment_status`
- `full_payment_status`
- `client_workflow_stage`
- `client_workflow_step`
- `operator_visible`
- `operator_can_act`
- `client_can_edit_travellers`
- `client_can_submit_minimum_payment`
- `client_can_submit_full_payment`
- `remaining_amount_due`
- `workflow_bucket`

These values are computed from `booking/workflow.py` and annotated query helpers in `booking/querysets.py`. Any contract change here is cross-cutting.

## Important Integration Notes
- Firebase push and SMTP email side effects are triggered from shared utility helpers and admin payment-review flows.
- File uploads land in local media storage through Django `FileSystemStorage`; many booking and partner flows depend on uploaded images or PDFs.
- The public docs surface is feature-flagged and not always present in production.
- The modern booking lifecycle depends on periodic execution of `process_booking_timers`; without it, expired holds and post-travel completion can lag behind.
