Implement Booking Contract Batch 03 only.

Campaign context:
- /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/BOOKING_CONTRACT_REMEDIATION_MASTER_REQUEST_2026-03-11.md

Target this bounded batch only:
- BOOKING-008: completed-state edit/update entrypoints must align with backend fulfillment rules
- BOOKING-009: admin booking detail must surface reported-traveler state for `issue_status=REPORTED`

Hard boundaries:
- Do not implement operator dashboard/search truthfulness or web support-origin fixes in this run unless a blocker forces a directly adjacent fix.
- Keep the admin access-operator-profile module excluded.
- If completed-state mutation remains possible through delete/document side paths, close that gap in this same batch.

Required outcomes:
- Admin and operator completed-booking screens no longer advertise or route into illegal create/update mutations when backend rules reject those actions.
- Any completed-state delete/document mutation path that bypasses the intended workflow guard is removed or status-gated.
- Admin booking detail surfaces reported-traveler context when `issue_status=REPORTED` and keeps that flow aligned with the backend and operator detail behavior.
- Admin/operator workflow screens stay consistent with backend `booking_status` and `issue_status` semantics.

Verification minimum:
- `npm run build` or equivalent scoped verification for `Huz-Admin-Frontend`
- `npm run build` or equivalent scoped verification for `Huz-Operator-Frontend`
- Backend verification for touched booking workflow endpoints and guards

Docs:
- Update workspace backlog, deep scan, route/module docs, API surface if needed, and change map.
- If project-local booking docs materially change state because of this batch, update them too.
