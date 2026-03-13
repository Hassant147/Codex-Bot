# Routes and Entrypoints

Track frontend routes, backend route groups, entry components, and bootstrap paths here.

## Routes
- Last refreshed: 2026-03-05 (Phase 1 - Refresh Atlas Docs, run `20260305-152520-system-atlas`)

## Entrypoints
- React bootstrap: `src/index.js`
- App shell: `src/App.js`
- Route registry: `src/routes/AppRoutes.jsx`

## Public Routes
| Route | Entry Component |
| --- | --- |
| `/` | `pages/HomePage/HomePage` |
| `/signup` | `pages/Signup/Signup` |
| `/login` | `pages/Login/Login` |
| `/otp` | `pages/Otp/Otp` |
| `/listing-page` | `pages/ListingPage/ListingPage` |
| `/listing-page` (duplicate declaration) | `pages/ComingSoon/ComingSoon` |
| `/package-detail-page` | `pages/PackageDetailPage/PackageDetailPage` |
| `/visa-services` | `pages/VisaServices/VisaServices` |
| `/Hajj-Guidance` | `pages/HajjGuidance/HajjGuidance` |
| `/Umrah-Guidance` | `pages/UmrahGuide/UmrahGuide` |
| `/browse-tips` | `pages/PreparationTips/PreparationTips` |
| `/travel-essential` | `pages/TravelEssentials/TravelEssentials` |
| `/makkah-holy-sites` | `pages/MakkahHolySites/MakkahHolySites` |
| `/madina-holy-sites` | `pages/MadinahHolySites/MadinahHolySites` |
| `/jeddah-holy-sites` | `pages/JeddahHolySites/JeddahHolySites` |
| `/taif-holy-sites` | `pages/TaifHolySites/TaifHolySites` |
| `/about-us` | `pages/AboutUs/AboutUs` |
| `/core-values` | `pages/CoreValues/CoreValues` |
| `/how-we-work` | `pages/HowWeWork/HowWeWork` |
| `/hajjUmrah-partner` | `pages/HajjUmrahBusiness/HajjUmrahBusiness` |
| `/frequently-asked-questions` | `pages/FrequentlyAskedQuestions/FQA` |
| `/terms-services` | `pages/TermsServices/TermsServices` |
| `/privacy-policy` | `pages/PrivacyPolicy/PrivacyPolicy` |
| `/refund-policy` | `pages/PolicyPages/PolicyPages` |
| `/cancellation-policy` | `pages/PolicyPages/PolicyPages` |
| `/contact` | `pages/ContactUs/ContactUs` |
| `/Media` | `pages/GenericPages/GenericPages` |
| `/career` | `pages/GenericPages/GenericPages` |

## Protected Routes (`ProtectedRoute`)
| Route | Entry Component |
| --- | --- |
| `/bookings` | `pages/UserSetting/MyApplication/Booking/booking` |
| `/payment-methods` | `pages/UserSetting/PaymentMethods/paymentMethods` |
| `/data-table` | `pages/UserSetting/Datatable/datatable` |
| `/personal-details` | `pages/UserSetting/PersonalDetailsPage` |
| `/list-your-packages` | `pages/ListPackagePage/ListPackagePage` |
| `/booking-page` | `pages/PackageDetailPage/Mobile/components/invoice` |
| `/operator-response` | `pages/UserSetting/OperatorResponse/operatorresponse` |
| `/remaining-payment` | `pages/UserSetting/RemainingPayment/remainingPayment` |
| `/payment-wallet` | `pages/UserSetting/Payment&Wallet/payment&wallet` |
| `/payment-wallet-mobile` | `pages/UserSetting/Payment&Wallet/Mobile/paymentwallet` |
| `/wishlist` | `pages/UserSetting/Wishlist/index` |
| `/booking-status` | `pages/UserSetting/MyApplication/Booking/bookingstatus` |
| `/messages` | `pages/UserSetting/Message/messagePage` |
| `/messages-chat` | `pages/UserSetting/Message/messagechat` |

## Navigation Targets With No Matching Route Entry
- `/my-reviews` (header profile menu target in `src/components/Header/Header.js`)
- `/help` and `/reviews` (user settings sidebar links in `src/pages/UserSetting/sidebar.jsx`)

## Routing Notes
- Router mode: `BrowserRouter` in `src/App.js`.
- Route components are lazy-loaded in `AppRoutes` and wrapped by top-level `Suspense` in `App.js`.
- `ScrollToTop` is mounted globally from `src/Utilities/UtilityFunctions.js`.
- Discovery query params are route-coupled:
  - Homepage search writes `/listing-page?departureLocation=...&departureDate=...`.
  - Listing additionally supports `type` (`Hajj`/`Umrah`) from nav links.
- Package detail depends on URL query param `PackageId` (`/package-detail-page?PackageId=...`).
- No wildcard (`*`) fallback route is currently declared in `AppRoutes`.
