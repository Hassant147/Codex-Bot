Continue the large enhancement campaign in one bounded batch.

Campaign objective: Start a full enhance implementation campaign now for all remaining pages in Huz-Web-Frontend.

Workspace: /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz
Project: /Users/macbook/Desktop/Huz
Profile: HUZ
Scope: all remaining unrevamped Huz-Web-Frontend pages, remaining site pages, account pages, and proven-safe cleanup

This is a large project-wide frontend redesign and implementation mission across 20+ pages. Do not treat it as report-only work.

Mandatory operating contract:
- Read /Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md first and use it as the source of truth for the shared Huz shell, theme, layout, and responsive page system.
- Inspect the already revamped reference implementations named in that guide. Treat them as completed references, not pages to redesign again, unless a tiny shared-system alignment fix is strictly required.
- Read the existing workspace atlas, backlog, analysis report, and the previous completed run summary at /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-062131-full-enhance/RUN_SUMMARY.md. Continue from the remaining batches instead of redoing verified work.
- The previous bot missed site pages. This campaign must finish the remaining guide/holy-site pages and all other remaining unrevamped routes, including static site pages.

Primary goal:
- Revamp all remaining non-aligned pages in Huz-Web-Frontend so they follow one consistent Huz theme across desktop and mobile using one responsive design system.
- Implement reusable, modular, data-driven shared sections and templates instead of repeated page-specific JSX.
- Delete old, unused, dead, compatibility-only, or duplicate files only when route/import tracing proves they are safe to remove.
- Keep code aligned, sorted, efficient, modern React + JavaScript, and consistent with the already revamped pages.
- Improve runtime and maintainability by consolidating repeated static/page families into shared abstractions, removing duplicate mobile/desktop trees where safe, and avoiding unnecessary component duplication.

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
3. FE-REV-004 protected account shell convergence:
   - bookingstatus.jsx
   - datatable.jsx
   - remainingPayment.jsx
   - operatorresponse.jsx
   - payment&wallet.jsx
   - messagePage.jsx
   - wishlist.jsx
4. FE-REV-006 compatibility cleanup and dead file removal after canonical owners are stable.

Implementation rules:
- Reuse BrandPageShell, homepage layout tokens, global surface classes, shared promo sections, and shared content abstractions.
- For guide/static/site-page families, consolidate repeated hero, article, related-card, city-guide, slider, CTA, and promo patterns into reusable modules.
- Preserve existing route paths, data flows, navigation behavior, and feature hooks unless a safer shared abstraction is required.
- One route, one responsive design. No separate mobile-vs-desktop page redesigns.
- Remove placeholder, dead, duplicate, or compatibility-only structures after migration.
- Keep workspace atlas docs, backlog, report files, and run summary updated after each implementation batch.
- If a file is deleted, document exactly why it was safe.

Hard constraints:
- No build.
- No npm install.
- No lockfile changes.
- No cosmetic redesign of already aligned reference pages.
- Use route tracing, import tracing, parser validation, targeted lint/static checks, and explicit dead-file proof.
- Record concrete verification commands and outcomes in RUN_SUMMARY.
Campaign ID: campaign-1772963821265-l5wabj
Batch index: 2
Previous run: /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-145701-full-enhance

Follow-up contract:
- Read BUG_BACKLOG and atlas docs first.
- Implement only one bounded batch (target <= 8 pages or one backend domain).
- Keep frontend/backend contracts synchronized for touched flows.
- Mark completed/deferred items in BUG_BACKLOG and name the next recommended batch.
- Refresh atlas docs and append verification evidence in RUN_SUMMARY.
- If backlog in this scope is already clear, produce verification-only summary and stop without unrelated edits.

Scope override: all remaining unrevamped Huz-Web-Frontend pages, remaining site pages, account pages, and proven-safe cleanup
Scope targets: all remaining unrevamped Huz-Web-Frontend pages, remaining site pages, account pages, and proven-safe cleanup

Global Instructions (always apply):
Always maintain full-system project memory in docs for the selected scope level.
Exclude non-dev and non-required files from deep mapping and auditing.
When code changes touch modules/routes/APIs/contracts/schema/security/state, refresh relevant atlas docs in the same run.
Keep audit findings traceable with status updates (open, fixed, verified) when remediation occurs.
For full-system or multi-panel fullstack scope, ensure frontend panels and backend structure/contracts are mapped together.
