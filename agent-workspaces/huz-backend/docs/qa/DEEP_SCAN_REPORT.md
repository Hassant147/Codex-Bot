# Deep Scan Report

Use this report for on-demand deep analysis of logic, structures, routes, contracts, and mismatch risks.

## Findings
### 2026-03-12 Deep Scan Phase 0 Refresh Atlas Context
- Read the run config, operator profile, task prompt, existing atlas docs, current deep scan report, and bug backlog before validating source files.
- Revalidated the live scan scope against the working tree: the audit remains centered on dev-relevant sources under `huz/`, `common/`, `partners/`, `booking/`, and `management/`, plus root bootstrap files like `manage.py`, `requirements.txt`, and `README.md`; large `media/`, `static/`, `.venv/`, and migration artifacts remain out of primary audit scope unless a later finding points back to them.
- Cross-checked the current atlas against `git status --short`, `huz/urls.py`, app `urls.py` and `api_urls.py` files, `huz/settings.py`, `common/authentication.py`, `common/permissions.py`, `booking/views/bookings.py`, `booking/views/api_v1.py`, `booking/views/support.py`, `booking/flow_utils.py`, and `partners/management/commands/seed_huz_packages.py`.
- Confirmed the previously documented route groups, auth split, dirty-tree warning, unmounted management views, and package-management routing seam still match the live tree.
- Found two atlas omissions that were small but relevant for later scan phases: `partners/management/commands/seed_huz_packages.py` is a live management-command entrypoint for realistic package fixture generation, and `booking/flow_utils.py` is the shared traveller-count helper reused by both `booking/workflow.py` and `booking/services.py`.
- Refreshed `PROJECT_BLUEPRINT.md`, `MODULE_MAP.md`, and `ROUTES_AND_ENTRYPOINTS.md` so downstream audit phases inherit the corrected context without needing another repo-wide inventory pass.
- Verification in this phase was source-based only. No product code was modified.

### 2026-03-12 Phase 0 Inventory Scope
- Scope inventoried: `/Users/macbook/Desktop/Huz/Huz-Backend` for the `system-atlas` run. This phase was report-only and did not modify product code.
- Runtime shape: Django 5 + DRF project rooted in `huz/`, with installed apps `common`, `partners`, `management`, and `booking`; `huz/settings_test.py` swaps the default MySQL database for SQLite during non-interactive test runs.
- Route surface snapshot: `huz/urls.py` mounts newer `/api/v1/` user/customer routes from `common/api_urls.py` and `booking/api_urls.py`, plus legacy or back-office groups at `/common/`, `/partner/`, `/bookings/`, and `/management/`.
- Route density evidence from direct source inspection: `common/urls.py` exposes 6 legacy endpoints, `common/api_urls.py` exposes 5 current-user endpoints, `partners/urls.py` exposes 36 partner/package/account endpoints, `booking/urls.py` exposes 18 partner-booking endpoints, `booking/api_urls.py` exposes a booking resource plus custom booking actions, and `management/urls.py` exposes 8 admin endpoints.
- Domain ownership boundary: `common` owns user identity, OTP, wallets, address state, notification records, auth bridge helpers, and outbound SMS/email/Firebase utilities.
- Domain ownership boundary: `partners` owns partner identity, company and individual profiles, package catalog models, hotel catalog edges, partner wallet and withdrawal state, and website package read endpoints.
- Domain ownership boundary: `booking` owns booking lifecycle state, capacity checks, payment submission, traveller passport/document state, complaints/requests, partner-facing booking fulfillment, and payout records.
- Domain ownership boundary: `management` owns admin approvals, payment review decisions, master hotel catalog management, and partner receivable release.
- High-risk files for downstream work: `booking/manage_partner_booking.py` (~1800 LOC), `booking/services.py` (~1000 LOC), `partners/package_management_operator.py` (~1700 LOC), `partners/package_management.py` (~1700 LOC), `partners/partner_profile.py` (~1300 LOC), and `management/approval_task.py` (~1500 LOC).
- High-risk flows for downstream work: partner onboarding and company approval, package creation and publication, user booking creation with capacity locks, payment review and rejection/approval state changes, partner document fulfillment, complaint/objection handling, and partner receivable transfer to wallets.
- Structural ambiguity: the workspace atlas docs are still placeholder stubs and currently do not describe the live module map, route groups, or API contracts for this repository.
- Structural ambiguity: `partners/package_management.py` still contains legacy operator package views, but the routed operator package endpoints now flow through `partners/package_management_operator.py` via `partners/views/operator_packages.py`; this creates a duplicate-implementation seam that Phase 1 should document explicitly.
- Structural ambiguity: `management/approval_task.py` defines `GetAllApprovedCompaniesView` and `ManageFeaturedPackageView`, but `management/urls.py` does not route them.
- Security-sensitive boundary for later audit phases: many legacy partner and partner-wallet endpoints use `AllowAny` or token-in-payload/query compatibility, while the newer `/api/v1/` surface uses the auth bridge in `common/authentication.py`.
- Testing boundary: `common/tests.py`, `partners/tests.py`, and `booking/tests.py` cover the modernized user, partner, and booking paths, but `management/` has no dedicated test module.
- Recommended safe implementation lanes: shared auth/platform (`common/authentication.py`, `common/auth_utils.py`, `common/permissions.py`, `common/user_profile.py`, `common/utility.py`); partner lifecycle and package catalog (`partners/partner_profile.py`, `partners/package_management_operator.py`, website reads in `partners/package_management.py`); customer booking workflow (`booking/views/*`, `booking/services.py`, `booking/querysets.py`, `booking/workflow.py`); partner booking operations (`booking/manage_partner_booking.py`); admin approvals and payouts (`management/approval_task.py`).

### 2026-03-12 Phase 1 Refresh Atlas Docs
- Replaced the placeholder atlas stubs with a live map of the backend architecture in `PROJECT_BLUEPRINT.md`, `MODULE_MAP.md`, `ROUTES_AND_ENTRYPOINTS.md`, and `API_SURFACE.md`.
- Captured the production runtime shape from `huz/settings.py`: MySQL by default, optional Swagger/Redoc/static serving flags, custom session-token authentication bridge, `WhiteNoise`, and shared CORS configuration.
- Documented the current preferred auth path: Bearer/Token session headers resolved through `common/authentication.py`, with legacy query/payload token fallback still active and marked by `X-Auth-Deprecated`.
- Mapped the key data aggregates and ownership boundaries: `UserProfile` and customer wallet state in `common`, `PartnerProfile` and `HuzBasicDetail` package roots in `partners`, `Booking` and staged payment/passport/support state in `booking`, and admin approval/payout flows in `management`.
- Recorded the main lifecycle engine for later audit phases: `booking/workflow.py` derives the booking status machine; `booking/querysets.py` annotates the same rules into list views; `booking/management/commands/process_booking_timers.py` is the operational reconciler for expiry and post-travel completion.
- Documented the main refactor seam that downstream code lanes must treat carefully: routed operator package endpoints now flow through `partners/package_management_operator.py`, while public website package reads still depend on `partners/package_management.py`, which still contains overlapping legacy operator logic.
- Confirmed a second structural seam: `management/approval_task.py` contains `GetAllApprovedCompaniesView` and `ManageFeaturedPackageView`, but `management/urls.py` does not currently mount them.
- Captured an operational constraint for later audit work: the target repository is already in a dirty working tree with significant in-progress refactors and deleted legacy files, so future audit or implementation batches should treat the current checked-out tree as the source of truth and avoid assuming clean-commit history.
- Verification for this phase was source-based only: the refreshed atlas was cross-checked against `huz/urls.py`, each app `urls.py` and `api_urls.py`, core model files, booking workflow/service/query modules, partner package modules, and the existing test modules. No product code was edited.

### 2026-03-12 Phase 2 Validate Atlas Coverage
- Reopened the highest-risk files named by the atlas and confirmed their documented responsibilities still match the live working tree: `booking/manage_partner_booking.py`, `booking/services.py`, `partners/package_management_operator.py`, `partners/package_management.py`, `partners/partner_profile.py`, and `management/approval_task.py`.
- Re-verified the root route surfaces from source: `huz/urls.py` still mounts `/api/v1/`, `/common/`, `/partner/`, `/bookings/`, `/management/`, and `/admin/`, with Swagger/Redoc and Django-served media/static still gated by `ENABLE_API_DOCS` and `SERVE_MEDIA_AND_STATIC_FROM_DJANGO`.
- Confirmed the auth split described in the atlas is still accurate: `SessionTokenHeaderAuthentication` accepts `Bearer` and `Token` headers, `LegacySessionTokenAuthentication` still resolves `session_token` and `partner_session_token` from query params or payloads, and `LegacyAuthDeprecationHeaderMiddleware` still emits `X-Auth-Deprecated` when fallback auth is used.
- Confirmed the operator package routing seam is still real: `partners/urls.py` points operator package endpoints through `partners/views/operator_packages.py`, which only re-exports classes from `partners/package_management_operator.py`, while public website package reads still come from `partners/package_management.py`.
- Confirmed the booking workflow contract described in the atlas is still live: `booking/services.get_booking_by_identifier_for_user()` resolves both booking number and UUID, `booking/workflow.py` still derives the client and operator workflow stages, and `booking/serializers.py` still exposes the workflow-derived response fields documented in `API_SURFACE.md`.
- Confirmed the management atlas notes still match source: `management/approval_task.py` still owns the routed admin task surface plus the unmounted `GetAllApprovedCompaniesView` and `ManageFeaturedPackageView`, and the master-hotel catalog still uses the synthetic provider/package tokens with 30-second cache keys.
- Confirmed the repo-state assumptions in the atlas remain necessary: `git status --short` shows a dirty tree with live-file modifications plus deleted legacy files such as `chat/*`, `booking/manage_bookings.py`, `common/views.py`, and `management/tests.py`, so the atlas should continue to be treated as a map of the checked-out tree rather than repository history.
- Remaining blind spots after validation:
  - Atlas coverage is intentionally scoped to the live tree and dev-relevant sources; it does not attempt to map deleted legacy modules or the large `media/` artifact set.
  - The management domain is still the least verified runtime area because there is no live `management/tests.py` module.
  - Runtime verification is partially blocked in the current shell because Django is not installed; a targeted `manage.py test` attempt failed before test discovery.
- Next recommended atlas refresh targets:
  - Refresh the atlas again if route mounts or auth plumbing change in `huz/urls.py`, `common/authentication.py`, `common/permissions.py`, or `common/middleware.py`.
  - Refresh immediately if the package seam changes again across `partners/urls.py`, `partners/views/operator_packages.py`, `partners/package_management_operator.py`, or `partners/package_management.py`.
  - Refresh after any substantial audit/fix batch touching `booking/manage_partner_booking.py`, `booking/services.py`, or `management/approval_task.py`, because those files currently carry the highest coupling and churn risk.
  - Refresh if dedicated management tests are added back or if currently deleted legacy modules are restored, because both would expand the live system surface.

### 2026-03-12 Deep Scan Phase 1 Analyze Code Paths
- Traced the highest-risk backend paths end to end from source: partner identity/account self-service in `partners/partner_profile.py` and `partners/partner_accounts_and_transactions.py`, customer booking create/payment/passport flows in `booking/views/bookings.py`, `booking/views/api_v1.py`, and `booking/services.py`, operator fulfillment in `booking/manage_partner_booking.py`, package routing seams in `partners/urls.py` plus `partners/views/operator_packages.py`, and admin payment/payout flows in `management/approval_task.py`.
- Commands used to verify findings:
  - `rg -n "AllowAny|permission_classes = \\[AllowAny\\]" /Users/macbook/Desktop/Huz/Huz-Backend/partners/partner_profile.py /Users/macbook/Desktop/Huz/Huz-Backend/partners/partner_accounts_and_transactions.py`
  - `rg -n "PartnerProfile.objects.filter\\(partner_session_token|resolve_authenticated_partner_profile\\(|extract_partner_session_token\\(|permission_classes = \\[IsAdminOrPartnerSessionToken\\]" /Users/macbook/Desktop/Huz/Huz-Backend/booking/manage_partner_booking.py /Users/macbook/Desktop/Huz/Huz-Backend/partners/partner_accounts_and_transactions.py /Users/macbook/Desktop/Huz/Huz-Backend/partners/partner_profile.py`
  - `rg -n "get_or_create\\(status_for_booking|status_for_booking = models.ForeignKey|document_statuses\\[0\\]|payment_for_booking = models.ForeignKey|PartnersBookingPayment.objects.filter\\(payment_for_booking" /Users/macbook/Desktop/Huz/Huz-Backend/booking/models.py /Users/macbook/Desktop/Huz/Huz-Backend/booking/services.py /Users/macbook/Desktop/Huz/Huz-Backend/booking/workflow.py /Users/macbook/Desktop/Huz/Huz-Backend/booking/manage_partner_booking.py`
  - `rg -n "ManageFeaturedPackageView|GetAllApprovedCompaniesView" /Users/macbook/Desktop/Huz/Huz-Backend/management/approval_task.py /Users/macbook/Desktop/Huz/Huz-Backend/management/urls.py`
  - `python3 manage.py test partners.tests booking.tests common.tests --settings=huz.settings_test` from `/Users/macbook/Desktop/Huz/Huz-Backend` failed before discovery because `django` is not installed in the current shell.
- Finding 1, critical auth exposure: the legacy partner profile and account surfaces still use `AllowAny` and trust a raw `partner_session_token` from query/body for object resolution. `GetPartnerProfileView`, OTP resend/verify, service/profile/address/password updates, bank-account CRUD, and partner withdrawal/history routes all accept that token directly (`partners/partner_profile.py:334-1295`, `partners/partner_accounts_and_transactions.py:15-344`). The same serializer returned by login and public profile reads still exposes `partner_session_token`, `firebase_token`, and `web_firebase_token` (`partners/serializers.py:214-229`), so any leaked token becomes a reusable bearer credential across write paths.
- Finding 2, high auth/tenant-boundary drift: several partner booking endpoints are protected by `IsAdminOrPartnerSessionToken`, but after permission passes they re-query `PartnerProfile` from the request payload instead of using the authenticated principal. Mutation routes such as `TakeActionView`, document upload/delete, airline detail creation, hotel/transport detail creation, complaint updates, close-booking, and report-booking all do raw `PartnerProfile.objects.filter(partner_session_token=...)` lookups (`booking/manage_partner_booking.py:394-643`, `booking/manage_partner_booking.py:646-940`, `booking/manage_partner_booking.py:1378-1774`). That means an authenticated partner request can be rebound to another partner record whenever a foreign token is supplied.
- Finding 3, high state-integrity risk: booking document completion and payout bookkeeping assume exactly one status/payout row per booking, but the schema does not enforce that. `DocumentsStatus.status_for_booking` and `PartnersBookingPayment.payment_for_booking` are plain `ForeignKey`s (`booking/models.py:172-181`, `booking/models.py:266-279`), multiple code paths call `get_or_create(status_for_booking=...)` (`booking/services.py:734-766`, `booking/manage_partner_booking.py:556`, `booking/manage_partner_booking.py:711`, `booking/manage_partner_booking.py:891`), and the workflow only inspects the first status row (`booking/workflow.py:215-225`). The delete-document path then removes files without clearing any completion flags or resyncing payout readiness (`booking/manage_partner_booking.py:583-640`), so stale ready-for-travel state and duplicate receivable rows are both plausible.
- Finding 4, high wallet-race risk: both customer and partner withdrawal flows read wallet balance before entering the transaction and never lock the wallet row. The customer path uses `Wallet.objects.filter(...).first()` before `transaction.atomic()` and then subtracts from the in-memory balance (`common/api_v1.py:218-256`); the partner path follows the same pattern (`partners/partner_accounts_and_transactions.py:235-264`). Concurrent requests can therefore pass the same balance check and overdraw or overwrite each other.
- Finding 5, medium dead-path drift: `GetAllApprovedCompaniesView` and `ManageFeaturedPackageView` are still implemented in `management/approval_task.py` (`management/approval_task.py:907-990`, `management/approval_task.py:1282-1333`) but are absent from `management/urls.py:6-15`. Separately, `partners/package_management.py` still carries legacy operator package classes while the routed operator endpoints now point at `partners/package_management_operator.py` through `partners/views/operator_packages.py` (`partners/urls.py:32-48`). Those unmapped or duplicate paths are current maintenance hazards because behavior can drift without any live route exercising them.
- Remaining blind spots after this phase:
  - Runtime verification is still blocked in this shell because Django is unavailable, so the evidence for this phase is source-based rather than executable.
  - The `management` module still has no live test file in the working tree (`rg --files /Users/macbook/Desktop/Huz/Huz-Backend/management` returns only `urls.py`, `approval_task.py`, `apps.py`, and `__init__.py`), so the admin approval/payout lane remains the weakest-tested area.

### 2026-03-12 Security Audit Phase 0 Map Security Surface
- Phase scope and method: read the run contract plus the existing atlas/QA docs, then inspected `huz/settings.py`, `huz/urls.py`, `common/authentication.py`, `common/permissions.py`, `common/middleware.py`, `common/user_profile.py`, `common/utility.py`, `partners/partner_profile.py`, `partners/partner_accounts_and_transactions.py`, `partners/package_management_operator.py`, `partners/package_management.py`, `booking/views/bookings.py`, `booking/views/api_v1.py`, `booking/manage_partner_booking.py`, `management/approval_task.py`, and the supporting model/test files.
- Trust-zone map:
  - Public or anonymous surface: website package discovery/detail/search endpoints under `/partner/`, partner login/reset/registration endpoints, optional Swagger/ReDoc, and optional Django-served `/media/*` and `/static/*`.
  - Customer-authenticated surface: `/api/v1/users/me/*` and `/api/v1/bookings/*`, backed by `UserProfile` session tokens.
  - Partner-authenticated surface: modern operator package routes under `/partner/*` and partner booking routes under `/bookings/*`, backed by `PartnerProfile` session tokens.
  - Admin-authenticated surface: `/management/*` and `/admin/`, where staff users choose target tenants through customer or partner session-token fields in request bodies.
- Auth-boundary evidence from source:
  - `REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"]` enables both header auth and `LegacySessionTokenAuthentication`, so even the modern `/api/v1/` surface can still authenticate from raw `session_token` or `partner_session_token` values supplied in query params or request bodies.
  - `common/middleware.LegacyAuthDeprecationHeaderMiddleware` only marks legacy-token usage with `X-Auth-Deprecated`; it does not block the legacy transport.
  - `partners/tests.py`, `common/tests.py`, and `booking/tests.py` confirm Bearer-header support and the feature-flagged docs/static route behavior, but the legacy partner profile/account flows remain source-inspection surfaces because they are not protected by the newer permission classes.
- Sensitive-input and storage map:
  - Customer and partner identity tokens, OTPs, password-reset tokens, Firebase device tokens, bank-account details, wallet withdrawals, payment proofs, passports, complaint/request attachments, company logos and license files, booking documents, and payout records all pass through this backend.
  - Uploaded files are stored with `FileSystemStorage` under the repo-local `MEDIA_ROOT` and include passports, payment proofs, booking documents, partner company artifacts, and customer support attachments.
- Secret and config boundary map:
  - `.env` exists locally and is ignored by `.gitignore`, while `common/firebase.json` is tracked by git and contains Firebase service-account keys, including a `private_key`.
  - `huz/settings.py` loads `SECRET_KEY`, MySQL settings, SMTP credentials, CORS allow-lists, Swagger/media feature flags, and the default Firebase credential path from environment-backed settings.
  - External integration boundaries are MySQL, Hostinger SMTP, VeevoTech SMS, Firebase Admin, and optional ngrok origins allowed through CORS regexes.
- Most security-critical components for Phase 1 follow-up:
  - `common/authentication.py`, `common/middleware.py`, and `common/permissions.py` because they define the effective trust model for every API prefix.
  - `partners/partner_profile.py` and `partners/partner_accounts_and_transactions.py` because they still expose high-value partner identity and finance operations through legacy token transport.
  - `booking/manage_partner_booking.py` because it combines partner token handling, booking-state mutation, document uploads, complaints, and receivable visibility.
  - `management/approval_task.py` because it controls partner approvals, payment decisions, payout release, and master-hotel writes.
  - `common/user_profile.py` and `common/utility.py` because they own OTP delivery, SMS/email/Firebase integrations, file storage, and secret loading.
- Phase 0 conclusion: the repo already has a clear split between modern bridge-authenticated routes and older token-in-query/body flows, but the global legacy authentication path, the large legacy partner surface, the admin mutation hub, and the repo-tracked Firebase credential are the dominant security surfaces to analyze next.

### 2026-03-12 Security Audit Phase 1 Analyze Security Risks
- Phase scope and method: revisited the Phase 0 trust boundaries and then traced the concrete auth, serializer, and mutation code paths in `common/authentication.py`, `huz/settings.py`, `partners/package_management.py`, `partners/serializers.py`, `booking/serializers.py`, `booking/views/bookings.py`, `booking/manage_partner_booking.py`, `partners/partner_profile.py`, `partners/partner_accounts_and_transactions.py`, `common/user_profile.py`, and `common/utility.py`.
- Critical finding: anonymous website package endpoints leak live operator auth tokens.
  - `HuzBasicShortSerializer`, `HuzBasicSerializer`, and `HuzAlignedPackageSerializer` all expose `partner_session_token`.
  - `GetHuzShortPackageForWebsiteView`, `GetHuzPackageDetailForWebsiteView`, `GetHuzFeaturedPackageForWebsiteView`, and `GetSearchPackageByCityNDateView` are `AllowAny` and serialize package responses with `HuzAlignedPackageSerializer`.
  - Net effect: a normal anonymous catalog request can harvest a partner's bearer-equivalent session token directly from package JSON.
- Critical finding: booking payloads leak session tokens across trust boundaries.
  - Customer booking serializers expose `partner_session_token`, and those serializers back `/api/v1/bookings/`, `/api/v1/bookings/<id>/`, and `/api/v1/users/me/bookings/existing/`.
  - Partner booking serializers expose `user_session_token`, and those serializers back `/bookings/get_all_booking_detail_for_partner/` and `/bookings/get_booking_detail_by_booking_number/`.
  - Because the same tokens are accepted by the auth bridge, ordinary booking reads disclose credentials that can be replayed on other routes.
- Critical finding: public identity lookups return full serialized profiles, not existence booleans.
  - `common/user_profile.IsUserExistView` returns `UserProfileSerializer`, which includes `session_token`, `firebase_token`, and `web_firebase_token`.
  - `partners/partner_profile.IsPartnerExistView` and `GetPartnerProfileView` return `PartnerProfileSerializer`, which includes `partner_session_token`, Firebase tokens, wallet state, and mailing detail.
  - This makes email/phone enumeration immediately useful for session theft rather than only reconnaissance.
- Critical finding: customer session tokens are deterministic and reversible from phone numbers.
  - `CreateMemberProfileView` derives `session_token` from `country_code + (phone_number * 52955917)` and passes it through `generate_token`.
  - `generate_token` is only base64 encoding, not a random or signed token primitive.
  - Any actor who already knows a customer's phone number can derive the same session token offline and then use it anywhere the auth bridge accepts `session_token`.
- Critical finding: the partner finance surface supports direct wallet-theft workflows once a token is known.
  - `ManagePartnerBankAccountView` is `AllowAny` and lets the caller create a bank account for any partner identified by `partner_session_token`.
  - `ManagePartnerWithdrawView` is `AllowAny`, accepts the same token, and immediately decrements the partner wallet inside the request transaction after creating the withdrawal request.
  - Combined with token leakage from the public package APIs, this is a concrete unauthorized-withdrawal path entirely inside this repository.
- High-severity finding: several partner mutation routes do not bind actions to the authenticated principal.
  - `TakeActionView`, `ManageBookingDocumentsView`, and `DeleteBookingDocumentsView` load `PartnerProfile` from `request.data['partner_session_token']` even though the route already has an auth layer.
  - `GetBookingShortDetailForPartnersView` and `GetBookingDetailByBookingNumberForPartnerView` correctly resolve the bound partner principal, so the file currently mixes safe and unsafe patterns.
  - Result: any leaked victim token can be supplied in the request body to steer mutations toward that victim partner.
- Phase 1 conclusion: the dominant security problem is no longer just "legacy token transport exists"; it is that session tokens are treated as long-lived bearer credentials, leaked through normal response payloads and public lookup endpoints, and then accepted directly on high-value partner finance/profile routes and some booking mutation paths.
- Verification for this phase remained source-based. No product code was modified and no runtime exploit was executed.

### 2026-03-12 Security Audit Phase 2 Write Security Findings
- Phase scope and method: re-read the Phase 0 and Phase 1 outputs, the required atlas docs, and the current backlog, then consolidated the evidence into a prioritized remediation order for the repo-only security lane. This phase was report-only and did not modify product code.
- Executive summary: the most urgent exploit chain is fully internal to this repository. Anonymous website package responses can disclose `partner_session_token`, and the same token is accepted by `AllowAny` partner bank-account and withdrawal routes that can redirect payouts and debit wallets. The customer side has a parallel credential failure because public existence/profile lookups and deterministic phone-derived tokens both produce bearer-equivalent `session_token` values that the auth bridge still accepts.
- Priority 0 containment guidance:
  - Rotate the tracked Firebase credential and move it out of the repository (`SEC-002`).
  - Remove `session_token`, `partner_session_token`, `firebase_token`, and `web_firebase_token` from package, booking, and public existence/profile serializers, then invalidate and reissue the exposed customer and partner session tokens (`SEC-005`, `SEC-006`, `SEC-007`, `SEC-008`).
  - Disable raw query/body token trust on partner finance, profile, and other high-value mutation routes before broader cleanup work begins (`SEC-001`, `SEC-003`, `SEC-009`).
- Priority 1 auth-boundary remediation guidance:
  - Convert legacy partner profile/account endpoints to authenticated-partner routes and bind reads/writes to the authenticated principal instead of request-supplied tokens (`DS-P1-001`, `SEC-003`, `SEC-009`).
  - Remove request-time partner re-binding from partner booking mutation views and use the auth-resolved partner consistently (`DS-P1-002`, `SEC-010`).
  - Replace deterministic customer token generation with strong random opaque tokens, then add an invalidation path so previously phone-derived tokens stop working (`SEC-008`).
- Priority 2 defense-in-depth and verification guidance:
  - Re-check admin flows after auth cleanup so staff endpoints no longer depend on raw customer or partner session tokens in request payloads where an authenticated principal or server-side lookup can be used instead.
  - Add regression tests that assert public package, booking, user-existence, and partner-profile responses never emit auth or device tokens, and restore dedicated `management` coverage for payment review and payout transfer (`DS-P1-006`).
  - Confirm production deployments keep `SERVE_MEDIA_AND_STATIC_FROM_DJANGO` and optional docs routes disabled unless intentionally required, because uploaded passports, payment proofs, complaints, and partner-company files remain sensitive (`SEC-004`).
- Recommended implementation order for a future fix batch:
  - Batch 1: contain active credential leaks and rotate secrets (`SEC-002`, `SEC-005`, `SEC-006`, `SEC-007`, `SEC-008`).
  - Batch 2: harden partner identity and finance routes and reject raw token trust (`SEC-001`, `SEC-003`, `SEC-009`, `DS-P1-001`).
  - Batch 3: harden partner booking mutations and cross-tenant principal binding (`SEC-010`, `DS-P1-002`).
  - Batch 4: add defense-in-depth coverage and exposure checks (`SEC-004`, `DS-P1-006`).
- Out-of-scope coordination note: any downstream client that still submits `session_token` or `partner_session_token` in query/body fields will need a coordinated rollout outside this report-only phase. The backend target state is still fail-closed auth that binds mutations to the authenticated principal instead of caller-supplied tokens.
- Verification for this phase remained source-based. No exploit execution, token rotation, or product-code change was performed.

### 2026-03-12 Deep Scan Phase 2 Write Findings and Backlog
- Phase objective: convert the Phase 1 source audit into grouped findings and an execution-ready backlog without another full repository rescan.
- Scope scanned in this phase: `/Users/macbook/Desktop/Huz/Huz-Backend`, with targeted reopen of the auth, booking-state, financial, and route-ownership hotspots rather than another inventory pass across all 1,511 dev-relevant files in scope.
- Files examined directly while writing the backlog: `common/api_v1.py`, `common/user_profile.py`, `partners/partner_profile.py`, `partners/partner_accounts_and_transactions.py`, `partners/serializers.py`, `partners/package_management.py`, `partners/urls.py`, `booking/models.py`, `booking/workflow.py`, `booking/services.py`, `booking/manage_partner_booking.py`, `booking/serializers.py`, `management/approval_task.py`, `management/urls.py`, and the existing atlas plus QA docs.
- Grouped findings by concern:
  - Auth and tenancy: the first implementation batch still needs to combine `DS-P1-001` and `DS-P1-002`. Partner self-service, finance, and several partner-booking mutation routes still trust request-supplied partner tokens, and those paths overlap directly with the token-exposure findings already captured as `SEC-003`, `SEC-005`, `SEC-006`, `SEC-007`, `SEC-009`, and `SEC-010`. The auth leak and the tenant-boundary bug should be treated as one remediation lane instead of separate cleanups.
  - Booking state integrity: `DS-P1-003` is a schema-and-service mismatch, not just a view bug. The code assumes a single `DocumentsStatus` row and a single `PartnersBookingPayment` row per booking, but both relations are modeled as plain `ForeignKey`s and the workflow only inspects the first related status row. The delete-document flow also removes evidence without recomputing completion flags, so lifecycle readiness can drift away from the stored documents.
  - Financial correctness: `DS-P1-004` remains a correctness issue even without an attacker. Both customer and partner withdrawals read balances before entering the transaction and then subtract from unlocked wallet rows, so concurrent legitimate requests can oversubscribe balances or lose updates.
  - Route and ownership drift: `DS-P1-005` stays medium priority but should wait until auth and money movement are hardened. Unmounted management views and duplicated legacy package implementations are maintenance hazards, but they are not the first thing to fix while credential disclosure and payout correctness remain open.
  - QA blind spot: `DS-P1-006` remains the main blocker for safe follow-on admin changes. The management surface still lacks live tests, so approval, payment-review, receivable-transfer, and master-hotel fixes would otherwise ship with weaker regression protection than the `common`, `partners`, and `booking` lanes.
- Prioritized remediation sequence for future implementation runs:
  - `Batch DS-B1`: `DS-P1-001`, `DS-P1-002`, plus the dependent token-exposure security items `SEC-003`, `SEC-005`, `SEC-006`, `SEC-007`, `SEC-009`, and `SEC-010`. Goal: stop credential disclosure and enforce authenticated-principal ownership on partner-facing writes before any deeper refactor.
  - `Batch DS-B2`: `DS-P1-003` and `DS-P1-004`. Goal: restore one-row booking-state invariants and serialize wallet debits so lifecycle and payout logic cannot drift under retries or concurrency.
  - `Batch DS-B3`: `DS-P1-005` and `DS-P1-006`. Goal: clean dead paths and rebuild management verification once the critical auth and financial fixes are in place.
- Commands re-run for Phase 2 evidence capture:
  - `rg -n "permission_classes = \[AllowAny\]|PartnerProfile.objects.filter\(partner_session_token|partner_session_token\b|firebase_token|web_firebase_token" ...`
  - `rg -n "partner_session_token|resolve_authenticated_partner_profile|get_or_create\(|DocumentsStatus|PartnersBookingPayment|document_statuses\[0\]|select_for_update|withdraw_amount|wallet.amount" ...`
  - `rg -n "GetAllApprovedCompaniesView|ManageFeaturedPackageView|path\(|urlpatterns|class .*Package|GetHuz.*ForWebsiteView|partner_session_token|session_token" ...`
  - `rg --files /Users/macbook/Desktop/Huz/Huz-Backend/management /Users/macbook/Desktop/Huz/Huz-Backend/common /Users/macbook/Desktop/Huz/Huz-Backend/partners /Users/macbook/Desktop/Huz/Huz-Backend/booking | rg '/tests?\.py$|/tests/'`
  - `nl -ba ... | sed -n '214,260p'`, `208,270p`, `168,286p`, `206,232p`, `726,770p`, `552,640p`, `388,470p`, `832,910p`, `1030,1055p`, `1408,1436p`, `1458,1698p`, and `360,377p` for line-accurate evidence.
- Remaining blind spots after Phase 2:
  - Runtime verification is still blocked because the current shell lacks Django, so no endpoint test, migration, or query-count run could be executed in this phase.
  - No production or QA database snapshot was available, so duplicate `DocumentsStatus` or `PartnersBookingPayment` rows were assessed from schema plus write-path analysis rather than measured from live data.
  - External client reliance on legacy query/body session tokens is still unknown; any compatibility window may need downstream coordination, but the backend-side hardening can still be implemented entirely inside this repository.
  - Large checked-in `media/`, `static/`, and deleted legacy files remain out of active scan scope unless a future remediation batch needs them.
- Verification for this phase remained source-based and documentation-only. No product code, atlas docs, or non-report run files were modified before phase completion.

### 2026-03-12 Deep Scan Phase 3 Verify and Summarize
- Re-read the required atlas docs, run artifacts, and the live source for the highest-priority deep-scan findings. The auth/token exposure, partner-principal rebinding, duplicate booking-state row, wallet concurrency, and unmounted-route findings all still match the current checked-out tree.
- Revalidated the main evidence directly in `common/authentication.py`, `common/user_profile.py`, `common/serializers.py`, `common/api_v1.py`, `partners/partner_profile.py`, `partners/partner_accounts_and_transactions.py`, `partners/serializers.py`, `partners/package_management.py`, `booking/request_serializers.py`, `booking/views/bookings.py`, `booking/serializers.py`, `booking/manage_partner_booking.py`, `booking/models.py`, `booking/workflow.py`, `booking/services.py`, `management/approval_task.py`, and `management/urls.py`.
- Corrected one atlas mismatch found during the Phase 3 sanity check: `/common/manage_user_account/` is still `IsAdminUser` for both create and delete in the live tree, so the route map and API surface were updated to stop describing POST as public.
- Added two durable contract clarifications to the atlas instead of opening new backlog items:
  - `/api/v1/bookings/*` still validates a `session_token` field at the serializer layer, but `booking/views/bookings.py` backfills it from the authenticated user context for non-admin callers before validation.
  - `booking/manage_partner_booking.py` is only partially migrated to auth-context-first partner resolution: queue/detail and several statistics reads use `extract_partner_session_token()`, while many mutation handlers still reload `PartnerProfile` from the request body token.
- Confirmed the backlog priorities remain unchanged. No deep-scan or security item was closed, downgraded, or superseded by the Phase 3 verification pass.
- Runtime verification is still blocked in this shell:
  - `python3 manage.py test management partners booking common --settings=huz.settings_test` fails immediately with `ModuleNotFoundError: No module named 'django'`.
  - `rg --files /Users/macbook/Desktop/Huz/Huz-Backend/management /Users/macbook/Desktop/Huz/Huz-Backend/common /Users/macbook/Desktop/Huz/Huz-Backend/partners /Users/macbook/Desktop/Huz/Huz-Backend/booking | rg '/tests?\.py$|/tests/'` still returns only `common/tests.py`, `partners/tests.py`, and `booking/tests.py`.
- Repo-state verification: `git -C /Users/macbook/Desktop/Huz/Huz-Backend status --short` still shows the same broad dirty-tree pattern with live-file modifications, deleted legacy modules, and many media artifacts, so the atlas should continue to describe the checked-out tree rather than assume clean history.
- Verification for this phase remained documentation-only. No product code was modified.

### 2026-03-12 Plan Batch Phase 0 Read Context and Backlog
- Re-read the plan-batch run state, phase prompt, project-bot config, operator profile, required atlas docs, `CHANGE_MAP.md`, `DEEP_SCAN_REPORT.md`, and `BUG_BACKLOG.md` before any batching decisions.
- Confirmed the planning scope is unchanged: the entire backend at `/Users/macbook/Desktop/Huz/Huz-Backend` with no narrower module target, report-only execution, and ownership limited to backlog triage plus batching.
- Confirmed the current priority landscape still clusters cleanly into three downstream batches:
  - Immediate auth and tenancy containment: `SEC-B1`, `SEC-B2`, and `DS-B1`, centered on token disclosure, raw token trust, partner-principal rebinding, and public serializer leaks.
  - Next data-integrity and concurrency fixes: `DS-B2`, centered on one-row booking state invariants and wallet debit locking.
  - Later drift and verification cleanup: `DS-B3` plus `SEC-B4`, centered on dead-route cleanup, management coverage, and production exposure guardrails.
- Identified stale-document blockers for later planning depth:
  - `docs/qa/FULL_AUDIT_REPORT.md` is still a placeholder stub, so this run should treat `docs/qa/DEEP_SCAN_REPORT.md` and `docs/qa/BUG_BACKLOG.md` as the authoritative audit inputs.
  - `docs/atlas/BACKEND_BLUEPRINT.md`, `docs/atlas/BACKEND_SCHEMA_MAP.md`, and `docs/atlas/TRACEABILITY_MAP.md` remain minimally populated and should be refreshed before any schema-heavy or traceability-heavy planning pass.
- Reconfirmed two operational blockers that downstream implementation phases must account for:
  - Runtime verification is still blocked in the current shell until Django and related test dependencies are available.
  - The target repository remains a dirty working tree, so planning should follow the checked-out files instead of assuming clean-history baselines.
- Verification in this phase remained source-based and documentation-only. No product code was modified.

### 2026-03-12 Plan Batch Phase 1 Prioritize the Next Batch
- Reopened the live serializer and public-read seams behind the top auth findings instead of treating `SEC-B1`, `SEC-B2`, and `DS-B1` as one implementation unit.
- The current tree confirms a narrower first batch is safer than a broad auth rewrite:
  - `common/serializers.py` still exposes `session_token`, `firebase_token`, and `web_firebase_token` on `UserProfileSerializer`.
  - `partners/serializers.py` still exposes `partner_session_token`, `firebase_token`, and `web_firebase_token` on `PartnerProfileSerializer`, and also emits `partner_session_token` on website/operator package serializers.
  - `booking/serializers.py` still exposes `partner_session_token` and `user_session_token` across customer, partner, and receivable booking payloads.
  - Public lookup/read handlers in `common/user_profile.py` and `partners/partner_profile.py` still serialize full profile records straight back to callers.
- Prioritization decision: the next implementation run should execute `PB-1A Response Contract Containment`, covering `SEC-005`, `SEC-006`, `SEC-007`, plus only the response-sanitization portion of `DS-P1-001`.
- `PB-1A` boundary:
  - In scope: response-contract and serializer cleanup for public package reads, customer booking reads, public existence/profile lookups, and partner profile payloads, plus the matching `common`, `partners`, and `booking` tests.
  - Out of scope for this batch: auth-transport removal, principal-binding changes on partner finance/profile writes, partner booking mutation hardening, token regeneration/reissue, secret rotation, wallet locking, booking-state invariants, and management cleanup.
- Rationale for choosing `PB-1A` first:
  - It shuts the most direct repo-local credential disclosure path without forcing a same-run rewrite of legacy auth semantics.
  - It stays concentrated in read-side contracts that already have live test modules, while the heavier mutation files are both larger and already dirty in the working tree.
  - It creates a cleaner base for later auth-boundary batches because downstream implementers can then change trust rules without also carrying response-schema churn in the same diff.
- Verification for this phase remained source-based and documentation-only. No product code was modified.

### 2026-03-12 Plan Batch Phase 2 Write the Execution Plan
- Locked the next implementation run to `PB-1A Response Contract Containment`; no new backlog items were added and no existing priorities changed.
- Converted the Phase 1 batch choice into a concrete edit order tied to the live route surface:
  - `common`: sanitize `/common/is_user_exist/` and any shared user serializers that still expose `session_token`, `firebase_token`, or `web_firebase_token`.
  - `partners`: sanitize `/partner/is_user_exist/`, `/partner/get_partner_profile/`, and the public website package reads mounted in `partners/package_management.py`.
  - `booking`: sanitize booking detail/list/receivable serializers that currently expose `partner_session_token` or `user_session_token` across `/api/v1/bookings/*`, `/api/v1/users/me/bookings/*`, `/bookings/get_*`, and admin/receivable payloads.
- Concrete file scope for the next fix run:
  - Primary edit files: `common/serializers.py`, `common/user_profile.py`, `partners/serializers.py`, `partners/package_management.py`, `partners/partner_profile.py`, and `booking/serializers.py`.
  - Secondary touch points only if needed to keep read responses wired correctly: `booking/views/bookings.py` and `booking/manage_partner_booking.py`.
  - Explicitly deferred from this batch: `partners/partner_accounts_and_transactions.py`, auth bridge changes in `common/authentication.py`, token rotation work in `common/utility.py`, partner booking mutation hardening, wallet locking, and management cleanup.
- Expected verification commands for that implementation run:
  - `python3 manage.py test common.tests partners.tests booking.tests --settings=huz.settings_test`
  - `python3 manage.py test partners.tests.PackageManagementWebsiteViewTests booking.tests.BookingWorkflowServiceValidationTests booking.tests.ManagePartnerBookingViewsTests --settings=huz.settings_test`
  - `python3 -m compileall common partners booking management huz`
- Current environment note: this planning phase remains documentation-only, and the previously observed missing-Django blocker still applies to the `manage.py test` commands until dependencies are provisioned in the shell.

### 2026-03-12 Backend Optimize Phase 0 Baseline Hotspots
- Re-read the backend-optimize run state, Phase 0 prompt, operator profile, required atlas docs, `DEEP_SCAN_REPORT.md`, and `BUG_BACKLOG.md` before reopening source files.
- Established the current measurable baseline from the live tree:
  - Existing hotspot-specific index work is already present in `common/migrations/0002_add_hotspot_indexes.py`, `partners/migrations/0004_add_hotspot_indexes.py`, `booking/migrations/0002_add_hotspot_indexes.py`, and `booking/migrations/0007_add_booking_list_indexes.py`, so the biggest remaining gains are query-shape and response-loading fixes rather than first-pass index additions.
  - The highest-risk backend modules still total 10,365 LOC across nine files, led by `booking/manage_partner_booking.py` (1,800), `partners/package_management_operator.py` (1,699), `partners/package_management.py` (1,698), `management/approval_task.py` (1,513), `partners/partner_profile.py` (1,313), and `booking/services.py` (1,004).
- Identified four Phase 0 backend hotspot targets that can be optimized entirely inside Huz-Backend:
  - Customer booking detail endpoints currently load bare `Booking` rows in `booking/services.py`, while `DetailBookingSerializer` traverses partner company/address, package airline data, payments, objections, passports, document status, booking documents, arrangement details, and ratings. Every retrieve or post-mutation response therefore fans out into multiple lazy relation reads instead of reusing the existing preloaded detail queryset helper already used on the partner side.
  - Partner dashboard/stat endpoints still execute repeated per-bucket counts and Python-side star histograms. `GetPartnersOverallBookingStatisticsView` runs one grouped status query plus one `.count()` per workflow bucket, and `build_star_distribution()` materializes every rating row in Python for overall/package rating summaries.
  - The admin payment-review queue recomputes the same annotated `reviewable_queryset` repeatedly: one count per queue, one total count, one total-amount aggregate, and the paginated fetch all run separately on a join-heavy queryset. This is a clear candidate for filtered aggregates returned in a single pass.
  - `GetAllHotelsWithImagesView` falls back to `HuzHotelDetail.objects.all()`, loads the full result set into Python, deduplicates it in-memory, then serializes every row when the synthetic master-hotel package is absent. That makes the fallback path scale with the full hotel table instead of the filtered response size.
- Prioritized the next safe backend-optimize implementation order for this lane:
  - `OPT-P1-001` first because it is response-local, contract-neutral, and directly reduces query fan-out on customer booking detail and update flows.
  - `OPT-P1-002` second because partner dashboard endpoints are repeated operational reads and the current implementation multiplies queries per request.
  - `OPT-P1-003` third because the admin queue remains join-heavy but is admin-only.
  - `OPT-P1-004` fourth because the fallback path matters only when the canonical master-hotel package is missing.
- Verification:
  - `git -C /Users/macbook/Desktop/Huz/Huz-Backend status --short` confirmed the target repo is still in a broad dirty state; this phase stayed report-only and did not touch product code.
  - `python3 manage.py test common.tests --settings=huz.settings_test` still fails immediately with `ModuleNotFoundError: No module named 'django'`, so runtime query-count measurement is not yet available in this shell.
  - `python3 -m compileall booking partners management common huz` succeeded, confirming the currently checked-out Python files still parse.
- No product code or atlas docs were changed in this phase; only workspace reports and run memory were updated.

### 2026-03-12 Backend Optimize Phase 1 Implemented Hotspot Fixes
- Implemented `OPT-P1-001` by adding an opt-in preloaded current-user booking detail path in `booking/services.py` and `booking/views/bookings.py`; current-user retrieve plus the payment/passport mutation responses now reload a prefetch-heavy detail queryset before `DetailBookingSerializer` runs.
- Implemented `OPT-P1-002` by replacing the partner booking statistics and rating-summary loops in `booking/manage_partner_booking.py` with filtered database aggregates for workflow buckets, status totals, and star histograms.
- Implemented `OPT-P1-003` by collapsing the admin payment-review queue summary counters in `management/approval_task.py` into one filtered aggregate summary and keeping only the queue-specific total-amount aggregate when the caller selects a queue filter.
- Added focused regression coverage in `booking/tests.py` for the customer detail/payment/passport response path, the partner statistics and rating summaries, and the admin payment-review queue query budget.
- Verification moved onto the project virtualenv instead of the system Python: `.venv/bin/python manage.py test booking.tests.BookingWorkflowServiceValidationTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test` passed, and `python3 -m compileall /Users/macbook/Desktop/Huz/Huz-Backend/booking /Users/macbook/Desktop/Huz/Huz-Backend/management` also passed.
- Deferred: `OPT-P1-004` remains open because the hotel-catalog fallback cleanup is lower priority than the higher-traffic booking, dashboard, and admin queue surfaces addressed in this phase.

### 2026-03-12 Backend Optimize Phase 2 Verification and Documentation
- Re-read the live Phase 1 diffs and the current atlas/backlog context for `booking/services.py`, `booking/views/bookings.py`, `booking/manage_partner_booking.py`, `management/approval_task.py`, and `booking/tests.py` before running verification so the results stay scoped to the implemented optimization surfaces.
- Focused backend verification now runs cleanly from the project virtualenv:
  - `.venv/bin/python manage.py test booking.tests.BookingWorkflowServiceValidationTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test`
  - Result: 70 tests passed in 2.008s with `System check identified no issues (0 silenced).`
  - `python3 -m compileall booking management huz` also passed.
- Before/after impact recorded from the targeted regressions:
  - `OPT-P1-001`: the current-user retrieve plus payment/passport mutation responses now hand `DetailBookingSerializer` a preloaded booking object, and the serializer regressions still observe 0 additional queries during serialization on that path.
  - `OPT-P1-002`: partner workflow totals and rating summaries no longer scale with repeated `.count()` loops or Python-side rating iteration; the focused regressions keep booking stats and overall partner rating at <=2 queries and package-specific rating summary at <=3 queries.
  - `OPT-P1-003`: the admin payment-review queue no longer recalculates queue counts with one pass per bucket; the focused regression keeps `/management/fetch_all_paid_bookings/` at <=7 queries while preserving `total_requests` and `queue_counts` metadata.
- Deferred follow-up remains unchanged:
  - `OPT-P1-004` is still open because the hotel catalog fallback path in `partners/package_management_operator.py` was intentionally left out of the higher-priority booking/dashboard/admin batch.
  - Broader admin verification remains limited because the live tree still has no dedicated `management/tests.py`; the queue regression currently lives in `booking/tests.py`.
- Repo-state note: `git -C /Users/macbook/Desktop/Huz/Huz-Backend status --short` still reflects a broad dirty tree outside this optimization lane, so this phase stayed verification-and-documentation only and did not modify product code.

### 2026-03-12 Regression Hunt Phase 0 Target Recent Risk
- Re-read the regression-hunt run state, Phase 0 prompt, operator profile, required atlas docs, `CHANGE_MAP.md`, `BUG_BACKLOG.md`, `DEEP_SCAN_REPORT.md`, and the recent `backend-optimize` plus `security-audit` run summaries before checking the live target repo.
- Separated the current working tree into two recent-risk clusters so the regression sweep can stay bounded:
  - A documented and previously verified optimization cluster in `booking/services.py`, `booking/views/bookings.py`, `booking/manage_partner_booking.py`, and `management/approval_task.py`.
  - A second, currently undocumented compatibility cluster touching `common/urls.py`, `booking/urls.py`, `management/urls.py`, `partners/urls.py`, `huz/urls.py`, `common/user_profile.py`, `booking/serializers.py`, `booking/views/support.py`, `common/serializers.py`, and `common/api_v1.py`.
- Highest-risk flows and code paths selected for Phase 1:
  - Customer onboarding via `/common/manage_user_account/`, because `CreateMemberProfileView` now rejects non-`+92` numbers before persistence and rolls back user plus wallet creation if OTP delivery fails.
  - Current-user booking detail, payment, passport, complaint, and request reads, because the customer detail path now depends on preloaded booking relations and the support list endpoints now depend on prefetched mailing and company relations.
  - Partner dashboard statistics, rating summaries, and complaint reads, because the partner views now rely on aggregate SQL counts and additional prefetching instead of prior loop-based behavior.
  - Admin payment-review queue summaries, because `/management/fetch_all_paid_bookings/` now derives queue counts and totals from one aggregate summary before pagination.
  - Route compatibility across removed legacy paths, because the live route table no longer mounts multiple older `/common/*`, customer `/bookings/*`, `/management/*`, `/partner/get_city_wise_packages_count/`, and `/chat/` surfaces.
- Phase 1 validation matrix chosen from the live source and current tests:
  - `/Users/macbook/Desktop/Huz/Huz-Backend/.venv/bin/python manage.py test common.tests.CreateMemberProfileViewTransactionTests common.tests.PublicUrlExposureTests common.tests.UserProfileSerializerQueryTests booking.tests.BookingWorkflowServiceValidationTests booking.tests.ApproveBookingPaymentViewTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test`
  - `python3 -m compileall common booking management huz`
  - Route smoke or resolver spot checks for intentionally removed legacy endpoints so compatibility breaks are made explicit; if any external client still requires those routes, that follow-up becomes downstream coordination work rather than a same-lane backend-only fix.
- Phase 0 stayed documentation-only. No runtime validation was executed yet so the actual regression sweep remains in Phase 1.

### 2026-03-12 Regression Hunt Phase 1 Reproduce and Fix Regressions
- Ran the focused Phase 1 validation bundle from the project virtualenv:
  - `.venv/bin/python manage.py test common.tests.CreateMemberProfileViewTransactionTests common.tests.PublicUrlExposureTests common.tests.UserProfileSerializerQueryTests booking.tests.BookingWorkflowServiceValidationTests booking.tests.ApproveBookingPaymentViewTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test`
  - Result after fixes: `84` tests passed in `2.328s` with `System check identified no issues (0 silenced).`
- The first failure was in the verification harness itself: `booking.tests.ApproveBookingPaymentViewTests.test_admin_review_queue_uses_bounded_summary_query_count` called a removed `_authenticated_request()` helper. Restoring the class-local `APIRequestFactory` setup and auth helper exposed the underlying product regression instead of hiding it behind an `AttributeError`.
- The confirmed product regression was on `/management/fetch_all_paid_bookings/`:
  - The focused queue test regressed to `9` queries instead of the intended `<=7`.
  - Source-backed query capture showed two avoidable costs: a second filtered `SUM(total_price)` query after the main review summary aggregate, and eager operator-document recalculation in `booking/workflow.py` even for bookings still in traveller-details/payment-review stages.
  - Fixed by folding queue-specific total amounts into `_build_payment_review_summary()` and deferring `booking_operator_documents_are_complete()` until the booking is actually in `IN_FULFILLMENT`.
- Re-verified the repair with:
  - `.venv/bin/python manage.py test booking.tests.ApproveBookingPaymentViewTests.test_admin_review_queue_uses_bounded_summary_query_count --settings=huz.settings_test`
  - Result: passed, restoring the admin queue regression budget to `<=7` queries.
- Additional Phase 1 verification:
  - `python3 -m compileall booking management huz common partners` passed.
  - Route smoke checks confirmed that `/bookings/get_all_booking_short_detail_by_user/`, `/management/fetch_all_approved_companies/`, `/management/manage_featured_package/`, `/partner/get_city_wise_packages_count/`, and `/chat/` still resolve to `404`, matching the legacy-route removal already tracked in `REG-P0-001`.
- Phase 1 touched only the regression lane files needed to restore test confidence and the admin queue query budget. The legacy-route compatibility item remains open because restoring or migrating those paths depends on downstream consumers outside Huz-Backend.

### 2026-03-12 Regression Hunt Phase 2 Document Regression Outcome
- Re-ran a broader verification sweep from the project virtualenv instead of stopping at the original focused regression slice:
  - `.venv/bin/python manage.py test common.tests partners.tests booking.tests --settings=huz.settings_test`
  - Result: `116` tests passed in `2.990s` with `System check identified no issues (0 silenced).`
- Re-ran `python3 -m compileall booking management huz common partners`; the checked-out backend modules still parse cleanly after the Phase 1 repair.
- Re-smoked the documented route split with Django's resolver:
  - Still live: `/common/send_otp_sms/`, `/common/is_user_exist/`, `/bookings/get_overall_booking_statistics/`, `/management/fetch_all_paid_bookings/`, `/partner/get_featured_packages/`
  - Still removed: `/bookings/get_all_booking_short_detail_by_user/`, `/management/fetch_all_approved_companies/`, `/management/manage_featured_package/`, `/partner/get_city_wise_packages_count/`, `/chat/`
- No new in-scope regressions surfaced beyond the Phase 1 admin payment-review queue issue that was already fixed and re-verified.
- Confidence update:
  - High confidence for the touched booking/customer/partner regression surfaces and the admin review queue path covered by the 116-test suite plus compile and route-smoke evidence.
  - Residual risk remains on `REG-P0-001` because route restoration decisions depend on downstream clients outside Huz-Backend, and on broader admin-only behavior because the repo still lacks a dedicated `management/tests.py`.
- Environment note: the earlier shell-level `ModuleNotFoundError: No module named 'django'` blocker no longer applies when verification is run through `/Users/macbook/Desktop/Huz/Huz-Backend/.venv/bin/python`; the remaining test-confidence gap is coverage depth, not dependency availability.

### 2026-03-12 Change Journal Phase 0 Recent Change Context
- Re-read the change-journal run state and Phase 0 prompt, the required atlas docs, `CHANGE_MAP.md`, `BUG_BACKLOG.md`, `DEEP_SCAN_REPORT.md`, `FULL_AUDIT_REPORT.md`, and the recent `backend-optimize`, `regression-hunt`, and `plan-batch` run summaries before reopening the live target repo.
- The latest verified implementation batch in the backend is still the optimization slice from `backend-optimize`:
  - `OPT-P1-001`: current-user booking retrieve plus payment/passport mutation responses now reload through a preloaded detail queryset in `booking/services.py` and `booking/views/bookings.py`.
  - `OPT-P1-002`: partner booking statistics and rating summaries now use DB-side aggregates in `booking/manage_partner_booking.py`.
  - `OPT-P1-003`: the admin payment-review queue now derives queue counts and request totals from a consolidated aggregate in `management/approval_task.py`.
- The most recent verified follow-up change is the regression-hunt repair on the admin payment-review queue:
  - `booking/tests.py` regained the direct-view auth helper needed to exercise the queue path correctly.
  - `management/approval_task.py` now returns queue-specific total amounts from the same review-summary aggregate instead of a second filtered sum query.
  - `booking/workflow.py` now defers operator-document completeness reads until fulfillment-state recalculation actually needs them, restoring `/management/fetch_all_paid_bookings/` to the intended `<=7` query budget.
- The current verification baseline for the recent documented work is:
  - `.venv/bin/python manage.py test booking.tests.BookingWorkflowServiceValidationTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test` passed with 70 tests.
  - `.venv/bin/python manage.py test common.tests partners.tests booking.tests --settings=huz.settings_test` passed with 116 tests.
  - `python3 -m compileall booking management huz common partners` passed.
  - The earlier system-Python `ModuleNotFoundError: No module named 'django'` note is historical context only and should not be treated as the current verification blocker.
- The live working tree still contains a broader dirty-tree compatibility/auth cluster outside the last verified implementation batches, including route and contract drift across `common/urls.py`, `booking/urls.py`, `management/urls.py`, `partners/urls.py`, `huz/urls.py`, `common/user_profile.py`, `booking/serializers.py`, `common/serializers.py`, `common/api_v1.py`, and `partners/partner_accounts_and_transactions.py`.
- Treat that broader drift as ambient repo state and compatibility-risk context, not as a completed verified deliverable for the final journal, unless a dedicated run summary or verification sweep records it explicitly. This is the same boundary already captured in `REG-P0-001` and the regression-hunt Phase 0 notes.
- `FULL_AUDIT_REPORT.md` remains placeholder-level, so the durable source of truth for the latest backend changes is the combination of `CHANGE_MAP.md`, `DEEP_SCAN_REPORT.md`, `BUG_BACKLOG.md`, and the recent `backend-optimize` and `regression-hunt` run summaries rather than the full-audit stub.

### 2026-03-12 Change Journal Phase 1 Write Journal Entry
- Wrote the durable final recap for the latest verified backend work and kept it explicitly bounded to changes backed by the existing optimize/regression run summaries, atlas updates, backlog state, and verification evidence rather than the broader ambient dirty-tree churn.
- What changed in the last verified implementation window:
  - `OPT-P1-001` moved current-user booking detail, payment, and passport responses onto the preloaded booking-detail queryset in `booking/services.py` and `booking/views/bookings.py`, so `DetailBookingSerializer` no longer rehydrates the same related objects lazily on those customer-facing paths.
  - `OPT-P1-002` moved partner booking statistics and rating summaries in `booking/manage_partner_booking.py` onto filtered database aggregates instead of repeated per-bucket `.count()` calls and Python-side rating loops.
  - `OPT-P1-003` moved `/management/fetch_all_paid_bookings/` queue counts and request-summary metadata in `management/approval_task.py` onto consolidated filtered aggregates.
  - The most recent follow-up fix restored the admin payment-review queue regression budget by repairing the direct-view auth test harness in `booking/tests.py`, returning queue-specific total amounts from the same review-summary aggregate in `management/approval_task.py`, and deferring operator-document reads in `booking/workflow.py` until fulfillment-state recalculation actually needs them.
- Why those changes landed:
  - The highest-value repo-local performance wins were on the customer booking detail path, partner dashboard/statistics reads, and the admin payment-review queue, where the prior implementations repeated relation loading or aggregate work unnecessarily.
  - The regression-hunt repair was needed because the queue path drifted back above the intended `<=7` query budget during later verification, and the final journal needed to distinguish that verified fix from unrelated route/auth churn still present in the repo.
- How the work was implemented:
  - Reused the existing prefetch-aware detail-loading pattern on the customer booking response path instead of widening every booking mutation flow.
  - Replaced repeated Python loops and queryset fan-out in partner/admin summary endpoints with SQL-side filtered aggregates.
  - Used the refreshed atlas (`PROJECT_BLUEPRINT.md`, `MODULE_MAP.md`, `ROUTES_AND_ENTRYPOINTS.md`, `API_SURFACE.md`, `CHANGE_MAP.md`) plus `BUG_BACKLOG.md` and the optimize/regression run summaries to keep the final recap aligned with the actual recorded work.
- Verification outcomes carried into the journal:
  - `.venv/bin/python manage.py test booking.tests.BookingWorkflowServiceValidationTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test` passed with `70` tests.
  - `.venv/bin/python manage.py test common.tests.CreateMemberProfileViewTransactionTests common.tests.PublicUrlExposureTests common.tests.UserProfileSerializerQueryTests booking.tests.BookingWorkflowServiceValidationTests booking.tests.ApproveBookingPaymentViewTests booking.tests.ManagePartnerBookingViewsTests booking.tests.BookingSerializerQueryTests --settings=huz.settings_test` passed with `84` tests after the regression repair.
  - `.venv/bin/python manage.py test common.tests partners.tests booking.tests --settings=huz.settings_test` passed with `116` tests.
  - `python3 -m compileall booking management huz common partners` passed, and resolver smoke checks still match the documented legacy-route removals tied to `REG-P0-001`.
- What remains and the next recommended batch:
  - `OPT-P1-004` stays open for the operator hotel-catalog fallback path in `partners/package_management_operator.py`.
  - `DS-P1-006` stays open because the repo still has no dedicated `management/tests.py`, so admin-only confidence still depends on indirect coverage from `booking/tests.py`.
  - `REG-P0-001` stays open because several removed legacy routes still resolve to `404`, and any restoration or migration decision depends on downstream consumers outside Huz-Backend.
  - The next recommended implementation batch remains `PB-1A Response Contract Containment`: remove `session_token`, `partner_session_token`, `firebase_token`, and `web_firebase_token` from outward-facing `common`, `partners`, and `booking` responses without widening into the later auth-transport, principal-binding, or token-rotation work.
