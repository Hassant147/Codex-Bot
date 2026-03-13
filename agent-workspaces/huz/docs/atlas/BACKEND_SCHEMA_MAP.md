# Backend Schema Map

Track data models/schemas and their relationship to endpoints and business rules.

| Schema/Model | Module | Related Endpoints | Key Constraints | Notes |
| --- | --- | --- | --- | --- |
| Booking workflow detail | `Huz-Backend/booking/models.py`, `booking/serializers.py`, `booking/workflow.py` | `/bookings/get_booking_detail_by_booking_number/`, `/bookings/partner_action_for_booking/` | `operator_can_act` is a derived workflow field, not a separate persisted schema column; partner actions remain bound to existing booking lifecycle rules | Batch 02 Phase 1 relied on this unchanged backend workflow contract while moving admin booking identity ownership to the frontend route layer. |
