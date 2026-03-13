# Security Threat Map

Track auth boundaries, trust zones, sensitive flows, and prioritized threat findings.

| Surface | Threat Area | Risk | Mitigation Status | Notes |
| --- | --- | --- | --- | --- |
| `Huz-Admin-Frontend` booking detail/subflows | Cross-tab booking mis-targeting and invalid workflow affordances | High | Phase 1 implemented, Phase 2 verification pending | Batch 02 removed the shared `localStorage("bookingNumber")` handoff from admin booking fulfillment routes and now hides pending decision controls when backend `operator_can_act` is false. |
