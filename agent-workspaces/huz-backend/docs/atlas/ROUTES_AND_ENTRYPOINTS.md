# Routes and Entrypoints

Track frontend routes, backend route groups, entry components, and bootstrap paths here.

## Bootstrap Entrypoints
| Entrypoint | Path | Purpose | Notes |
| --- | --- | --- | --- |
| Django CLI | `/Users/macbook/Desktop/Huz/Huz-Backend/manage.py` | Standard management-command bootstrap | Uses `huz.settings` by default. |
| WSGI app | `/Users/macbook/Desktop/Huz/Huz-Backend/huz/wsgi.py` | Deployment WSGI entrypoint | Standard synchronous deployment path. |
| ASGI app | `/Users/macbook/Desktop/Huz/Huz-Backend/huz/asgi.py` | ASGI entrypoint | Present even though `ASGI_APPLICATION` is commented in `huz/settings.py`. |
| Root router | `/Users/macbook/Desktop/Huz/Huz-Backend/huz/urls.py` | Mounts all HTTP route groups | Also conditionally exposes Swagger/Redoc and Django static/media serving. |
| Booking lifecycle timer | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/management/commands/process_booking_timers.py` | Scheduled reconciler for booking expiry and completion | Must be run out-of-band by ops/cron; there is no Celery worker in the inspected tree. |
| Package seed command | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/management/commands/seed_huz_packages.py` | Developer data-seeding entrypoint for package catalog scenarios | Creates realistic package graphs and can attach them to an existing partner or bootstrap a seed partner. |

## Root Route Mounts
| Prefix | Mounted module | Auth model | Purpose | Notes |
| --- | --- | --- | --- | --- |
| `/api/v1/` | `booking.api_urls` and `common.api_urls` | Modern session-token auth bridge | Current authenticated customer API surface | `Authorization: Bearer/Token <session token>` preferred. |
| `/common/` | `common.urls` | Mostly admin or legacy public | Legacy customer onboarding and utility endpoints | Still uses manual token payloads for some writes. |
| `/partner/` | `partners.urls` | Mixed legacy public and newer authenticated operator routes | Partner onboarding, catalog, website reads, and partner account operations | Security posture varies endpoint-by-endpoint. |
| `/bookings/` | `booking.urls` | Partner auth bridge alias + admin override | Partner booking operations and stats | Bucketed by booking state and issue state. |
| `/management/` | `management.urls` | Django admin user | Back-office approvals, payment review, receivables, master hotels | `GetAllApprovedCompaniesView` and `ManageFeaturedPackageView` are defined but not mounted. |
| `/admin/` | Django admin site | Django staff auth | Built-in Django admin | Secondary/backstop admin surface. |
| `/huz_swagger/` | drf-yasg view | AllowAny when enabled | Swagger UI | Only mounted when `ENABLE_API_DOCS=true`. |
| `/huz_redoc/` | drf-yasg view | AllowAny when enabled | ReDoc UI | Only mounted when `ENABLE_API_DOCS=true`. |
| `/media/*` and `/static/*` | Django `serve` view | Public when enabled | Local media/static fallback | Only mounted when `SERVE_MEDIA_AND_STATIC_FROM_DJANGO=true`. |

## `/common/` Legacy User Routes
| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `POST` | `/common/send_otp_sms/` | `SendOTPSMSAPIView` | `IsAdminUser` + throttles | Send phone OTP for user onboarding. |
| `PUT` | `/common/verify_otp/` | `MatchOTPSMSAPIView` | `IsAdminUser` | Verify phone OTP. |
| `POST` | `/common/is_user_exist/` | `IsUserExistView` | `AllowAny` | Check whether a user exists by phone number. |
| `POST`, `DELETE` | `/common/manage_user_account/` | `CreateMemberProfileView` | `IsAdminUser` | Create or delete user profile. |
| `PUT` | `/common/upload_user_photo/` | `UploadUserImageView` | `IsAdminUser` | Upload customer profile photo. |
| `PUT` | `/common/update_firebase_token/` | `UpdateFirebaseTokenView` | `IsAdminUser` | Update user push token state. |

## `/api/v1/` Current User Routes
| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `GET`, `PUT` | `/api/v1/users/me/profile/` | `CurrentUserProfileView` | `IsAdminOrAuthenticatedUserProfile` | Read/update current user profile. |
| `GET`, `POST`, `PUT` | `/api/v1/users/me/address/` | `CurrentUserAddressView` | `IsAdminOrAuthenticatedUserProfile` | Read/create/update customer address. |
| `GET`, `POST`, `DELETE` | `/api/v1/users/me/wallet/banks/` | `CurrentUserWalletBankAccountsView` | `IsAdminOrAuthenticatedUserProfile` | Manage customer bank accounts. |
| `GET`, `POST` | `/api/v1/users/me/wallet/withdrawals/` | `CurrentUserWalletWithdrawalsView` | `IsAdminOrAuthenticatedUserProfile` | List/create customer withdrawals. |
| `GET` | `/api/v1/users/me/wallet/transactions/` | `CurrentUserWalletTransactionsView` | `IsAdminOrAuthenticatedUserProfile` | List customer wallet transactions. |
| `GET` | `/api/v1/users/me/bookings/` | `BookingViewSet.list` alias | `IsAdminOrAuthenticatedUserProfile` | Convenience alias for current-user bookings. |
| `GET` | `/api/v1/users/me/bookings/existing/` | `CurrentUserExistingBookingView` | `IsAdminOrAuthenticatedUserProfile` | Check if the user already has a booking for a package/window. |
| `GET` | `/api/v1/users/me/complaints/` | `CurrentUserComplaintListView` | `IsAdminOrAuthenticatedUserProfile` | List customer complaint history. |
| `GET` | `/api/v1/users/me/requests/` | `CurrentUserRequestListView` | `IsAdminOrAuthenticatedUserProfile` | List customer request history. |

## `/api/v1/bookings/` Router Surface
`booking.api_urls` registers `BookingViewSet` as a DRF router resource. The detail identifier is whatever `booking.services.get_booking_by_identifier_for_user()` accepts in the current working tree, so downstream changes must preserve that resolver contract. For authenticated non-admin callers, `booking/views/bookings.py` backfills `session_token` from the auth context before serializer validation; admin callers can still provide an explicit token. Current-user retrieve plus the payment/passport mutation responses now reload a prefetch-heavy detail queryset before `DetailBookingSerializer` runs.

| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v1/bookings/` | `BookingViewSet.list` | `IsAdminOrAuthenticatedUserProfile` | Paginated current-user booking list with workflow buckets. |
| `POST` | `/api/v1/bookings/` | `BookingViewSet.create` | `IsAdminOrAuthenticatedUserProfile` | Create or resume a booking for a package/date range. |
| `GET` | `/api/v1/bookings/<booking_identifier>/` | `BookingViewSet.retrieve` | `IsAdminOrAuthenticatedUserProfile` | Fetch booking detail through the preloaded detail queryset. |
| `DELETE` | `/api/v1/bookings/<booking_identifier>/` | `BookingViewSet.destroy` | `IsAdminOrAuthenticatedUserProfile` | Remove a booking when cancellation rules allow it. |
| `POST`, `PUT` | `/api/v1/bookings/<booking_identifier>/payments/` | `BookingViewSet.payments` | `IsAdminOrAuthenticatedUserProfile` | Create/update minimum or full payment records and return preloaded detail. |
| `POST`, `PUT` | `/api/v1/bookings/<booking_identifier>/passports/` | `BookingViewSet.passports` | `IsAdminOrAuthenticatedUserProfile` | Create/update traveller passport rows and return preloaded detail. |
| `POST` | `/api/v1/bookings/<booking_identifier>/reviews/` | `BookingViewSet.reviews` | `IsAdminOrAuthenticatedUserProfile` | Create booking rating and review after travel-ready/completed stages. |
| `POST` | `/api/v1/bookings/<booking_identifier>/complaints/` | `BookingViewSet.complaints` | `IsAdminOrAuthenticatedUserProfile` | Raise a complaint against the booking/package/partner. |
| `POST` | `/api/v1/bookings/<booking_identifier>/requests/` | `BookingViewSet.requests` | `IsAdminOrAuthenticatedUserProfile` | Raise a post-booking support request. |
| `PUT` | `/api/v1/bookings/<booking_identifier>/objections/<objection_id>/response/` | `BookingViewSet.objection_response` | `IsAdminOrAuthenticatedUserProfile` | Upload customer objection response documents and clear issue state. |

## `/partner/` Partner Routes
### Partner identity and onboarding
| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `POST` | `/partner/forgot_password_request/` | `ForgotEmail` | `AllowAny` | Send partner password reset link. |
| `PUT` | `/partner/update_forgot_password_request/` | `UpdatePassword` | `AllowAny` | Reset password using reset token. |
| `POST` | `/partner/partner_login/` | `PartnerLoginView` | `AllowAny` | Authenticate partner by email/password. |
| `POST` | `/partner/is_user_exist/` | `IsPartnerExistView` | `AllowAny` | Check partner existence by email or phone. |
| `POST`, `DELETE` | `/partner/create_partner_profile/` | `CreatePartnerProfileView` | `POST` is open, `DELETE` uses class default admin auth | Create or delete a partner profile. |
| `GET` | `/partner/get_partner_profile/` | `GetPartnerProfileView` | `AllowAny` | Read partner profile by token. |
| `PUT` | `/partner/resend_otp/` | `SendEmailOTPView` | `AllowAny` | Send partner email verification OTP. |
| `PUT` | `/partner/verify_otp/` | `MatchEmailOTPView` | `AllowAny` | Verify partner email OTP. |
| `POST` | `/partner/partner_service/` | `PartnerServicesView` | `AllowAny` | Create/update partner service flags. |
| `POST` | `/partner/register_as_individual/` | `IndividualPartnerView` | `AllowAny` | Capture individual partner identity detail. |
| `PUT` | `/partner/update_individual_partner_profile/` | `UpdatePartnerIndividualProfileView` | `AllowAny` | Update individual partner detail. |
| `POST` | `/partner/register_as_company/` | `BusinessPartnerView` | `AllowAny` | Capture company partner detail. |
| `PUT` | `/partner/update_partner_company_profile/` | `UpdateBusinessProfileView` | `AllowAny` | Update company profile detail. |
| `POST` | `/partner/check_username_exist/` | `CheckPartnerUsernameAvailabilityView` | `AllowAny` | Check partner username availability. |
| `GET` | `/partner/get_partner_address_detail/` | `GetPartnerAddressView` | `AllowAny` | Read partner address detail. |
| `PUT` | `/partner/update_partner_address_detail/` | `UpdatePartnerAddressView` | `AllowAny` | Update partner address detail. |
| `PUT` | `/partner/update_company_logo/` | `UpdateCompanyLogoView` | `AllowAny` | Upload company logo. |
| `PUT` | `/partner/change_partner_password/` | `ChangePasswordView` | `AllowAny` | Change partner password. |

### Operator package catalog
| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `POST`, `PUT` | `/partner/enroll_package_basic_detail/` | `CreateHuzPackageView` | `IsAdminOrAuthenticatedPartnerProfile` | Create/update package root and date-range summary. |
| `POST`, `PUT` | `/partner/enroll_package_airline_detail/` | `CreateHuzAirlineView` | `IsAdminOrAuthenticatedPartnerProfile` | Create/update airline itinerary detail. |
| `POST`, `PUT` | `/partner/enroll_package_transport_detail/` | `CreateHuzTransportView` | `IsAdminOrAuthenticatedPartnerProfile` | Create/update transport detail. |
| `POST`, `PUT` | `/partner/enroll_package_hotel_detail/` | `CreateHuzHotelView` | `IsAdminOrAuthenticatedPartnerProfile` | Create/update hotel and hotel-image detail. |
| `POST`, `PUT` | `/partner/enroll_package_ziyarah_detail/` | `CreateHuzZiyarahView` | `IsAdminOrAuthenticatedPartnerProfile` | Create/update ziyarah itinerary detail. |
| `PUT` | `/partner/change_huz_package_status/` | `ManageHuzPackageStatusView` | `IsAdminOrAuthenticatedPartnerProfile` | Toggle package status. |
| `GET` | `/partner/get_package_short_detail_by_partner_token/` | `GetHuzShortPackageByTokenView` | `IsAdminOrAuthenticatedPartnerProfile` | List partner package summaries. |
| `GET` | `/partner/get_package_detail_by_partner_token/` | `GetHuzPackageDetailByTokenView` | `IsAdminOrAuthenticatedPartnerProfile` | Retrieve detailed package payload. |
| `GET` | `/partner/get_partner_overall_package_statistics/` | `GetPartnersOverallPackagesStatisticsView` | `IsAdminOrAuthenticatedPartnerProfile` | Aggregate package totals and ratings. |
| `GET` | `/partner/get_all_hotels_with_images/` | `GetAllHotelsWithImagesView` | `IsAdminOrAuthenticatedPartnerProfile` | Read reusable hotel/media catalog for package enrollment. |

### Website package reads
| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `GET` | `/partner/get_package_short_detail_for_web/` | `GetHuzShortPackageForWebsiteView` | `AllowAny` | Public package list for the website. |
| `GET` | `/partner/get_package_detail_by_package_id_for_web/` | `GetHuzPackageDetailForWebsiteView` | `AllowAny` | Public package detail payload. |
| `GET` | `/partner/get_featured_packages/` | `GetHuzFeaturedPackageForWebsiteView` | `AllowAny` | Public featured package list. |
| `GET` | `/partner/get_package_detail_by_city_and_date/` | `GetSearchPackageByCityNDateView` | `AllowAny` | Public filtered package search. |

### Partner financial routes
| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `GET`, `POST`, `DELETE` | `/partner/manage_partner_bank_account/` | `ManagePartnerBankAccountView` | `AllowAny` + token in query/body | Manage partner bank accounts. |
| `GET`, `POST` | `/partner/manage_partner_withdraw_request/` | `ManagePartnerWithdrawView` | `AllowAny` + token in query/body | List/create partner withdrawals. |
| `GET` | `/partner/get_partner_all_transaction_history/` | `GetPartnerAllTransactionHistoryView` | `AllowAny` + token in query | List partner transaction history. |
| `GET` | `/partner/get_partner_over_transaction_amount/` | `GetPartnerTransactionOverallSummaryView` | `AllowAny` + token in query | Aggregate partner wallet summary. |

## `/bookings/` Partner Booking Routes
| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `GET` | `/bookings/get_all_booking_detail_for_partner/` | `GetBookingShortDetailForPartnersView` | `IsAdminOrPartnerSessionToken` | Partner booking queue with status/workflow filters. |
| `GET` | `/bookings/get_booking_detail_by_booking_number/` | `GetBookingDetailByBookingNumberForPartnerView` | `IsAdminOrPartnerSessionToken` | Detailed partner-facing booking payload. |
| `PUT` | `/bookings/partner_action_for_booking/` | `TakeActionView` | `IsAdminOrPartnerSessionToken` | Advance booking from operator-ready into fulfillment-related states. |
| `POST` | `/bookings/manage_booking_documents/` | `ManageBookingDocumentsView` | `IsAdminOrPartnerSessionToken` | Upload visa/airline/hotel/transport documents. |
| `DELETE` | `/bookings/delete_booking_documents/` | `DeleteBookingDocumentsView` | `IsAdminOrPartnerSessionToken` | Remove booking documents. |
| `POST`, `PUT` | `/bookings/manage_booking_airline_details/` | `BookingAirlineDetailsView` | `IsAdminOrPartnerSessionToken` | Create/update booking-specific airline detail. |
| `POST`, `PUT` | `/bookings/manage_booking_hotel_or_transport_details/` | `BookingHotelAndTransportDetailsView` | `IsAdminOrPartnerSessionToken` | Create/update booking-specific hotel/transport arrangements. |
| `GET` | `/bookings/get_overall_partner_rating/` | `GetOverallRatingView` | `IsAdminOrPartnerSessionToken` | DB-aggregated partner-wide rating summary. |
| `GET` | `/bookings/get_rating_and_review_package_wise/` | `GetRatingPackageWiseView` | `IsAdminOrPartnerSessionToken` | Ratings and reviews grouped by package. |
| `GET` | `/bookings/get_overall_rating_package_wise/` | `GetPackageOverallRatingView` | `IsAdminOrPartnerSessionToken` | DB-aggregated rating metrics for a specific package. |
| `GET` | `/bookings/get_overall_complaints_counts/` | `GetOverallPartnerComplaintsView` | `IsAdminOrPartnerSessionToken` | Complaint totals by status. |
| `GET` | `/bookings/get_all_complaints_for_partner/` | `GetPartnerComplaintsView` | `IsAdminOrPartnerSessionToken` | Complaint list for the operator. |
| `POST` | `/bookings/give_feedback_on_complaints/` | `GiveUpdateOnComplaintsView` | `IsAdminOrPartnerSessionToken` | Update complaint resolution status/message. |
| `GET` | `/bookings/get_overall_booking_statistics/` | `GetPartnersOverallBookingStatisticsView` | `IsAdminOrPartnerSessionToken` | Aggregate booking status and workflow summary via filtered counts. |
| `GET` | `/bookings/get_yearly_earning_statistics/` | `GetYearlyBookingStatisticsView` | `IsAdminOrPartnerSessionToken` | Monthly/yearly revenue trend summary. |
| `GET` | `/bookings/get_receivable_payment_statistics/` | `PartnersBookingPaymentView` | `IsAdminOrPartnerSessionToken` | Partner receivable totals and payout visibility. |
| `PUT` | `/bookings/update_booking_status_into_close/` | `CloseBookingView` | `IsAdminOrPartnerSessionToken` | Close booking after fulfillment is complete. |
| `PUT` | `/bookings/update_booking_status_into_report_rabbit/` | `ReportBookingView` | `IsAdminOrPartnerSessionToken` | Raise operator-side reported issue. |

## `/management/` Admin Routes
| Method(s) | Route | Handler | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `PUT` | `/management/approved_or_reject_company/` | `ApprovedORRejectCompanyView` | `IsAdminUser` | Approve/reject pending company partner accounts. |
| `GET` | `/management/fetch_all_pending_companies/` | `GetAllPendingApprovalsView` | `IsAdminUser` | List reviewable pending companies. |
| `GET` | `/management/fetch_all_sale_directors/` | `GetAllSaleDirectorsView` | `IsAdminUser` | List active sales director user profiles. |
| `PUT` | `/management/approve_booking_payment/` | `ApproveBookingPaymentView` | `IsAdminUser` | Approve/reject booking payment submissions. |
| `GET` | `/management/fetch_all_paid_bookings/` | `FetchPaidBookingView` | `IsAdminUser` | Paginated payment-review queue and history buckets with aggregate queue metadata. |
| `GET` | `/management/fetch_all_partner_receive_able_payments_details/` | `GetPartnerReceiveAblePaymentsView` | `IsAdminUser` | List receivable partner payments pending transfer. |
| `PUT` | `/management/transfer_partner_receive_able_payments/` | `ManagePartnerReceiveAblePaymentView` | `IsAdminUser` | Transfer receivable amount into partner wallet state. |
| `GET`, `POST`, `PUT`, `DELETE` | `/management/manage_master_hotels/` | `ManageMasterHotelsCatalogView` | `IsAdminUser` | CRUD admin-managed reusable hotel templates and images. |

## Unmounted but Present View Classes
| View class | Source file | Reason it matters |
| --- | --- | --- |
| `GetAllApprovedCompaniesView` | `/Users/macbook/Desktop/Huz/Huz-Backend/management/approval_task.py` | Exists in source and uses caching/prefetching, but no current route mounts it. |
| `ManageFeaturedPackageView` | `/Users/macbook/Desktop/Huz/Huz-Backend/management/approval_task.py` | Exists in source for featured-package toggles, but is not mounted. |

## Route-Level Constraints
- `/api/v1/` is the preferred modern API surface for customer flows and new auth-dependent work.
- `/partner/` contains a mix of legacy `AllowAny` endpoints and newer authenticated operator endpoints; hardening work should not assume consistent auth semantics across that prefix.
- `booking/manage_partner_booking.py` is only partially migrated to auth-context-first partner resolution: queue/detail and several statistics endpoints use `extract_partner_session_token()`, but many mutation handlers still reload `PartnerProfile` directly from request-supplied `partner_session_token`.
- `/bookings/` and `/management/approve_booking_payment/` both mutate booking lifecycle state, so changes to statuses or payment semantics must be coordinated across those surfaces.
- Package changes span both `partners/package_management_operator.py` and `partners/package_management.py`; website routes still depend on the legacy module.
- Focused query-budget regressions for the optimized current-user booking detail/payment/passport routes, partner stats/rating summaries, and admin payment-review queue currently live in `booking/tests.py`; the live tree still has no dedicated `management/tests.py`.
