Perform a deep scan of the requested scope, write findings, and update the backlog. Report only first.

Compiled automation contract:
- Scope level: panel-fe
- Scope: Huz-Web-Frontend remaining unrevamped routes, remaining site pages, and safe cleanup
- Scope targets: Huz-Web-Frontend remaining unrevamped routes, remaining site pages, and safe cleanup
- Keep atlas, maps, and audit files synchronized with any implementation changes.

Large-task campaign contract (mandatory):
- Treat this as a multi-run execution campaign, not a one-shot rewrite.
- This run must complete one bounded implementation batch (target <= 8 pages or one backend domain).
- Keep frontend and backend contracts synchronized for touched flows.
- Update BUG_BACKLOG with completed items, deferred items, and the exact next batch recommendation.
- Include concrete verification commands and outcomes in RUN_SUMMARY for every batch.
- Do not claim full completion unless the backlog for this scope is explicitly clear.

Original user request: Start a full enhance campaign for the remaining unrevamped pages in Huz-Web-Frontend.

Workspace: /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz
Project: /Users/macbook/Desktop/Huz
Profile: HUZ
Scope: Huz-Web-Frontend remaining unrevamped routes, remaining site pages, and safe cleanup

Mandatory operating contract:
- Read /Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md first. It is reference-only, but it is the source of truth for the shared Huz shell, theme, layout, and responsive page system.
- Also inspect the already revamped reference implementations named in that guide. Treat them as completed reference pages, not pages to redesign again, unless a tiny shared-component alignment fix is strictly required.
- Read the existing workspace atlas, backlog, deep scan report, and previous completed run summary first, especially /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-062131-full-enhance/RUN_SUMMARY.md. Continue from the remaining batches instead of rescanning or redoing verified work.
- The previous bot missed site pages. This campaign must cover the remaining guide/holy-site pages and all other remaining unrevamped routes, including static site pages.

Primary goal:
- Revamp every remaining non-aligned page in Huz-Web-Frontend so it follows one consistent Huz theme across desktop and mobile using one responsive design system.
- Use reusable, modular, data-driven shared sections and templates instead of repeated page-specific JSX.
- Delete old, unused, dead, compatibility-only, or duplicate files only when route/import tracing proves they are safe to remove.
- Keep code aligned, sorted, efficient, modern React + JavaScript, and consistent with the already revamped pages.
- Improve performance where possible by consolidating repeated static/page families into shared abstractions, removing duplicate mobile/desktop trees where safe, and avoiding unnecessary component duplication.

Do not do these things:
- Do not run build.
- Do not run npm install.
- Do not modify lockfiles.
- Do not redesign the already aligned reference pages just for cosmetic experimentation.
- Do not keep obsolete wrappers after the canonical responsive route owner exists.

Already revamped references to follow and not rework unless required for a shared-system fix:
- Homepage
- ListingPage
- PackageDetailPage
- booking.jsx
- paymentMethods.jsx
- auth layout routes
- PersonalDetailsPage
- the already verified public/static pages from the previous run

Mandatory execution order:
1. FE-REV-003 guide and holy-site content family:
   - PreparationTips
   - TravelEssentials
   - UmrahGuide
   - MakkahHolySites
   - MadinahHolySites
   - JeddahHolySites
   - TaifHolySites
2. FE-REV-005 lead-gen and partner pages:
   - VisaServices
   - ContactUs
   - HajjUmrahBusiness
   - ListPackagePage
3. FE-REV-004 protected account shell convergence for the remaining non-aligned routes:
   - bookingstatus.jsx
   - datatable.jsx
   - remainingPayment.jsx
   - operatorresponse.jsx
   - payment&wallet.jsx
   - messagePage.jsx
   - wishlist.jsx
4. FE-REV-006 compatibility cleanup and dead file removal after the canonical owners are stable.

Implementation rules:
- Reuse BrandPageShell, homepage layout tokens, global surface classes, shared promo sections, and shared content abstractions.
- For guide/static/site-page families, consolidate repeated hero, article, related-card, city-guide, slider, CTA, and promo patterns into reusable modules.
- Preserve existing route paths, data flows, navigation behavior, and feature hooks unless a safer shared abstraction is required.
- One route, one responsive design. No separate mobile-vs-desktop page redesigns.
- Remove placeholder, dead, duplicate, or compatibility-only structures after migration.
- Keep workspace atlas docs, backlog, deep scan report, and run summary updated after each implementation batch.
- If a file is deleted, document exactly why it was safe.

Verification rules:
- No build.
- No install.
- No lockfile changes.
- Use route tracing, import tracing, parser validation, targeted lint/static checks, and explicit dead-file proof.
- Record concrete verification commands and outcomes in RUN_SUMMARY.

Definition of done:
- All remaining unrevamped Huz-Web-Frontend pages, including site/static pages, have been migrated onto the shared branded system or an equivalent reusable responsive abstraction.
- Unwanted and unused files that are proven dead are removed.
- The next prompt should only exist if there is truly remaining scoped work.

Global Instructions (always apply):
Always maintain full-system project memory in docs for the selected scope level.
Exclude non-dev and non-required files from deep mapping and auditing.
When code changes touch modules/routes/APIs/contracts/schema/security/state, refresh relevant atlas docs in the same run.
Keep audit findings traceable with status updates (open, fixed, verified) when remediation occurs.
For full-system or multi-panel fullstack scope, ensure frontend panels and backend structure/contracts are mapped together.
