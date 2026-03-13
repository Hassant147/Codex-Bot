# Master System Atlas

Consolidated from the verified `system-atlas` run `20260307-154419-system-atlas`.
Last verified: 2026-03-07 (Phase 2 - Validate Atlas Coverage).

## Scope
- Target project: `/Users/macbook/Desktop/Huz`
- Scope level: `panel-fullstack`
- Surfaces covered:
  - `Huz-Backend` (Django 5 monolith)
  - `Huz-Web-Frontend` (public/user React app)
  - `Huz-Admin-Frontend` (super-admin + partner React app)
  - `Huz-Operator-Frontend` (operator React app)
- This run refreshed docs only. No target-project code was changed.

## Verification Snapshot
- Backend endpoints discovered from live URL configs: **122**
- Backend endpoints consumed by frontend modules: **89**
- Backend endpoints with no frontend consumer: **33**
- Frontend endpoint literals missing backend route: **10**
- FE unique endpoint literals by panel:
  - Web: **29**
  - Admin: **64**
  - Operator: **48**

## Architecture Overview
- Backend exposes six route groups: `/api/v1`, `/common`, `/partner`, `/bookings`, `/management`, `/chat`.
- Frontend contracts are owned in FE API utility layers, not in a shared typed contract package.
- Audience split:
  - Web handles discovery, booking, payments, complaints, and user account flows.
  - Admin handles super-admin approvals plus partner dashboard flows.
  - Operator handles partner onboarding, package operations, booking operations, wallet, and reviews.

## System Surfaces and Entrypoints
| Surface | Path | Entrypoint | Primary Responsibility |
| --- | --- | --- | --- |
| Backend | `Huz-Backend` | `huz/urls.py`, `manage.py`, `huz/asgi.py`, `huz/wsgi.py` | API routing, auth/profile, package/booking workflows, admin approvals, reporting, chat |
| Web Frontend | `Huz-Web-Frontend` | `src/index.js` -> `src/App.js` -> `src/routes/AppRoutes.jsx` | Public package browsing, booking, payments, user settings |
| Admin Frontend | `Huz-Admin-Frontend` | `src/index.js` -> `src/App.js` | Super-admin operations and partner panel workflows |
| Operator Frontend | `Huz-Operator-Frontend` | `src/main.jsx` -> `src/App.jsx` -> `src/routes/index.jsx` | Operator dashboard, package management, booking operations |

## Ownership Boundaries
| Area | Primary Ownership |
| --- | --- |
| `common` | End-user identity, OTP, profile/account primitives, firebase token, wallet/account helpers |
| `partners` | Partner auth/profile, company setup, package lifecycle, partner wallet, website package listing APIs |
| `booking` | Booking lifecycle, payments, passport/document flows, partner booking operations, complaints, reviews, requests |
| `booking.api_v1` | DRF booking routes under `/api/v1` |
| `management` | Super-admin approvals, payment transfer, KPI/reporting, master hotels |
| `chat` | REST chat inbox/message APIs and websocket routing |
| Web FE API Layer | `src/api/AuthApi.js`, `src/api/apiService.js`, `src/api/homepageApi.js`, `src/api/listingApi.js`, `src/api/packageDetailApi.js` |
| Admin FE API Layer | `src/utility/AuthApis.js`, `src/utility/Api.js`, `src/utility/Super-Admin-Api.js` |
| Operator FE API Layer | `src/api/authAPI.js`, `src/api/companyAPI.js`, `src/api/PackageAPI.js`, `src/api/BookingApi.js`, `src/api/DashboardApi.js`, `src/api/WalletApi.js`, `src/api/ReviewRatingAPI.js`, `src/api/complaintsAPI.js` |

## Critical Product Flows
1. Web user signup/login/profile setup
- Uses `/common/is_user_exist/`, `/common/send_otp_sms/`, `/common/verify_otp/`, `/common/manage_user_account/`, and profile update endpoints.

2. Package discovery and booking
- Discovery uses `/partner/get_featured_packages/`, `/partner/get_package_short_detail_for_web/`, `/partner/get_package_detail_by_city_and_date/`, `/partner/get_package_detail_by_package_id_for_web/`.
- Booking uses `/bookings/create_booking_view/`, `/bookings/check_passport_validity/`, `/bookings/pay_booking_amount_by_transaction_*`, `/bookings/raise_complaint_booking_wise/`, `/bookings/raise_a_request/`, and `/api/v1/users/me/bookings/`.

3. Partner/operator onboarding and package lifecycle
- Uses `/partner/partner_login/`, `/partner/create_partner_profile/`, `/partner/register_as_company/`, `/partner/update_partner_company_profile/`, `/partner/update_company_logo/`, `/partner/get_partner_profile/`.
- Package management uses `/partner/enroll_package_*`, `/partner/get_package_*_by_partner_token/`, `/partner/change_huz_package_status/`, `/partner/get_partner_overall_package_statistics/`.

4. Booking operations and complaint handling
- Uses `/bookings/get_all_booking_detail_for_partner/`, `/bookings/get_booking_detail_by_booking_number/`, `/bookings/partner_action_for_booking/`, `/bookings/manage_booking_documents/`, `/bookings/manage_booking_airline_details/`, `/bookings/manage_booking_hotel_or_transport_details/`.

5. Super-admin approvals and financial controls
- Uses `/management/fetch_all_pending_companies/`, `/management/approved_or_reject_company/`, `/management/approve_booking_payment/`, `/management/transfer_partner_receive_able_payments/`, and related review endpoints.

## Module Map
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| Backend Core Config | `Huz-Backend/huz` | Django settings, root URL routing, ASGI/WSGI bootstrapping | Root URL includes all six API groups |
| Common Domain | `Huz-Backend/common` | End-user auth/profile, OTP, address, firebase token, user wallet/account primitives | 17 endpoints; 10 FE-connected |
| Partner Domain | `Huz-Backend/partners` | Partner auth/profile, package lifecycle, website listing APIs, partner wallet ops | 37 endpoints; 36 FE-connected |
| Booking Domain | `Huz-Backend/booking` | Booking creation/payment/passport, partner booking operations, complaints/reviews/requests | 34 endpoints; 31 FE-connected |
| Booking v1 API | `Huz-Backend/booking/api_urls.py`, `Huz-Backend/booking/views/api_v1.py` | DRF booking endpoints under `/api/v1` | 5 endpoints; 3 FE-connected |
| Management Domain | `Huz-Backend/management` | Super-admin approvals, payment transfer, reporting/KPI, hotel master catalog | 24 endpoints; 9 FE-connected |
| Chat Domain | `Huz-Backend/chat` | REST chat inbox/message endpoints plus websocket routing | 5 endpoints; 0 FE-connected |
| Web App Shell | `Huz-Web-Frontend/src` | Public site, booking flow, user settings UI | Main routing in `src/routes/AppRoutes.jsx` |
| Admin App Shell | `Huz-Admin-Frontend/src` | Super-admin routes and partner panel routes | Route arrays in `src/App.js` |
| Operator App Shell | `Huz-Operator-Frontend/src` | Operator auth/account setup plus dashboard modules | Main router in `src/routes/index.jsx` |

## Backend Route Groups and Coverage
| Route Group | Source | Total Endpoints | FE-Connected | Backend-only | Notes |
| --- | --- | --- | --- | --- | --- |
| `/api/v1/` | `Huz-Backend/booking/api_urls.py`, `booking/views/api_v1.py` | 5 | 3 | 2 | DRF booking list/create and payment/passport actions |
| `/common/` | `Huz-Backend/common/urls.py` | 17 | 10 | 7 | User auth/profile/account primitives |
| `/partner/` | `Huz-Backend/partners/urls.py` | 37 | 36 | 1 | Partner auth/profile/package and website package listing |
| `/bookings/` | `Huz-Backend/booking/urls.py` | 34 | 31 | 3 | User and partner booking lifecycle |
| `/management/` | `Huz-Backend/management/urls.py` | 24 | 9 | 15 | Super-admin approvals and reporting |
| `/chat/` | `Huz-Backend/chat/urls.py` | 5 | 0 | 5 | REST chat APIs currently unused by FE API clients |

## Frontend Routes and Boundaries
### Web
- Entrypoints:
  - `Huz-Web-Frontend/src/index.js`
  - `Huz-Web-Frontend/src/App.js`
  - `Huz-Web-Frontend/src/routes/AppRoutes.jsx`
- Major public routes:
  - `/`, `/listing-page`, `/package-detail-page`
  - `/signup`, `/login`, `/otp`
  - `/about-us`, `/how-we-work`, `/privacy-policy`, and similar content routes
- Protected account routes:
  - `/bookings`, `/package-booking`, `/booking-status`
  - `/payment-methods`, `/remaining-payment`, `/payment-wallet`
  - `/personal-details`, `/messages`, `/wishlist`

### Admin
- Entrypoints:
  - `Huz-Admin-Frontend/src/index.js`
  - `Huz-Admin-Frontend/src/App.js`
- Main route groups:
  - `SUPER_ADMIN_ROUTES`: `/super-admin-dashboard`, `/pending-profiles`, `/approve-amounts`, `/hotel-catalog`, and related admin flows
  - `PARTNER_ROUTES`: `/partner-dashboard`, `/package-type`, `/packages`, `/booking`, `/wallet`, `/complaints`, and related partner flows
- Route guards:
  - `SuperAdminProtectedRoute`
  - `PartnerPanelProtectedRoute`
  - `LoginRedirectRoute`

### Operator
- Entrypoints:
  - `Huz-Operator-Frontend/src/main.jsx`
  - `Huz-Operator-Frontend/src/App.jsx`
  - `Huz-Operator-Frontend/src/routes/index.jsx`
- Public/auth routes:
  - `/login`, `/signup`, `/signup/password`, `/password-reset`, `/reset-password/:token`
  - `/verify-email`, `/notification`, `/rejection`
  - `/faq`, `/privacy-policy`, `/terms-of-services`, `/documentation`
- Protected dashboard routes:
  - `pages/Dashboard/DashboardRoutes.jsx`
  - `/package-creation/*`, `/package-listing`, `/package-detailed-page/:huzToken`
  - `/booking-module/*` via `pages/Dashboard/BookingsModule/BookingRoutes.jsx`
  - `/wallet`, `/reviews-ratings`, `/profile`, optional `/team`

## Backend API List and Frontend Module Connections
### booking.api_v1
| Endpoint | Frontend module connections | Status |
| --- | --- | --- |
| `/api/v1/bookings/` | Web: `web:api/apiService.js` | Connected |
| `/api/v1/bookings/{param}/` | None | Backend-only |
| `/api/v1/bookings/{param}/passports/` | None | Backend-only |
| `/api/v1/bookings/{param}/payments/` | Web: `web:api/apiService.js` | Connected |
| `/api/v1/users/me/bookings/` | Web: `web:api/apiService.js`, `web:api/packageDetailApi.js` | Connected |

### booking
| Endpoint | Frontend module connections | Status |
| --- | --- | --- |
| `/bookings/check_passport_validity/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/create_booking_view/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/delete_booking_documents/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/BookingApi.js` | Connected |
| `/bookings/delete_payment_record/` | None | Backend-only |
| `/bookings/get_all_booking_detail_for_partner/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/BookingApi.js`, `operator:api/DashboardApi.js` | Connected |
| `/bookings/get_all_booking_short_detail_by_user/` | Web: `web:api/apiService.js`, `web:api/packageDetailApi.js` | Connected |
| `/bookings/get_all_complaints_by_user/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/get_all_complaints_for_partner/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/complaintsAPI.js` | Connected |
| `/bookings/get_booking_detail_by_booking_number/` | Admin: `admin:utility/Api.js`, `admin:utility/Super-Admin-Api.js`; Operator: `operator:api/BookingApi.js` | Connected |
| `/bookings/get_overall_booking_statistics/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/DashboardApi.js` | Connected |
| `/bookings/get_overall_complaints_counts/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/DashboardApi.js`, `operator:api/complaintsAPI.js` | Connected |
| `/bookings/get_overall_partner_rating/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/DashboardApi.js`, `operator:api/ReviewRatingAPI.js` | Connected |
| `/bookings/get_overall_rating_package_wise/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/ReviewRatingAPI.js` | Connected |
| `/bookings/get_rating_and_review_package_wise/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/ReviewRatingAPI.js` | Connected |
| `/bookings/get_receivable_payment_statistics/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/DashboardApi.js`, `operator:api/WalletApi.js` | Connected |
| `/bookings/get_user_all_request/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/get_yearly_earning_statistics/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/DashboardApi.js` | Connected |
| `/bookings/give_feedback_on_complaints/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/complaintsAPI.js` | Connected |
| `/bookings/manage_booking_airline_details/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/BookingApi.js` | Connected |
| `/bookings/manage_booking_documents/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/BookingApi.js` | Connected |
| `/bookings/manage_booking_hotel_or_transport_details/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/BookingApi.js` | Connected |
| `/bookings/manage_custom_package/` | None | Backend-only |
| `/bookings/manage_user_check_in/` | None | Backend-only |
| `/bookings/manage_user_passport_photo/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/manage_user_passport/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/objection_response_by_user/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/partner_action_for_booking/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/BookingApi.js` | Connected |
| `/bookings/pay_booking_amount_by_transaction_number/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/pay_booking_amount_by_transaction_photo/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/raise_a_request/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/raise_complaint_booking_wise/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/rating_and_review/` | Web: `web:api/apiService.js` | Connected |
| `/bookings/update_booking_status_into_close/` | Operator: `operator:api/BookingApi.js` | Connected |
| `/bookings/update_booking_status_into_report_rabbit/` | Operator: `operator:api/BookingApi.js` | Connected |

### common
| Endpoint | Frontend module connections | Status |
| --- | --- | --- |
| `/common/get_user_all_transaction_history/` | None | Backend-only |
| `/common/get_user_overall_transaction_summary/` | None | Backend-only |
| `/common/is_user_exist/` | Web: `web:api/AuthApi.js`; Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/common/manage_user_account/` | Web: `web:api/AuthApi.js` | Connected |
| `/common/manage_user_address_detail/` | Web: `web:api/AuthApi.js` | Connected |
| `/common/manage_user_bank_account/` | None | Backend-only |
| `/common/manage_user_withdraw_request/` | None | Backend-only |
| `/common/send_otp_email/` | None | Backend-only |
| `/common/send_otp_sms/` | Web: `web:api/AuthApi.js` | Connected |
| `/common/update_firebase_token/` | Operator: `operator:api/authAPI.js` | Connected |
| `/common/update_user_email/` | Web: `web:api/AuthApi.js` | Connected |
| `/common/update_user_gender/` | Web: `web:api/AuthApi.js`, `web:api/apiService.js` | Connected |
| `/common/update_user_name/` | Web: `web:api/AuthApi.js` | Connected |
| `/common/upload_user_photo/` | Operator: `operator:api/authAPI.js` | Connected |
| `/common/user_subscribe/` | None | Backend-only |
| `/common/verify_otp_email/` | None | Backend-only |
| `/common/verify_otp/` | Web: `web:api/AuthApi.js` | Connected |

### partners
| Endpoint | Frontend module connections | Status |
| --- | --- | --- |
| `/partner/change_huz_package_status/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/PackageAPI.js` | Connected |
| `/partner/change_partner_password/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/authAPI.js` | Connected |
| `/partner/check_username_exist/` | Admin: `admin:utility/AuthApis.js` | Connected |
| `/partner/create_partner_profile/` | Admin: `admin:utility/AuthApis.js`; Operator: `operator:api/authAPI.js`, `operator:api/companyAPI.js` | Connected |
| `/partner/enroll_package_airline_detail/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/PackageAPI.js` | Connected |
| `/partner/enroll_package_basic_detail/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/PackageAPI.js` | Connected |
| `/partner/enroll_package_hotel_detail/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/PackageAPI.js` | Connected |
| `/partner/enroll_package_transport_detail/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/PackageAPI.js` | Connected |
| `/partner/enroll_package_ziyarah_detail/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/PackageAPI.js` | Connected |
| `/partner/forgot_password_request/` | Operator: `operator:api/authAPI.js` | Connected |
| `/partner/get_all_hotels_with_images/` | Operator: `operator:api/PackageAPI.js` | Connected |
| `/partner/get_city_wise_packages_count/` | None | Backend-only |
| `/partner/get_featured_packages/` | Web: `web:api/apiService.js`, `web:api/homepageApi.js` | Connected |
| `/partner/get_package_detail_by_city_and_date/` | Web: `web:api/apiService.js`, `web:api/listingApi.js` | Connected |
| `/partner/get_package_detail_by_package_id_for_web/` | Web: `web:api/apiService.js`, `web:api/packageDetailApi.js`; Admin: `admin:utility/Api.js` | Connected |
| `/partner/get_package_detail_by_partner_token/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/PackageAPI.js` | Connected |
| `/partner/get_package_short_detail_by_partner_token/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/PackageAPI.js`, `operator:api/ReviewRatingAPI.js` | Connected |
| `/partner/get_package_short_detail_for_web/` | Web: `web:api/apiService.js`, `web:api/listingApi.js` | Connected |
| `/partner/get_partner_address_detail/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/companyAPI.js` | Connected |
| `/partner/get_partner_all_transaction_history/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/WalletApi.js` | Connected |
| `/partner/get_partner_over_transaction_amount/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/DashboardApi.js`, `operator:api/WalletApi.js` | Connected |
| `/partner/get_partner_overall_package_statistics/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/DashboardApi.js`, `operator:api/PackageAPI.js` | Connected |
| `/partner/get_partner_profile/` | Operator: `operator:api/authAPI.js`, `operator:api/companyAPI.js` | Connected |
| `/partner/is_user_exist/` | Admin: `admin:utility/AuthApis.js`; Operator: `operator:api/authAPI.js` | Connected |
| `/partner/manage_partner_bank_account/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/WalletApi.js` | Connected |
| `/partner/manage_partner_withdraw_request/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/WalletApi.js` | Connected |
| `/partner/partner_login/` | Admin: `admin:utility/AuthApis.js`; Operator: `operator:api/authAPI.js` | Connected |
| `/partner/partner_service/` | Admin: `admin:utility/AuthApis.js`; Operator: `operator:api/companyAPI.js` | Connected |
| `/partner/register_as_company/` | Admin: `admin:utility/AuthApis.js` | Connected |
| `/partner/register_as_individual/` | Admin: `admin:utility/AuthApis.js` | Connected |
| `/partner/resend_otp/` | Admin: `admin:utility/AuthApis.js`; Operator: `operator:api/authAPI.js` | Connected |
| `/partner/update_company_logo/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/companyAPI.js` | Connected |
| `/partner/update_forgot_password_request/` | Operator: `operator:api/authAPI.js` | Connected |
| `/partner/update_individual_partner_profile/` | Admin: `admin:utility/Api.js` | Connected |
| `/partner/update_partner_address_detail/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/companyAPI.js` | Connected |
| `/partner/update_partner_company_profile/` | Admin: `admin:utility/Api.js`; Operator: `operator:api/authAPI.js`, `operator:api/companyAPI.js` | Connected |
| `/partner/verify_otp/` | Admin: `admin:utility/AuthApis.js`; Operator: `operator:api/authAPI.js` | Connected |

### management
| Endpoint | Frontend module connections | Status |
| --- | --- | --- |
| `/management/all-booking-status/` | None | Backend-only |
| `/management/all-packages-status/` | None | Backend-only |
| `/management/approve_booking_payment/` | Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/management/approved_or_reject_company/` | Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/management/complaint-status-count/` | None | Backend-only |
| `/management/count-of-bookings-with-their-prices/` | None | Backend-only |
| `/management/distinct-complaints-counts/` | None | Backend-only |
| `/management/fetch_all_approved_companies/` | Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/management/fetch_all_paid_bookings/` | Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/management/fetch_all_partner_receive_able_payments_details/` | Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/management/fetch_all_pending_companies/` | Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/management/fetch_all_sale_directors/` | Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/management/manage_featured_package/` | None | Backend-only |
| `/management/manage_master_hotels/` | Admin: `admin:utility/Api.js` | Connected |
| `/management/partner_status_count/` | None | Backend-only |
| `/management/register-users-count/` | None | Backend-only |
| `/management/top-five-partners-bookings/` | None | Backend-only |
| `/management/top-five-partners-business/` | None | Backend-only |
| `/management/top-five-partners-complaints/` | None | Backend-only |
| `/management/top-five-partners-rating/` | None | Backend-only |
| `/management/top-five-partners-traveller/` | None | Backend-only |
| `/management/total-booking-with-traveller-and-finance/` | None | Backend-only |
| `/management/transfer_partner_receive_able_payments/` | Admin: `admin:utility/Super-Admin-Api.js` | Connected |
| `/management/travellers-with-each-airlines/` | None | Backend-only |

### chat
| Endpoint | Frontend module connections | Status |
| --- | --- | --- |
| `/chat/delete-all-messages/` | None | Backend-only |
| `/chat/get-messages/{param}/{param}/` | None | Backend-only |
| `/chat/partner-messages/{param}/` | None | Backend-only |
| `/chat/send-messages/` | None | Backend-only |
| `/chat/user-messages/{param}/` | None | Backend-only |

## Backend Endpoints With No Frontend Consumer
- `/api/v1/bookings/{param}/`
- `/api/v1/bookings/{param}/passports/`
- `/bookings/delete_payment_record/`
- `/bookings/manage_custom_package/`
- `/bookings/manage_user_check_in/`
- `/chat/delete-all-messages/`
- `/chat/get-messages/{param}/{param}/`
- `/chat/partner-messages/{param}/`
- `/chat/send-messages/`
- `/chat/user-messages/{param}/`
- `/common/get_user_all_transaction_history/`
- `/common/get_user_overall_transaction_summary/`
- `/common/manage_user_bank_account/`
- `/common/manage_user_withdraw_request/`
- `/common/send_otp_email/`
- `/common/user_subscribe/`
- `/common/verify_otp_email/`
- `/management/all-booking-status/`
- `/management/all-packages-status/`
- `/management/complaint-status-count/`
- `/management/count-of-bookings-with-their-prices/`
- `/management/distinct-complaints-counts/`
- `/management/manage_featured_package/`
- `/management/partner_status_count/`
- `/management/register-users-count/`
- `/management/top-five-partners-bookings/`
- `/management/top-five-partners-business/`
- `/management/top-five-partners-complaints/`
- `/management/top-five-partners-rating/`
- `/management/top-five-partners-traveller/`
- `/management/total-booking-with-traveller-and-finance/`
- `/management/travellers-with-each-airlines/`
- `/partner/get_city_wise_packages_count/`

## Frontend Endpoint Literals Missing Backend Route
| Endpoint Literal | Referencing Panels | Frontend Module Files |
| --- | --- | --- |
| `/management/apis/custom/manage/packages/` | Web | `web:api/apiService.js` |
| `/partner/change_transport_package_status/` | Admin | `admin:utility/Api.js` |
| `/partner/company_documents/` | Admin | `admin:pages/AccountSetup/CompanyForm/SubmitCompanyData.js` |
| `/partner/enroll_transport_package/` | Admin | `admin:utility/Api.js` |
| `/partner/get_transport_package_by_token/` | Admin | `admin:utility/Api.js` |
| `/partner/manage_partner_withdraw_request/F{param}/` | Admin | `admin:utility/Api.js` |
| `/partner/update_partner_avatar/` | Admin | `admin:utility/Api.js` |
| `/partner/update_transport_package_basic_detail/` | Admin | `admin:utility/Api.js` |
| `/partner/update_transport_package_photo/` | Admin | `admin:utility/Api.js` |
| `/partner/upload_hotel_photos/` | Admin | `admin:utility/Api.js` |

## Validation Notes and Open Risks
- Mapping is derived from backend URL declarations plus FE endpoint literals in source files.
- Dynamic segments were normalized to `{param}` for matching.
- FE literal scanning can include non-runtime strings; `/partner/company_documents/` is present in a commented admin file line.
- `docs/project-bot/config.json` still lists only `Huz-Web-Frontend` in `projectSurfaces`, while the validated scope includes backend, web, admin, and operator.
- Chat websocket coverage exists in `huz/asgi.py`, but `ASGI_APPLICATION` remains commented in `huz/settings.py`; websocket runtime status was not validated in this docs-only run.

## Recommended Follow-up
- Run `contract-sync` to reconcile the 10 FE-only endpoint literals or mark intentional deprecations.
- Update project-bot surface metadata so future runs include all active surfaces by default.
- Refresh this atlas immediately if `booking/api_urls.py`, `booking/views/api_v1.py`, or any app `urls.py` changes.
