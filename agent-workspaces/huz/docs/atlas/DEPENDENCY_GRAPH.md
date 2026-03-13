# Dependency Graph

Document critical module dependencies and cross-surface coupling.

## High-Risk Couplings
- Add risky dependency chains and ownership notes.
- `Huz-Admin-Frontend/src/App.js` -> `src/pages/Admin-Panel/Bookings/bookingRouteUtils.js` -> `BookingDetailsPage/useAdminBookingLoader.js` -> `src/context/BookingContext.js` -> `src/utility/Api.js#getBookingDetails`: admin booking detail/subflows now depend on route params as the selected-booking source of truth.
- `Huz-Admin-Frontend/src/pages/Admin-Panel/Bookings/BookingDetailsPage/Pending.js` -> `/bookings/get_booking_detail_by_booking_number/` (`operator_can_act`) -> `/bookings/partner_action_for_booking/`: admin decision affordances must stay aligned to the backend workflow fields exposed by the detail serializer.
