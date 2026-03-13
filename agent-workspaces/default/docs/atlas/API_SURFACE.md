# API Surface

Track endpoints, service modules, request/response contracts, and important integration notes here.

## APIs
- Last refreshed: 2026-03-05 (Phase 3 - Verify and Summarize, run `20260305-152546-deep-scan`)

## Base Config
- Base URL source: `process.env.REACT_APP_API_BASE_URL` (`src/services/api/httpClient.js`).
- Static auth header source: `process.env.REACT_APP_AUTH_TOKEN`.
- Current `.env` in target project:
  - `REACT_APP_API_BASE_URL=http://127.0.0.1:8000`
  - `REACT_APP_AUTH_TOKEN=Basic ...`

## HTTP Client Modules
| Client | Module | Auth Behavior |
| --- | --- | --- |
| `publicClient` | `src/services/api/httpClient.js` | No token interceptor |
| `authHeaderClient` | `src/services/api/httpClient.js` | Adds static `Authorization` from env token |
| `httpClient` | `src/services/api/httpClient.js` | Uses `accessToken`/`refreshToken`, auto-refreshes via `/api/token/refresh/` |
| `legacyHttpClient` | `src/services/api/httpClient.js` | Uses `access_token`/`refresh_token` legacy cookie keys |

## Auth and Profile Endpoints
Source modules: `src/api/AuthApi.js`, `src/api/UserAuthApis.js`

- `/auth/api/user-login-with-email/`
- `/auth/apis/user-login-with-email/` (legacy login path still used by `UserAuthApis`)
- `/auth/api/is-phone-number-exist/`
- `/auth/api/is-email-exist/`
- `/auth/api/otp-request/`
- `/auth/api/otp-validate/`
- `/auth/api/sign-up-with-phone/`
- `/auth/api/resend-verification-email/`
- `/auth/api/get-user-profile/`
- `/auth/api/user-logout/`
- `/auth/api/verify-email/?token=...`
- `/user/profile/address/create/`
- `/user/profile/address/get-all/`
- `/api/token/refresh/`

## Package Discovery Endpoints
Source modules: `src/api/homepageApi.js`, `src/api/listingApi.js`, `src/api/apiService.js`

### Active modern discovery paths (homepage/listing hooks)
- `/partner/get_featured_packages/`
- `/partner/get_package_short_detail_for_web/`
- `/partner/get_package_detail_by_city_and_date/`

### Legacy discovery paths still exported from `apiService`
- `/partner/apis/packages/client/all/get/?`
- `/partner/apis/packages/client/search/date-and-city/?`
- `/partner/apis/packages/client/get-package-detail/?`

## Booking and Traveler Endpoints
Source module: `src/api/apiService.js`

- `/booking/new/create/`
- `/booking/all/get/`
- `/booking/booking-number/get-detail/?booking_number=...`
- `/booking/booking-number/traveler/update/`
- `/booking/booking-number/traveler/passport-or-photo/update/`
- `/bookings/manage_user_passport_photo/`
- `/booking/booking-number/payment/create/`
- `/booking/booking-number/payment/receipt/create/`
- `/booking/booking-number/objection/response/`
- `/bookings/objection_response_by_user/`
- `/booking/booking-number/rating-and-review/create/`
- `/booking/booking-number/delete/`

### Booking List Client Contract Caveat (Phase 3 verification)
- `apiGet` returns normalized objects (`{ success: boolean, data?, error? }`) and does not throw for HTTP failures.
- `fetchBookingsByUser` currently returns `response?.data` after calling `apiGet("/booking/all/get/")`.
- When `/booking/all/get/` fails, `fetchBookingsByUser` can resolve `undefined` instead of throwing, while downstream consumers (`useBookingStatusData`, `useTravelersInfoLogic`) are structured around thrown-error handling.

## Complaints and Concierge Endpoints
Source module: `src/api/apiService.js`

- `/booking/complaint/create/`
- `/booking/complaint/users/all/get/`
- `/booking/booking-number/concierge-request/create/`
- `/booking/concierge-request/all/get/`

## Account, Wallet, and Custom Package Endpoints
Source module: `src/api/apiService.js`

- `/common/update_user_gender/`
- `/auth/api/user-subscribe/`
- `/auth/api/update-user-name/`
- `/auth/api/update-user-phone-number/`
- `/wallet/apis/bank/create/`
- `/wallet/apis/withdraw/create/`
- `/wallet/apis/transaction/get/all/`
- `/management/apis/custom/manage/packages/` (GET/POST/PUT)

## Contract and Integration Notes
- `src/api/apiService.js` remains a mixed-domain file and is a high-priority contract-drift surface.
- Auth flows are split between modern (`AuthApi`) and legacy (`UserAuthApis`) wrappers; both modern and legacy token profiles remain active.
- Partner package APIs are also split across modern (`/partner/get_*`) and legacy (`/partner/apis/*`) endpoint families.
- `AuthContextProvider` depends on app-token refresh path (`/api/token/refresh/`) and profile hydration (`/auth/api/get-user-profile/`) for route access decisions.
- OTP verification stores `authToken` in cookies (`src/pages/Otp/Otp.js`) while main transport/logout logic uses `accessToken` and `refreshToken` (`src/services/api/httpClient.js`, `src/components/Header/Header.js`), leaving token lifecycle ownership split.
- Commented legacy endpoints (example: `bookings/pay_booking_amount_by_transaction_photo`) still exist in source comments and should be treated as non-active unless explicitly reintroduced.
