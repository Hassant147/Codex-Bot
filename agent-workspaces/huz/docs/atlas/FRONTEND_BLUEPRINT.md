# Frontend Blueprint

Document frontend panels, pages, components, routes, protected routes, state management, and API consumers.

## Panels and Pages
- Add panel/page hierarchy and route ownership.
- `Huz-Admin-Frontend`
  - `src/App.js` now owns canonical partner booking detail/subflow routes at `/booking/:bookingNumber`, `/booking/:bookingNumber/upload-evisa`, `/booking/:bookingNumber/airline-tickets`, `/booking/:bookingNumber/transport-arrangement`, and `/booking/:bookingNumber/hotel-arrangement`.
  - `src/pages/Admin-Panel/Bookings/bookingRouteUtils.js` and `src/pages/Admin-Panel/Bookings/BookingDetailsPage/useAdminBookingLoader.js` are the new route/state ownership layer for admin booking detail loading.
  - `src/pages/Admin-Panel/Bookings/BookingDetailsPage/Pending.js` now mirrors backend `operator_can_act` before offering admin booking decisions.
- `Huz-Operator-Frontend`
  - Remains the reference panel for route-owned booking identity under `/booking-module/booking/:bookingNumber/*`; the admin panel now mirrors that ownership model with its own route namespace.
