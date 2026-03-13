# System Blueprint

Map the full system architecture across all configured surfaces.

## Surfaces
- `Huz-Web-Frontend`: customer-facing React SPA with route entry `Huz-Web-Frontend/src/routes/AppRoutes.jsx`. Booking scope covers booking creation, traveler/payment follow-up, booking status, remaining payment, help, and objection-response routes.
- `Huz-Admin-Frontend`: combined partner and super-admin React SPA with route entry `Huz-Admin-Frontend/src/App.js`. Booking scope covers partner dashboards/bookings/complaints/reviews/receivables plus super-admin approve-amount queues.
- `Huz-Operator-Frontend`: operator React SPA with route entries `Huz-Operator-Frontend/src/routes/index.jsx` and `src/pages/Dashboard/DashboardRoutes.jsx`. Booking scope covers dashboard summaries, booking-module detail/subflows, complaints, reviews, and receivable widgets.
- `Huz-Backend`: Django monolith with root router `Huz-Backend/huz/urls.py`. Booking scope spans `booking.api_urls`, `booking.urls`, `common.api_urls`, and `management.urls`.

## Runtime Topology
- Customer web flows authenticate user sessions and call canonical `/api/v1/bookings/*`, `/api/v1/users/me/bookings/`, `/api/v1/users/me/complaints/`, `/api/v1/users/me/requests/`, and related profile/wallet routes.
- Operator and admin partner panels authenticate with `partner_session_token` and still call legacy `/bookings/*` endpoints for list/detail/action/document/report flows.
- Admin partner booking detail now owns selected booking identity in the frontend route (`/booking/:bookingNumber/...`) instead of sharing it through `localStorage`; this phase changed the frontend topology only and left backend booking routes untouched.
- Super-admin approval pages call `/management/*` endpoints for paid booking review and partner receivable transfer while still pulling booking detail through `/bookings/get_booking_detail_by_booking_number/`.
- Booking status, issue status, payment approval, complaint/review counts, and receivable summaries are shared cross-surface state, so backend workflow changes can surface in customer, operator, admin, and management views simultaneously.
