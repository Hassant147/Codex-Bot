# Change Map

Every code-changing run should append what changed and which atlas docs were refreshed.

## Entries
### 2026-03-12 - Deep Scan Phase 0 atlas context refresh
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/project-bot/runs/20260312-174754-deep-scan/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Revalidated the live backend tree and route surface against the existing atlas during the deep-scan Phase 0 context refresh.
  - Added two previously undocumented but scan-relevant backend surfaces: the partner package seeding command and the shared booking traveller-count helper used by both workflow and services.
  - Confirmed the request remains scoped to dev-relevant backend sources and not the large checked-in `media/` or `static/` artifact trees.

### 2026-03-12 - System Atlas Phase 1 refresh
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/project-bot/runs/20260312-174754-system-atlas/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Replaced placeholder atlas stubs with a live Phase 1 map of the Django/DRF backend covering modules, route groups, auth boundaries, booking workflow state, admin surfaces, and current refactor seams.
  - Documented the current live working tree rather than historical HEAD because the target repository already contains in-progress refactors and deleted legacy modules.
  - Captured the main implementation constraints for downstream lanes: the duplicate package-management seam, unrouted admin views, mixed modern and legacy auth models, and management coverage gaps.

### 2026-03-12 - Security audit Phase 0 surface map
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `docs/atlas/SECURITY_THREAT_MAP.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/qa/BUG_BACKLOG.md`
  - `docs/project-bot/runs/20260312-174754-security-audit/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/SECURITY_THREAT_MAP.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Added a source-backed Phase 0 threat map covering trust zones, legacy token transport, public route groups, admin mutation surfaces, uploaded-document exposure, and secret/config boundaries.
  - Marked the highest-risk components for follow-on analysis: the auth bridge, legacy partner profile/account routes, partner booking operations, admin approval/payment flows, and shared utility/config code.
  - Recorded concrete Phase 0 backlog items for repo-tracked Firebase credentials, raw session-token transport, legacy partner finance/profile routes, and flag-controlled docs/media exposure.

### 2026-03-12 - Security audit Phase 1 risk analysis
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `docs/atlas/SECURITY_THREAT_MAP.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/qa/BUG_BACKLOG.md`
  - `docs/project-bot/runs/20260312-174754-security-audit/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/SECURITY_THREAT_MAP.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Added concrete exploit-backed findings showing that partner session tokens leak through anonymous website package payloads and that user/partner session tokens leak cross-role through booking serializers.
  - Documented that anonymous existence/profile endpoints serialize bearer-equivalent session tokens and Firebase device tokens, widening the token-disclosure surface beyond the route groups mapped in Phase 0.
  - Captured two concrete privilege-escalation mechanics for follow-on remediation: deterministic customer token generation from phone numbers and partner mutation endpoints that still trust request-supplied `partner_session_token` values.

### 2026-03-12 - Security audit Phase 2 written findings
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `docs/atlas/SECURITY_THREAT_MAP.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/qa/BUG_BACKLOG.md`
  - `docs/project-bot/runs/20260312-174754-security-audit/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/SECURITY_THREAT_MAP.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Consolidated the Phase 0 and Phase 1 evidence into explicit exploit chains, immediate containment actions, and a batch-ordered remediation plan for the security lane.
  - Recorded that the highest-risk fully internal attack path is anonymous token disclosure from website package responses followed by token-only partner finance operations.
  - Added a follow-on implementation order that separates credential containment, auth-boundary hardening, booking principal binding, and defense-in-depth verification.

### 2026-03-12 - Deep Scan Phase 3 verification and contract correction
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/qa/BUG_BACKLOG.md`
  - `docs/project-bot/runs/20260312-174754-deep-scan/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Revalidated the highest-priority deep-scan and linked security findings directly against the live source tree before closing the run.
  - Corrected the atlas to reflect that `/common/manage_user_account/` remains `IsAdminUser` for both create and delete in the current working tree.
  - Added two durable contract clarifications: `/api/v1/bookings/*` backfills `session_token` from authenticated user context for non-admin callers, and `booking/manage_partner_booking.py` is only partially migrated to auth-context-first partner resolution.

### 2026-03-12 - Backend optimize Phase 1 implementation
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `booking/services.py`
  - `booking/views/bookings.py`
  - `booking/manage_partner_booking.py`
  - `management/approval_task.py`
  - `booking/tests.py`
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/qa/BUG_BACKLOG.md`
  - `docs/project-bot/runs/20260312-174754-backend-optimize/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Current-user booking retrieve plus the payment/passport mutation responses now reload through a preloaded booking detail queryset before `DetailBookingSerializer` runs, reusing the partner-side detail loading pattern on the customer response path.
  - Partner booking statistics and rating summaries now come from filtered database aggregates instead of per-bucket `.count()` calls and Python-side star loops.
  - The admin payment-review queue now derives queue counts and total request metadata from one filtered aggregate summary, with focused verification passing under `.venv/bin/python manage.py test booking.tests.BookingWorkflowServiceValidationTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test`.

### 2026-03-12 - Backend optimize Phase 2 verification
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/qa/BUG_BACKLOG.md`
  - `docs/project-bot/runs/20260312-174754-backend-optimize/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Re-verified `OPT-P1-001` through `OPT-P1-003` with the project virtualenv focused suite: `.venv/bin/python manage.py test booking.tests.BookingWorkflowServiceValidationTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test` passed with 70 tests in 2.008s.
  - `python3 -m compileall booking management huz` also passed, so the optimized booking and admin modules still parse cleanly in the checked-out tree.
  - Promoted the implemented optimization backlog items from `fixed` to `verified`, kept `OPT-P1-004` open, and recorded that Phase 2 stayed documentation-only because the repository remains broadly dirty outside this lane.

### 2026-03-12 - Regression hunt Phase 1 fixes and verification
- Scope: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Files changed:
  - `booking/tests.py`
  - `management/approval_task.py`
  - `booking/workflow.py`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
  - `docs/qa/DEEP_SCAN_REPORT.md`
  - `docs/qa/BUG_BACKLOG.md`
  - `docs/project-bot/runs/20260312-174754-regression-hunt/RUN_SUMMARY.md`
- Atlas docs refreshed:
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Reproduced a verification-lane regression in the admin payment-review queue: the new bounded-query test first failed because `ApproveBookingPaymentViewTests` lost its direct-view auth helper, then exposed that `/management/fetch_all_paid_bookings/` had drifted back to 9 queries.
  - Restored the missing test harness setup in `booking/tests.py`, folded queue-specific total amounts into the existing review-summary aggregate in `management/approval_task.py`, and deferred operator-document reads in `booking/workflow.py` until fulfillment-state recalculation actually needs them so the queue path returns to the intended `<=7` query budget.
  - Re-ran the full focused Phase 1 suite successfully (`84` tests passed), `python3 -m compileall booking management huz common partners` passed, and route smoke checks confirmed the removed legacy `/bookings/*`, `/management/*`, `/partner/*`, and `/chat/` paths still resolve to `404`, leaving that compatibility risk as downstream coordination work rather than a same-lane backend-only fix.
