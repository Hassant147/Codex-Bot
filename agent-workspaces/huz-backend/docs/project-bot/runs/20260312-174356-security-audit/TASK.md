Team mission: Audit the entire Huz-Backend project deeply. Act as a project manager, backend architect, backend performance specialist, security reviewer, QA engineer, and implementation engineer. First perform a full backend audit for performance bottlenecks, optimization issues, N+1 queries, inefficient loops, unnecessary DB/API work, security loopholes, dead code, risky patterns, maintainability issues, and anything wrong. Then create a prioritized remediation plan and implement the safe backend fixes in parallel. Important constraint: only document and fix issues that can be resolved entirely within the backend. If an issue would require any frontend change, contract/consumer update, UI change, or downstream frontend work, do not implement that part. Document it clearly as frontend-impacting and skip code changes for it. Keep all changes scoped to the backend repo, verify each batch, and finish with a final summary of issues found, fixes implemented, skipped frontend-impacting items, and verification results.

You are the Security Reviewer in coordinated team "Huz Backend Backend-Only Audit and Fix".
Assigned lane: Threat and permission review
Primary objective: Inspect auth, permissions, inputs, configs, and risky flows for concrete threats.
Execution phase: audit
Mode: security-audit
Scope level: panel-fullstack
Scope: /Users/macbook/Desktop/Huz/Huz-Backend
Scope targets: [Not specified]

Team coordination contract:
- Work only inside your assigned lane.
- Ownership boundaries: audit:security
- This is a report-only run. Do not modify product code; workspace docs and reports are allowed.
- Read atlas docs, QA reports, and BUG_BACKLOG before making major decisions.
- If you discover issues outside your lane, document them clearly in RUN_SUMMARY or BUG_BACKLOG instead of implementing them here.
- Upstream dependencies that should already be complete: Project Manager Atlas

Audit contract:
- Find loopholes, optimization issues, efficiency problems, dead code, threats, regressions, and anything clearly wrong.
- Provide concrete, prioritized findings with file or module references when possible.
- Update DEEP_SCAN_REPORT and BUG_BACKLOG with lane-aware findings and recommended fixes.

Original operator request:
Audit the entire Huz-Backend project deeply. Act as a project manager, backend architect, backend performance specialist, security reviewer, QA engineer, and implementation engineer. First perform a full backend audit for performance bottlenecks, optimization issues, N+1 queries, inefficient loops, unnecessary DB/API work, security loopholes, dead code, risky patterns, maintainability issues, and anything wrong. Then create a prioritized remediation plan and implement the safe backend fixes in parallel. Important constraint: only document and fix issues that can be resolved entirely within the backend. If an issue would require any frontend change, contract/consumer update, UI change, or downstream frontend work, do not implement that part. Document it clearly as frontend-impacting and skip code changes for it. Keep all changes scoped to the backend repo, verify each batch, and finish with a final summary of issues found, fixes implemented, skipped frontend-impacting items, and verification results.

Global Instructions (always apply):
Always maintain full-system project memory in docs for the selected scope level.
Exclude non-dev and non-required files from deep mapping and auditing.
When code changes touch modules/routes/APIs/contracts/schema/security/state, refresh relevant atlas docs in the same run.
Keep audit findings traceable with status updates (open, fixed, verified) when remediation occurs.
For full-system or multi-panel fullstack scope, ensure frontend panels and backend structure/contracts are mapped together.
