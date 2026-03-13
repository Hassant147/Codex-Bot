Implement Booking Contract Batch 04 only.

Campaign context:
- /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/BOOKING_CONTRACT_REMEDIATION_MASTER_REQUEST_2026-03-11.md

Target this bounded batch only:
- BOOKING-003: operator dashboard recent-bookings summary must be truthful
- BOOKING-010: operator booking search copy/behavior must match the real backend filter contract
- BOOKING-011: web support attachment/audio URLs must resolve against the API origin

Hard boundaries:
- Do not reopen the earlier admin pagination/state-ownership/completed-state batches in this run unless a blocker forces a directly adjacent fix.
- Keep the admin access-operator-profile module excluded.
- Prefer truthful UI/consumer fixes unless expanding the backend contract is clearly safer and verified end to end.

Required outcomes:
- Operator "Recent Bookings" no longer silently degrades into a misleading READY-only snapshot.
- Operator booking search either gains real traveler-name support end to end or the UI promise is corrected so it matches booking-number-only behavior.
- Web support complaint/request attachments and audio resolve against the API origin for split-origin deployments.
- Nearby support media helpers in the same contract surface are corrected if they share the same origin bug.

Verification minimum:
- `npm run build` or equivalent scoped verification for `Huz-Operator-Frontend`
- `npm run build` or equivalent scoped verification for `Huz-Web-Frontend`
- Backend verification only if the operator search contract or support media serialization changes

Docs:
- Update workspace backlog, deep scan, route/module docs, API surface if needed, and change map.
- If project-local booking docs materially change state because of this batch, update them too.
