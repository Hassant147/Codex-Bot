# File Map (Dev Only)

Inventory development-relevant files and folders while excluding configured non-dev paths.

## Ignore Policy
- Record ignore patterns used in this run.

## Inventory
- Group by surface -> module -> file patterns.
- `Huz-Admin-Frontend/src/App.js`: admin booking detail route registry now includes `/booking/:bookingNumber` and route-param fulfillment subflows, with legacy `/bookingdetails` and `/package/*` redirects preserved.
- `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/bookingRouteUtils.js`: admin-only route helpers for parsing `booking_number` query fallback and building canonical booking detail/subflow paths.
- `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/useAdminBookingLoader.js`: shared admin booking loader hook that resolves route params and fetches booking detail through context.
- `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Pending.js`: admin pending-action UI now uses backend `operator_can_act` as the hard UI gate.
- `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails.js`, `Active.js`, and `ActiveSatusComponents/*/{UploadEvisa,AirlineTickets,TransportArrangement,HotelArrangement}.jsx`: admin booking detail/subflow pages now read booking identity from the route instead of `localStorage`.
- `Huz-Admin-Frontend/src/context/BookingContext.js`: selected booking context remains in-memory only for the admin booking flow; the phase removed local storage persistence for selected booking identity.
