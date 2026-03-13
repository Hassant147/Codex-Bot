# Module Map

Update this file whenever modules, folders, or responsibilities change.

## Top-Level Modules
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| Django project shell | `/Users/macbook/Desktop/Huz/Huz-Backend/huz` | Settings, root URL mounts, WSGI/ASGI bootstraps, optional docs/static serving | `huz/settings.py` is production-first; `huz/settings_test.py` swaps to SQLite for verification runs. |
| Shared user domain | `/Users/macbook/Desktop/Huz/Huz-Backend/common` | Customer identity, OTP, wallets, addresses, notifications, auth bridge, email/SMS/Firebase helpers | Mixed legacy and modern APIs; contains the session-token authentication bridge used by `/api/v1/`. |
| Partner domain | `/Users/macbook/Desktop/Huz/Huz-Backend/partners` | Partner onboarding, identity, services, package catalog, website package reads, partner wallets and withdrawals | Write path is split between modern operator views and older legacy modules. |
| Booking domain | `/Users/macbook/Desktop/Huz/Huz-Backend/booking` | Booking creation, payment/passport lifecycle, support flows, partner fulfillment, receivable tracking | Contains the current state machine and the largest cross-module coupling. |
| Back-office domain | `/Users/macbook/Desktop/Huz/Huz-Backend/management` | Company approvals, payment review, master hotel catalog, partner payout transfer | All routed views currently live in `approval_task.py`. |
| Email templates | `/Users/macbook/Desktop/Huz/Huz-Backend/huz/templates/emails` | Transactional email rendering for approval, booking, objection, complaint, payment, and verification flows | Driven through helper functions in `common/utility.py`. |

## Shared Platform and Auth
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| Session-token auth bridge | `/Users/macbook/Desktop/Huz/Huz-Backend/common/authentication.py` | Resolves Bearer/Token headers and legacy query/payload session tokens to customer or partner principals | Sets request auth context and drives `X-Auth-Deprecated` header when legacy token transport is used. |
| Auth helpers | `/Users/macbook/Desktop/Huz/Huz-Backend/common/auth_utils.py` | Resolves authenticated user/partner principals and admin checks | Used by the modern `/api/v1/` and newer operator views. |
| Custom permissions | `/Users/macbook/Desktop/Huz/Huz-Backend/common/permissions.py` | DRF permission classes for authenticated user and partner profile access | Keeps admin override behavior intact. |
| Legacy auth deprecation middleware | `/Users/macbook/Desktop/Huz/Huz-Backend/common/middleware.py` | Emits response headers when compatibility auth paths are used | Important for migration tracking away from query/payload tokens. |
| Shared utilities | `/Users/macbook/Desktop/Huz/Huz-Backend/common/utility.py` | File storage, email delivery, Firebase push, token generation, password hashing, validation helpers | Major integration boundary for SMTP, Firebase, and local media storage. |

## Common App Surface
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| User models | `/Users/macbook/Desktop/Huz/Huz-Backend/common/models.py` | `UserProfile`, customer wallet/bank/withdraw models, OTP, notifications, mailing detail | `UserProfile.session_token` is the modern customer auth root. |
| Legacy user APIs | `/Users/macbook/Desktop/Huz/Huz-Backend/common/user_profile.py` | Phone OTP, customer existence checks, account creation, photo upload, Firebase token update | Mixes `IsAdminUser` and `AllowAny`; still owns legacy customer onboarding. |
| Current-user APIs | `/Users/macbook/Desktop/Huz/Huz-Backend/common/api_v1.py` | `/api/v1/users/me/*` profile, address, wallet banks, withdrawals, and transactions | Uses modern auth bridge and more explicit serializers. |
| Shared serializers | `/Users/macbook/Desktop/Huz/Huz-Backend/common/serializers.py` | Serializer contracts for users, addresses, wallets, transactions, and validation helpers | Used by both legacy and modern user endpoints. |
| OTP throttling | `/Users/macbook/Desktop/Huz/Huz-Backend/common/throttling.py` | Rate limits public/admin OTP requests | `3/min` anonymous, `10/min` authenticated. |

## Partner App Surface
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| Partner models | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/models.py` | Partner identity, company/individual detail, partner financial state, package aggregate, date ranges, hotels, transport, airline, ziyarah | `HuzBasicDetail` is the core package aggregate; master hotels also reuse `HuzHotelDetail`. |
| Partner onboarding | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/partner_profile.py` | Login, existence checks, registration, company/individual profile capture, partner services, address, logo, password changes | Largely legacy and mostly `AllowAny`, with manual token resolution inside views. |
| Partner password reset | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/forgot_password.py` | Reset-token email flow for partner credentials | Depends on `OPERATOR_PANEL_BASE_URL` for reset links. |
| Modern operator package APIs | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/package_management_operator.py` | Authenticated partner package CRUD, range-aware package contracts, hotel media sync, partner package statistics | Current routed write path via `partners/views/operator_packages.py`. |
| Legacy package APIs | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/package_management.py` | Older operator package CRUD plus public website package discovery/read endpoints | Still necessary for website reads; duplicates some operator concepts and remains a refactor hazard. |
| Partner accounts and transactions | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/partner_accounts_and_transactions.py` | Partner bank accounts, withdrawal requests, transaction history, summary endpoints | Still declares `AllowAny` and resolves `partner_session_token` inside view methods. |
| Partner serializers | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/serializers.py` | Nested partner, package, hotel, date range, and financial serialization contracts | Flattens hotel images and computes package ratings and date-range expiry. |
| Operator package export shim | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/views/operator_packages.py` | Re-exports operator package view classes for routing | Routing seam that points `partners/urls.py` at the new package module. |
| Partner package seed command | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/management/commands/seed_huz_packages.py` | Generates realistic package/date-range/hotel/transport/ziyarah fixtures for dev and QA data seeding | Non-HTTP management command; can reuse an existing active partner or create a seed partner. |

## Booking App Surface
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| Booking models | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/models.py` | Booking, payment, passport, operator documents, ratings, complaints, requests, receivables | Booking status, issue status, hold expiry, and correction expiry all live on `Booking`. |
| Booking services | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/services.py` | Booking creation, payment upsert, passport validation, identifier lookup, duplicate booking checks, capacity enforcement | High-risk file with cross-domain side effects and transaction handling; current-user detail/payment/passport responses now reload through the preloaded detail queryset. |
| Booking workflow engine | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/workflow.py` | Pure state-machine decisions for lifecycle stages, payment gates, operator buckets, and expiry cleanup | Source of truth for status transitions across customer, operator, and admin flows. |
| Booking flow utility | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/flow_utils.py` | Shared traveller-count helper used by workflow and service layers | Keeps passport expectations aligned with lifecycle calculations. |
| Booking query helpers | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/querysets.py` | Payment annotations, effective status annotations, user buckets, operator buckets, capacity filters | Keeps list endpoints aligned with workflow state. |
| Booking request serializers | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/request_serializers.py` | Input contracts for booking create, payments, and passport updates | Normalizes ISO datetime and date payloads. |
| Booking serializers | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/serializers.py` | Customer, partner, and admin-facing booking detail contracts | Injects workflow-derived fields into response payloads. |
| Current-user booking routes | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/views/bookings.py` | Booking list/detail/create/delete and existing-booking lookup | Modern `/api/v1/` customer surface. |
| Current-user booking actions | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/views/api_v1.py` | Payments, passports, reviews, complaints, requests, and objection responses | Extends the booking viewset with custom DRF actions. |
| Current-user support reads | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/views/support.py` | Complaint and request list endpoints for the authenticated user | Read-only support history surface. |
| Partner booking operations | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/manage_partner_booking.py` | Booking queues, detail, operator action, fulfilment docs, arrangement detail, ratings, complaints, partner stats, payout visibility | Largest file in the repo and the highest collision risk for downstream changes; Phase 1 backend-optimize moved stats and rating summaries onto DB-side aggregates. |
| Timer command | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/management/commands/process_booking_timers.py` | Scheduled reconciliation of hold expiry, correction expiry, and post-travel completion | Acts like the project’s background lifecycle sweeper. |
| Workflow constants | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/statuses.py` | Booking, payment, issue, and workflow-bucket enums | Shared across services, serializers, queries, and admin endpoints. |

## Management App Surface
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| Admin task hub | `/Users/macbook/Desktop/Huz/Huz-Backend/management/approval_task.py` | Master hotels CRUD, company approvals, payment review queue, payout release, cache management | Contains both routed and currently unrouted admin endpoints; payment-review queue summary metadata now comes from consolidated filtered aggregates. |
| Management routes | `/Users/macbook/Desktop/Huz/Huz-Backend/management/urls.py` | Mounts the routed admin approval, payment, payout, and hotel endpoints | Does not currently mount `GetAllApprovedCompaniesView` or `ManageFeaturedPackageView`. |

## Testing and Verification Modules
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| Shared/user tests | `/Users/macbook/Desktop/Huz/Huz-Backend/common/tests.py` | OTP throttling, user creation rollback behavior, `/api/v1/users/me/*`, URL exposure, serializer query behavior | Confirms public docs toggle behavior and current-user API contracts. |
| Partner tests | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/tests.py` | Operator package flows, website package reads, partner wallet endpoint behavior | Exercises both operator and public package contracts. |
| Booking tests | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/tests.py` | Booking workflow validation, partner booking views, current-user detail prefetch regressions, and admin/partner query-budget checks | The strongest source of current booking lifecycle expectations, including focused verification for the Phase 1 backend-optimize paths. |

## Collision and Refactor Watchlist
| Module | Path | Responsibility | Notes |
| --- | --- | --- | --- |
| Legacy operator package logic | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/package_management.py` | Still holds package CRUD code similar to the new operator module | Do not refactor package contracts here without checking routed operator views. |
| Partner legacy auth endpoints | `/Users/macbook/Desktop/Huz/Huz-Backend/partners/partner_profile.py` | Manual token handling under `AllowAny` | Security-hardening lane should isolate these from modern auth work. |
| Booking lifecycle convergence | `/Users/macbook/Desktop/Huz/Huz-Backend/booking/services.py` and `/Users/macbook/Desktop/Huz/Huz-Backend/booking/workflow.py` | Shared state transitions used by customer, partner, and admin flows | Treat as a coordinated lane to avoid partial workflow changes. |
| Admin task monolith | `/Users/macbook/Desktop/Huz/Huz-Backend/management/approval_task.py` | Diverse admin concerns in a single file | Back-office changes should be batched carefully to avoid cache or payout regressions. |
