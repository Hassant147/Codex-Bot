Implement FE-REV-005 as one bounded single-agent batch.

Target backlog item:
- FE-REV-005 | Lead-gen and partner pages

Scope:
- /Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/pages/VisaServices/VisaServices.jsx
- /Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/pages/ContactUs/ContactUs.jsx
- /Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/pages/HajjUmrahBusiness/HajjUmrahBusiness.jsx
- /Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/pages/ListPackagePage/ListPackagePage.js

Required outcomes:
- Align these pages to the Huz design system and shared shell patterns.
- Preserve intentional CTA destinations and outbound partner links.
- Replace placeholder local-submit behavior and inert CTA behavior only with deliberate, documented behavior changes.
- Do not introduce accidental new network side effects.
- Keep the batch single-agent and bounded to this scope only.

Verification requirements:
- Route tracing for touched paths.
- Import tracing for shared-shell adoption.
- Frontend build or equally strong scoped verification if the run decides a build is not necessary.
- Update BUG_BACKLOG and RUN_SUMMARY with exact outcomes and the next recommended batch.
