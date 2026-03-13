# Backend Blueprint

Document backend apps/modules, route groups, service rules/logic, schema ownership, and integration boundaries.

## Services and Rules
- Add app/service responsibilities and business rules.
- `Huz-Backend/booking/serializers.py` and `Huz-Backend/booking/workflow.py` remain the active owners of partner booking readiness, including the `operator_can_act` gate used by admin/operator pending-action UIs.
- Fix-backlog Batch 02 Phase 1 changed no backend code, routes, or schema; the admin frontend was aligned to these existing booking workflow rules instead.
