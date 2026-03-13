# Security Threat Map

Track auth boundaries, trust zones, sensitive flows, and prioritized threat findings.

## Trust Zones
- `Public`: website catalog reads under `/partner/*`, partner auth/reset/registration routes, and optional Swagger/ReDoc plus Django-served `/media/*` and `/static/*` when feature flags are enabled.
- `Customer-authenticated`: `/api/v1/users/me/*` and `/api/v1/bookings/*`, backed by session-token auth contexts for `UserProfile`.
- `Partner-authenticated`: operator package routes under `/partner/*` and booking-fulfillment routes under `/bookings/*`, backed by session-token auth contexts for `PartnerProfile`.
- `Admin-authenticated`: `/management/*` plus `/admin/`, using Django staff auth and cross-tenant mutations.
- `External`: MySQL, SMTP, VeevoTech SMS, Firebase Admin, and local filesystem storage for uploaded documents.

| Surface | Threat Area | Risk | Mitigation Status | Notes |
| --- | --- | --- | --- | --- |
| Global session-token auth bridge | Header auth plus legacy query/body token transport | High | Partial | `SessionTokenHeaderAuthentication` and `LegacySessionTokenAuthentication` are both enabled globally, so modern endpoints can still authenticate from raw `session_token` or `partner_session_token`; the current mitigation is only the `X-Auth-Deprecated` response header. |
| Public website package payloads | Anonymous package list/detail/featured/search responses expose operator session tokens | Critical | Open | `partners/package_management.py` serves `AllowAny` website endpoints with `HuzAlignedPackageSerializer`, and that serializer includes `partner_session_token`. Anonymous website traffic can therefore harvest live partner auth tokens from normal catalog responses. |
| Cross-role booking payloads | Customer and partner booking responses expose the opposite party's auth token | Critical | Open | `booking/serializers.py` includes `partner_session_token` in customer booking payloads and `user_session_token` in partner/admin booking payloads. Those serializers are used by `/api/v1/bookings/*` and `/bookings/*`, turning routine booking reads into cross-tenant token disclosure. |
| Anonymous existence/profile lookups | Public identity endpoints return full serialized profiles including session/Firebase tokens | Critical | Open | `common/user_profile.IsUserExistView`, `partners/partner_profile.IsPartnerExistView`, and `partners/partner_profile.GetPartnerProfileView` are `AllowAny` and serialize `UserProfileSerializer` / `PartnerProfileSerializer`, which include `session_token` / `partner_session_token` plus Firebase device tokens. |
| Deterministic customer tokens | Customer session tokens are derived from phone numbers with reversible base64 encoding | Critical | Open | `common/user_profile.CreateMemberProfileView` computes the token from `country_code + phone_number * 52955917`, and `common.utility.generate_token` is only base64 encoding. Anyone who knows the phone number can derive the same bearer-equivalent token. |
| Legacy partner identity and profile routes | `AllowAny` endpoints read or mutate partner state via raw `partner_session_token` | Critical | Open | `partners/partner_profile.py` still exposes profile lookup, OTP, service setup, address/profile maintenance, company logo upload, and password change flows on the legacy `/partner/` prefix. |
| Partner wallet and finance routes | Bank-account, withdrawal, and transaction endpoints keyed by raw partner token | Critical | Open | `partners/partner_accounts_and_transactions.py` keeps `/partner/manage_partner_bank_account/`, `/manage_partner_withdraw_request/`, `/get_partner_all_transaction_history/`, and `/get_partner_over_transaction_amount/` on `AllowAny` plus token-in-query/body handling. |
| Partner booking operations | Booking queues, lifecycle actions, document uploads, complaints, stats, and receivables | Critical | Partial | `/bookings/*` uses `IsAdminOrPartnerSessionToken`, but the handlers still expect `partner_session_token` in query/body and legacy transport remains accepted through the global authentication stack. |
| Customer profile and booking routes | Wallet, bank, withdrawal, payment-proof, passport, complaint, request, and objection-response data | High | Partial | `/api/v1/` uses explicit permission classes, but global legacy auth still allows raw `session_token` transport in addition to `Authorization: Bearer/Token`. Uploaded passport, payment, and support files land in local media storage. |
| Admin approval, payment review, and payout flows | Cross-tenant mutations for partner approval, booking payment decisions, and receivable transfer | Critical | Partial | `management/approval_task.py` is staff-gated, but admin payloads still carry customer or partner session tokens to select the tenant records being changed. |
| Public catalog, docs, and media/static exposure | Anonymous package discovery plus optional schema and file exposure | Medium | Partial | Website package reads are intentionally public. `ENABLE_API_DOCS` exposes Swagger/ReDoc, and `SERVE_MEDIA_AND_STATIC_FROM_DJANGO` can expose uploaded media and static assets directly from Django. |
| Secrets and integration credentials | Local secret files, env-configured credentials, and third-party access | Critical | Open | `.env` exists locally and is git-ignored, but tracked `common/firebase.json` contains service-account material and `huz/settings.py` loads it by default. The same settings file also sources MySQL, SMTP, SMS, CORS, and operator-panel config from environment values. |

## Most Security-Critical Components
- `common/authentication.py`, `common/middleware.py`, and `common/permissions.py`
- `common/user_profile.py` and `common/serializers.py`
- `common/utility.py`
- `partners/partner_profile.py`
- `partners/partner_accounts_and_transactions.py`
- `partners/package_management.py` and `partners/serializers.py`
- `booking/serializers.py`
- `booking/manage_partner_booking.py`
- `management/approval_task.py`

## Concrete Exploit Chains
- Anonymous catalog read -> `partner_session_token` disclosure from public package serializers -> `/partner/manage_partner_bank_account/` attaches attacker payout details -> `/partner/manage_partner_withdraw_request/` debits the victim wallet. This is the fastest fully in-repo compromise path identified in this audit.
- Public customer or partner existence/profile lookups -> `session_token` or `partner_session_token` plus Firebase token disclosure -> replay against modern or legacy authenticated routes because the auth bridge still accepts those tokens.
- Known customer phone number -> deterministic `session_token` derivation -> replay against `/api/v1/users/me/*`, `/api/v1/bookings/*`, or legacy customer routes that still accept `session_token`.
- Cross-role booking read -> opposite-party token disclosure -> replay against partner booking mutations or customer routes while those tokens remain accepted as bearer-equivalent credentials.

## Recommended Containment Order
1. Rotate the tracked Firebase credential and invalidate or reissue exposed customer and partner session tokens.
2. Remove auth and device-token fields from public and cross-role serializers before any client-visible rollout.
3. Disable raw query/body token transport on finance, profile, and booking-mutation routes; keep temporary compatibility only where strictly necessary for a coordinated client migration.
4. Bind partner and customer mutations to authenticated principals only and stop resolving targets from caller-supplied tokens.
5. Add regression coverage for token disclosure, principal-binding, and production docs/media exposure flags.
