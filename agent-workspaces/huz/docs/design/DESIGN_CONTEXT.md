# Design Context

Use this doc to track which design guides, reference modules, and design constraints apply to a revamp run.

## Active Guides
- `/Users/macbook/Desktop/Huz/UI_DESIGN_SYSTEM_GUIDE.md`
  - Preserve the premium brand language: depth, hierarchy, feedback, white card surfaces, green trust tones, and gold emphasis for primary actions.
  - Avoid flat or placeholder-looking sections; the dominant content block should always read as intentional and premium.
- `/Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md`
  - `BrandPageShell` is the shell contract for branded routes. Do not manually rebuild `Header`, `Footer`, background wrappers, or promo wrappers.
  - Keep one responsive design per route. No separate mobile and desktop page trees for the same public page.
  - Reuse `homepageLayout.js` tokens and the existing shared surface classes instead of creating route-specific shell variants.

## Run 20260310-055033 - Phase 0 - Load Design Context

### Scope
- Target project: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`
- Scoped directory: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/pages`
- Requested public/static/legal family:
  - `/about-us` -> `src/pages/AboutUs/AboutUs.jsx`
  - `/core-values` -> `src/pages/CoreValues/CoreValues.jsx`
  - `/how-we-work` -> `src/pages/HowWeWork/HowWeWork.jsx`
  - `/hajjUmrah-partner` -> `src/pages/HajjUmrahBusiness/HajjUmrahBusiness.jsx`
  - `/career` -> `src/pages/GenericPages/GenericPages.jsx` via `features/staticPages/content/genericPagesContent.js`
  - `/travel-essential` -> `src/pages/TravelEssentials/TravelEssentials.jsx`
  - `/visa-services` -> `src/pages/VisaServices/VisaServices.jsx`
  - `/frequently-asked-questions` -> `src/pages/FrequentlyAskedQuestions/FQA.jsx`
  - `/terms-services` -> `src/pages/TermsServices/TermsServices.jsx`
  - `/privacy-policy` -> `src/pages/PrivacyPolicy/PrivacyPolicy.jsx`
  - `/refund-policy` and `/cancellation-policy` -> `src/pages/PolicyPages/PolicyPages.jsx` via `features/staticPages/content/policyPagesContent.js`
  - `/contact` -> `src/pages/ContactUs/ContactUs.jsx`
- Route label mismatches already present in shared chrome:
  - Footer "Travel Articles" currently points to `/makkah-holy-sites`, not to `/travel-essential`.
  - Footer "Help Center" currently points to `/contact`.
  - `/help` is a protected account-support history route and is not a public marketing/help-center destination.

### Shared Architecture and Dependencies
- Shell contract:
  - `src/shared/layout/BrandPageShell.jsx` owns header/footer placement, shared background, max-width shell, optional hero, optional pre-footer, and optional ambient effects.
  - `src/pages/HomePage/homepageLayout.js` supplies the width and section-spacing tokens that branded public pages should reuse.
- Shared public content systems:
  - `src/features/staticPages/StaticContentPage.jsx` is the base system for hero blocks, content sections, metric/feature grids, FAQ sections, support sections, and the legal-page wrapper.
  - `src/features/marketingPages/MarketingPageSections.jsx` layers branded hero-asides, timelines, action banners, and lead-capture sections on top of the static-page system.
  - `src/features/pilgrimageGuides/GuideArticlePage.jsx` owns the travel-article structure used by `/travel-essential`.
- Route-level dependencies that must remain intact:
  - `VisaServices.jsx` and `ContactUs.jsx` save browser-local inquiry drafts through `features/marketingPages/leadCaptureDrafts.js`; these routes do not submit network requests.
  - `HajjUmrahBusiness.jsx` keeps intentional CTA routing to `/list-your-packages` and outbound `https://operator.hajjumrah.co/`.
  - `PolicyPages.jsx` and `GenericPages.jsx` are route-driven wrappers keyed off `useLocation()`, so content changes should stay in the content modules when possible.
  - `AppRoutes.jsx` is the canonical source for public path ownership; `Footer.js` is the canonical source for footer label/destination drift that planning must address.
- API and backend boundary:
  - The scoped routes are content-first surfaces. Current atlas state shows no backend contract changes are required for this revamp batch.
  - The only non-trivial behavior in scope is browser-local lead draft persistence on contact/visa routes, which must be preserved.

### Strongest Reference Modules
- Shared shell and rhythm references:
  - `src/pages/HomePage/HomePage.js`
  - `src/pages/ListingPage/ListingPage.js`
  - `src/pages/PackageDetailPage/PackageDetailPage.js`
  - `src/pages/HajjGuidance/HajjGuidance.jsx`
- Shared implementation references inside the scoped family:
  - `src/features/staticPages/StaticContentPage.jsx`
  - `src/features/marketingPages/MarketingPageSections.jsx`
  - `src/features/pilgrimageGuides/GuideArticlePage.jsx`

### Intended Visual Direction
- Keep the homepage design system as the visual source of truth:
  - white dominant content surfaces
  - restrained green trust tones and gold premium accents
  - clear section hierarchy with stronger hero framing and tighter page rhythm
  - less dead space and fewer placeholder-feeling sections
- The requested family should feel like one credible public information system, not a mix of separate microsites.
- Prefer shared content modules and shared primitives over bespoke page-local markup.
- Continue the existing route-level shell convergence rather than inventing another public-page shell.

### Non-Negotiable UX and Product Constraints
- Use `BrandPageShell` and the shared static/marketing/guide systems. Do not manually compose `Header`, `Footer`, duplicate background wrappers, or create alternative desktop-only shells.
- Preserve existing public route paths unless a route migration is explicitly approved in a later phase.
- Keep one information hierarchy per route across breakpoints. Responsive adaptation is allowed; separate mobile page designs are not.
- Preserve current route behaviors:
  - local draft persistence on `/visa-services` and `/contact`
  - partner CTA routing on `/hajjUmrah-partner`
  - route-driven content lookup for `PolicyPages` and `GenericPages`
  - protected ownership of `/help`
- Plan around footer label drift instead of assuming labels already map to the correct destinations.

### Content and Credibility Risks Driving the Revamp
- `HowWeWork` still includes off-brand Spendesk/team-wallet workflow copy and needs a full content rewrite, not only visual cleanup.
- `AboutUs` includes inflated or unverifiable ecosystem stats that read as demo content rather than credible product copy.
- `CoreValues` contains brand-name typos (`Huzzumrah.co`, `Hajjumrah.co`) that weaken credibility.
- `FrequentlyAskedQuestions` is currently vendor-dashboard focused, while the requested family needs stronger public/help/travel guidance positioning.
- `PrivacyPolicy` still contains inherited generic/crypto-oriented legal language (`bitcoin`, `Digital Assets`) that does not read as Huz-specific.
- `TermsServices` still carries large blocks of generic inherited terms copy and needs editorial hardening to match the current Huz product story.
- Footer labeling currently implies route destinations that the app does not actually expose as public equivalents ("Travel Articles", "Help Center"), so Phase 1 planning must define intentional destination mapping before UI polish work starts.

## Run 20260310-055033 - Phase 1 - Plan the Revamp

### Phase 2 Scope Lock
- Keep implementation inside the existing public route owners and content systems under `src/pages`, `src/features/staticPages`, `src/features/marketingPages`, `src/features/pilgrimageGuides`, plus shared chrome in `src/components/Footer/Footer.js`.
- Do not introduce backend/API contract work in this revamp batch. Preserve the current public paths and do not create a public `/help` alias.
- Keep `BrandPageShell`, `StaticContentPage`, `StaticLegalPage`, and `GuideArticlePage` as the shell/layout owners. Do not create another public-page shell or separate desktop/mobile JSX trees.

### Canonical Destination Decisions
- Treat `/travel-essential` as the canonical public route for the footer’s travel-content destination and align the footer label to `Travel Essentials` so it matches the homepage card and live page title.
- Treat `/frequently-asked-questions` as the public help-center landing route and keep `/contact` as the escalation route. Do not route public users to protected `/help`.
- Keep the holy-site city routes (`/makkah-holy-sites`, `/madina-holy-sites`, `/jeddah-holy-sites`, `/taif-holy-sites`) dedicated to city guides rather than repurposing them as the generic article landing.

### Planned File Groups and Change Types
- Shared chrome:
  - `src/components/Footer/Footer.js`
  - Fix the travel/help link destinations and copy so shared navigation matches the exposed public routes.
- Company and story surfaces:
  - `src/pages/AboutUs/AboutUs.jsx`
  - `src/pages/CoreValues/CoreValues.jsx`
  - `src/pages/HowWeWork/HowWeWork.jsx`
  - `src/features/staticPages/content/howWeWorkContent.js`
  - `src/features/staticPages/content/genericPagesContent.js` for `/career`
  - Replace inflated/demo copy, correct brand naming, remove inherited Spendesk workflow text, and tighten the number of sections without changing the shell contract.
- Help and guide surfaces:
  - `src/pages/FrequentlyAskedQuestions/FQA.jsx`
  - `src/features/pilgrimageGuides/content/guideArticlesContent.js` for `/travel-essential`
  - Add a dedicated FAQ/help-center content module under `src/features/staticPages/content/` so the traveller-facing question set is durable and route-driven instead of inline.
  - Reposition the FAQ route as the public help-center/knowledge-base surface and keep `TravelEssentials.jsx` as a thin wrapper over the guide template.
- Lead and partner surfaces:
  - `src/pages/HajjUmrahBusiness/HajjUmrahBusiness.jsx`
  - `src/pages/VisaServices/VisaServices.jsx`
  - `src/pages/ContactUs/ContactUs.jsx`
  - `src/features/marketingPages/content/marketingPagesContent.js`
  - Preserve browser-local lead-draft persistence and existing CTA destinations while rewriting copy, tightening hierarchy, and removing placeholder-feeling metrics where needed.
- Legal and policy surfaces:
  - `src/pages/TermsServices/TermsServices.jsx`
  - `src/pages/PrivacyPolicy/PrivacyPolicy.jsx`
  - `src/pages/PolicyPages/PolicyPages.jsx`
  - `src/features/staticPages/content/policyPagesContent.js`
  - Move the current large inline Terms/Privacy bodies into structured content data so the copy can be rewritten cleanly inside `StaticLegalPage` without keeping 600-1300 line JSX documents in the route owners.

### Shared Primitive Plan
- Reuse the current primitives as the main implementation surface:
  - `StaticHeroSection`
  - `StaticTextSection`
  - `StaticFeatureGridSection`
  - `StaticMetricGridSection`
  - `StaticFaqSection`
  - `StaticLegalPage`
  - `MarketingHeroAside`
  - `MarketingLeadCaptureSection`
  - `MarketingTimelineSection`
  - `GuideArticlePage`
- Do not broaden the scope with a new shell or route wrapper.
- Only change `src/features/staticPages/StaticContentPage.jsx` if implementation proves a repeated need for a compact help/legal variant across multiple scoped routes; otherwise keep the primitive stable and solve the revamp through content/module updates.

### Reference Mapping For Phase 2
- `src/pages/HomePage/HomePage.js` and `src/pages/HomePage/homepageLayout.js`
  - Use as the source of truth for section rhythm, shell width, white-surface dominance, and CTA density.
- `src/pages/ListingPage/ListingPage.js` and `src/pages/PackageDetailPage/PackageDetailPage.js`
  - Use as references for denser hierarchy, stronger content grouping, and side-panel balance without adding dead space.
- `src/pages/HajjGuidance/HajjGuidance.jsx` and `src/features/pilgrimageGuides/GuideArticlePage.jsx`
  - Use as the travel-article reading reference for `/travel-essential`.
- `src/features/marketingPages/MarketingPageSections.jsx`
  - Keep the hero-aside, lead-capture, timeline, and action-banner patterns instead of inventing a second marketing-page system.

### Planned Phase 2 Execution Order
1. Correct shared IA and footer drift:
   - fix footer destinations/copy,
   - lock FAQ as the public help-center route,
   - confirm the protected ownership of `/help`.
2. Rewrite the company, careers, guide, FAQ, contact, visa, and partner content modules/components inside the existing shared systems.
3. Restructure Terms and Privacy into structured content modules, then refresh Refund and Cancellation tone so the legal family reads like one system.
4. Simplify any route owners that still hold oversized inline copy so they consume the revised content modules cleanly.

### Verification Targets For Later Phases
- Run `npm run build` in `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`.
- Manually smoke-check:
  - `/about-us`
  - `/core-values`
  - `/how-we-work`
  - `/hajjUmrah-partner`
  - `/career`
  - `/travel-essential`
  - `/visa-services`
  - `/frequently-asked-questions`
  - `/terms-services`
  - `/privacy-policy`
  - `/refund-policy`
  - `/cancellation-policy`
  - `/contact`
- Explicitly verify:
  - footer link destinations after relabeling,
  - FAQ/help-center escalation to `/contact`,
  - browser-local draft persistence on `/visa-services` and `/contact`,
  - partner CTA routing to `/list-your-packages` and `https://operator.hajjumrah.co/`,
  - no accidental public exposure of protected `/help`.
- The target repo is already dirty in unrelated API/account surfaces, including shared files like `AppRoutes.jsx` and `Header.js`, so Phase 2 must stay scoped and read shared files carefully before editing.

## Run 20260310-055033 - Phase 2 - Implement the Revamp

### IA and Shared-System Decisions Applied
- Updated shared footer IA so the live public travel/help labels now match the intended destinations:
  - `Travel Essentials` -> `/travel-essential`
  - `Help Center` -> `/frequently-asked-questions`
- Kept protected `/help` untouched as the signed-in support-history route; no public `/help` alias was introduced.
- Preserved the existing shell contract:
  - `BrandPageShell`
  - `StaticContentPage`
  - `StaticLegalPage`
  - `GuideArticlePage`
  - `MarketingPageSections`

### Content-System Implementation
- Added dedicated shared content modules for the company/help/legal surfaces:
  - `src/features/staticPages/content/companyPagesContent.js`
  - `src/features/staticPages/content/helpCenterContent.js`
  - `src/features/staticPages/content/legalPagesContent.js`
- Rewrote `AboutUs`, `CoreValues`, `HowWeWork`, `Career`, `Refund Policy`, `Cancellation Policy`, and the public FAQ/help-center content to sound like a real Huz product/property instead of placeholder, vendor-dashboard, or meta-revamp copy.
- Rewrote `VisaServices`, `ContactUs`, and `HajjUmrahBusiness` content to stay user-facing while preserving local draft persistence and existing CTA handoffs.
- Refreshed `/travel-essential` article content so the public travel route reads like the canonical packing/preparation destination linked from the footer and homepage.

### Legal and Help-Center Structure Changes
- Replaced the oversized inherited inline JSX in `TermsServices.jsx` and `PrivacyPolicy.jsx` with structured legal content rendered through the new shared `StaticLegalDocument` helper in `StaticContentPage.jsx`.
- Repositioned `/frequently-asked-questions` as the public help-center/knowledge-base route with traveller-facing FAQ content, search, and escalation guidance to `/contact`.
- Kept `PolicyPages.jsx` route-driven and refreshed only the shared policy content module; no route migration was required.

### Constraints Preserved
- No route paths changed.
- No backend/API work was introduced.
- `VisaServices.jsx` and `ContactUs.jsx` still save browser-local drafts only.
- `HajjUmrahBusiness.jsx` still routes to `/list-your-packages` and `https://operator.hajjumrah.co/`.
- Verification/build work is intentionally deferred to Phase 3 per the run contract.

## Run 20260310-055033 - Phase 3 - Verify UX and Responsiveness

### Verification Summary
- Ran `npm run build` in `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`, then reran it after a scoped warning cleanup in `src/features/staticPages/content/helpCenterContent.js`; the final build passed with only unrelated warnings from `src/pages/PackageDetailPage/components/LeftColumn/Itinerary.js` plus the stale `caniuse-lite` notice.
- Used Playwright against the local dev server to sweep `/about-us`, `/core-values`, `/how-we-work`, `/hajjUmrah-partner`, `/career`, `/travel-essential`, `/visa-services`, `/frequently-asked-questions`, `/terms-services`, `/privacy-policy`, `/refund-policy`, `/cancellation-policy`, and `/contact` at `390x844`, `820x1180`, and `1440x1200`.
- The responsive sweep found no horizontal overflow, no route-level page errors, and no drift in the updated footer destinations: `Travel Essentials` still targets `/travel-essential`, `Help Center` still targets `/frequently-asked-questions`, and `Contact Us` still targets `/contact`.

### Behavior Checks
- Verified unauthenticated `/help` still resolves to the auth gate (`Login before booking`), so the public FAQ/help-center revamp did not expose the protected account support route.
- Submitted the public `/contact` and `/visa-services` forms in-browser and confirmed each route saves a draft under `localStorage["huz:marketingLeadDrafts"]`, shows the expected local-only confirmation message, and clears the form fields after submit.
- Verified the HajjUmrah.co Business CTAs still preserve the intended handoffs: internal routing to `/list-your-packages` and external new-tab access to `https://operator.hajjumrah.co/`.

### Phase 3 Adjustment
- Removed the unused `Mail` icon import from `src/features/staticPages/content/helpCenterContent.js` so the revamp batch no longer contributes its own eslint build warning.
- No additional design drift, route issues, or API/ownership regressions were found in this phase.

## Run 20260310-055033 - Phase 4 - Refresh Docs and Summary

### Durable Closeout Notes
- This phase stayed docs-only and finalized the durable handoff after the verified public-route revamp.
- Final design-system outcome for the scoped family:
  - the route family now reads as one branded public information system built on `BrandPageShell`, `StaticContentPage`, `StaticLegalPage`, `MarketingPageSections`, and `GuideArticlePage`
  - footer IA is intentionally aligned to the live public routes: `Travel Essentials` -> `/travel-essential`, `Help Center` -> `/frequently-asked-questions`, `Contact Us` -> `/contact`
  - protected `/help` remains outside the public marketing/help-center family
- The strongest reusable implementation references for future related runs are now:
  - `src/features/staticPages/content/companyPagesContent.js`
  - `src/features/staticPages/content/helpCenterContent.js`
  - `src/features/staticPages/content/legalPagesContent.js`
  - `src/features/staticPages/StaticContentPage.jsx` via `StaticLegalDocument`
  - `src/features/marketingPages/content/marketingPagesContent.js`
  - `src/features/pilgrimageGuides/content/guideArticlesContent.js`

### Final Verification Snapshot
- Verified closeout relies on the already-passed Phase 3 checks:
  - `npm run build` passed in `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`
  - Playwright responsive sweeps passed across the 13 scoped public routes at mobile, tablet, and desktop widths
  - local draft persistence remained intact on `/contact` and `/visa-services`
  - partner CTA handoffs remained intact on `/hajjUmrah-partner`
  - unauthenticated `/help` still hit the auth gate
- No additional verification commands were required in this docs finalization phase.
