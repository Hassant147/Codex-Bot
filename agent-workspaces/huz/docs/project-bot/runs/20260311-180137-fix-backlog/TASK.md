Implement Booking Contract Batch 02 only.

Campaign context:
- /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/BOOKING_CONTRACT_REMEDIATION_MASTER_REQUEST_2026-03-11.md

Target this bounded batch only:
- BOOKING-005: admin pending booking action must honor backend `operator_can_act`
- BOOKING-006: admin booking fulfillment subflows must stop using global `localStorage("bookingNumber")` as the source of truth

Hard boundaries:
- Do not implement later completed-state, reported-traveler, operator dashboard/search, or web support-origin batches in this run unless a blocker forces a directly adjacent fix.
- Keep the admin access-operator-profile module excluded.
- Prefer route-owned identity and component state over hidden storage coupling.

Required outcomes:
- Admin pending booking actions are gated by `operator_can_act` before action controls are shown or enabled.
- Admin booking fulfillment routes/subflows carry booking identity through route params or parent-owned state instead of shared global `localStorage`.
- Any stale `bookingNumber` storage reads/writes in the fixed admin booking flow are removed or reduced so they cannot target the wrong booking across tabs or reloads.
- Backend/frontend behavior stays aligned with the existing stricter booking workflow contract.

Verification minimum:
- `npm run build` or equivalent scoped verification for `Huz-Admin-Frontend`
- Backend verification for any touched booking workflow surfaces
- If route wiring changes, verify the admin booking detail subflows still load booking, visa, airline, transport, and hotel sections correctly

Docs:
- Update workspace backlog, deep scan, state/route docs, and change map.
- If project-local booking docs materially change state because of this batch, update them too.
