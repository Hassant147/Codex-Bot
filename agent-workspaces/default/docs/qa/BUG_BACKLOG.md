# Bug and Improvement Backlog

Use this backlog for prioritized follow-up work discovered during scans or implementation.

| ID | Priority | Module | Summary | Status | Verification |
| --- | --- | --- | --- | --- | --- |
| DS-001 | P1 | `src/context/AuthContextProvider.js`, `src/components/ProtectedRoute/ProtectedRoute.js` | `ProtectedRoute` depends on `loading`, but provider does not expose it in context, causing login-prompt race on protected routes during auth bootstrap. | Open | `nl -ba src/components/ProtectedRoute/ProtectedRoute.js` and `nl -ba src/context/AuthContextProvider.js`; confirm context value lacks `loading`. |
| DS-002 | P1 | `src/api/UserAuthApis.js`, `src/pages/Login/Login.js`, `src/pages/Login/mobile/login.jsx` | Login OTP path swallows non-404 existence-check errors and can call `sendOtp` twice, risking duplicate OTP sends and noisy auth failures. | Open | Inspect `checkUserExistence` catch branch (`throw` removed) and both login catch retries using `nl -ba` on listed files. |
| DS-003 | P1 | `src/api/apiService.js`, `src/features/bookingStatus/hooks/useBookingStatusData.js`, `src/features/travelersInfo/hooks/useTravelersInfoLogic.js` | `fetchBookingsByUser` silently returns `undefined` on API failures because `apiGet` normalizes errors instead of throwing, so UIs can misreport failures as empty booking state. | Open | Trace `apiGet` return contract and `fetchBookingsByUser` return path with `nl -ba src/api/apiService.js`; compare with booking/traveler consumer hooks expecting thrown errors. |
| DS-004 | P2 | `src/routes/AppRoutes.jsx` | Duplicate `/listing-page` route declarations (`ListingPage` and `ComingSoon`) create dead route ownership and ambiguous maintenance behavior. | Open | `grep -n "path=\"/listing-page\"" src/routes/AppRoutes.jsx` should return two lines. |
| DS-005 | P2 | `src/pages/PackageDetailPage/Mobile/*`, `src/features/booking/*` | Mobile booking drawer path is unreachable (`showBookingDrawer` never set true) and duplicates booking/pricing logic outside the active `features/booking` pipeline. | Open | `grep -n "showBookingDrawer" src/pages/PackageDetailPage/Mobile/PackageDetailMobilePage.jsx src/pages/PackageDetailPage/Mobile/components/Booking.jsx`; verify no setter-to-true trigger. |
| DS-006 | P2 | `src/pages/UserSetting/sidebar.jsx`, `src/components/Header/Header.js`, `src/routes/AppRoutes.jsx` | UI menus link to undefined routes (`/help`, `/reviews`, `/my-reviews`) that are not registered in app routes. | Open | `nl -ba src/pages/UserSetting/sidebar.jsx`, `nl -ba src/components/Header/Header.js`, and `grep -n "path=\"/help\\|/reviews\\|/my-reviews\"" src/routes/AppRoutes.jsx || true`. |
| DS-007 | P3 | `src/pages/Otp/Otp.js`, `src/services/api/httpClient.js`, `src/components/Header/Header.js` | Mixed token cookie keys (`authToken` vs `accessToken`/`refreshToken`) create stale auth artifacts and debugging confusion. | Open | Verify OTP sets `authToken` and transport/logout flow uses only app-token keys via `nl -ba` on listed files. |

## Phase 2 Prioritized Execution Plan (2026-03-05)

| Order | Batch | Backlog IDs | Actionable Implementation Focus | Verification Gate |
| --- | --- | --- | --- | --- |
| 1 | Critical auth and data integrity | `DS-001`, `DS-002`, `DS-003` | Expose auth loading contract, de-duplicate OTP trigger logic with explicit error propagation, and normalize booking-list error handling so failures surface consistently in consumers. | Run auth + booking smoke flows in browser and confirm failures show explicit error states (not false login prompts or empty-state masking). |
| 2 | Route contract cleanup | `DS-004`, `DS-006` | Remove duplicate `/listing-page` declaration and align header/sidebar targets with real route ownership (add routes or retarget links). | Validate route table uniqueness and click-path navigation for header/profile/sidebar entries. |
| 3 | Dead-flow and token-surface hardening | `DS-005`, `DS-007` | Remove or reintegrate dead mobile booking drawer path, and standardize token cookie lifecycle to one authoritative key set. | Confirm mobile package-detail booking path uses one active flow and token set/clear behavior is consistent across login/logout. |

## Phase 3 Verification Snapshot (2026-03-05)

- Revalidated `DS-001` through `DS-007` against current source (`grep -n` and `nl -ba` checks); all remain `Open`.
- Corrected stale reference context in the report/backlog evidence set by replacing non-existent `src/features/operatorResponse/hooks/useOperatorResponseLogic.js` with `src/pages/UserSetting/OperatorResponse/operatorresponse.jsx`.
- No new backlog IDs were created in Phase 3; prioritization order remains unchanged.
