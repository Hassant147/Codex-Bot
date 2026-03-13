Implement Booking Contract Batch 01 only.

Campaign context:
- /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/BOOKING_CONTRACT_REMEDIATION_MASTER_REQUEST_2026-03-11.md

Target this bounded batch only:
- BOOKING-004: admin booking list must consume backend pagination correctly
- BOOKING-007: admin complaints list must consume backend pagination correctly
- BOOKING-001: admin receivable payments views must consume the paginated payload correctly
- BOOKING-002: partner settlement review must stop losing payment proofs because of the hidden `payment_detail` refetch path

Hard boundaries:
- Do not implement later workflow-state or reported-traveler batches in this run unless a blocker forces a directly adjacent fix.
- Keep the admin access-operator-profile module excluded.
- Preserve backend contract stability unless changing the backend is the safest way to fix settlement proof visibility.

Required outcomes:
- Admin booking list is page-aware and does not search/paginate only inside one fetched page.
- Admin complaints list is page-aware and no longer consumes only `results` from a single page.
- Admin receivable wallet views normalize the paginated response shape before array operations.
- Partner settlement review displays real payment proofs for eligible bookings and no longer relies on a detail contract that hides `payment_detail`.

Verification minimum:
- Build or equivalent scoped verification for `Huz-Admin-Frontend`
- Backend verification for touched booking/management endpoints
- If the settlement fix changes a contract or serializer, verify the related approval page still shows package/booking/company/payment sections correctly

Docs:
- Update workspace backlog, deep scan, API surface, routes/module docs if touched, and change map.
- If project-local booking docs materially change state because of this batch, update them too.
