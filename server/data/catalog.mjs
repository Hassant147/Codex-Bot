export const TAB_CATALOG = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'create-run', label: 'Create Run' },
  { id: 'history', label: 'History' },
  { id: 'agents', label: 'Agents' },
  { id: 'cli', label: 'Codex CLI' },
  { id: 'chat', label: 'Chat' },
  { id: 'settings', label: 'Settings' }
];

export const SCOPE_LEVELS = [
  { id: 'module', label: 'Module' },
  { id: 'panel-fe', label: 'Panel Frontend' },
  { id: 'panel-be', label: 'Panel Backend' },
  { id: 'panel-fullstack', label: 'Panel Fullstack' },
  { id: 'multi-panel-fe', label: 'Multi-Panel Frontend' },
  { id: 'multi-panel-fullstack', label: 'Multi-Panel Fullstack' },
  { id: 'full-system', label: 'Full System' }
];

export const QUALITY_PRESETS = [
  { id: 'max-codex', label: 'Max Codex', effort: 'high', maxCycles: 12, quiet: true },
  { id: 'max-quality', label: 'Max Quality', effort: 'xhigh', maxCycles: 18, quiet: true },
  { id: 'balanced', label: 'Balanced', effort: 'high', maxCycles: 10, quiet: true },
  { id: 'fast-sweep', label: 'Fast Sweep', effort: 'medium', maxCycles: 6, quiet: true }
];

export const MODE_CATALOG = [
  {
    id: 'system-atlas',
    label: 'System Atlas',
    summary: 'Refresh the master project map for future runs.',
    bestFor: 'Blueprint refreshes, onboarding, architecture understanding.'
  },
  {
    id: 'full-system-atlas',
    label: 'Full System Atlas',
    summary: 'Map all configured frontend and backend surfaces together.',
    bestFor: 'Cross-surface onboarding and architecture recovery.'
  },
  {
    id: 'deep-scan',
    label: 'Deep Scan',
    summary: 'Analyze code and write findings plus backlog without changing code.',
    bestFor: 'Report-only audits and pre-implementation analysis.'
  },
  {
    id: 'full-system-deep-audit',
    label: 'Full System Deep Audit',
    summary: 'Audit frontend, backend, contracts, security, and performance together.',
    bestFor: 'Large modernization and quality campaigns.'
  },
  {
    id: 'plan-batch',
    label: 'Plan Batch',
    summary: 'Write the next safe implementation batch from the backlog.',
    bestFor: 'Breaking large work into clear execution packets.'
  },
  {
    id: 'fix-backlog',
    label: 'Fix Backlog',
    summary: 'Pick the next backlog item, implement it, and verify it.',
    bestFor: 'Bug fixing and bounded repair loops.'
  },
  {
    id: 'feature-delivery',
    label: 'Feature Delivery',
    summary: 'Implement a requested feature with verification and doc refresh.',
    bestFor: 'New features and flow changes.'
  },
  {
    id: 'contract-sync',
    label: 'Contract Sync',
    summary: 'Find and fix frontend/backend API mismatches.',
    bestFor: 'Contract drift and payload mismatch cleanup.'
  },
  {
    id: 'design-revamp',
    label: 'Design Revamp',
    summary: 'Revamp a page or module using saved design guides.',
    bestFor: 'UX upgrades and page redesigns.'
  },
  {
    id: 'ui-parity',
    label: 'UI Parity',
    summary: 'Match one page or module to a stronger reference module.',
    bestFor: 'Consistency work across panels.'
  },
  {
    id: 'performance-pass',
    label: 'Performance Pass',
    summary: 'Run a targeted performance and bundle optimization pass.',
    bestFor: 'Speed, bundle, and render cleanup.'
  },
  {
    id: 'responsive-hardening',
    label: 'Responsive Hardening',
    summary: 'Audit and fix desktop/tablet/mobile layout issues.',
    bestFor: 'Layout quality and device-fit improvements.'
  },
  {
    id: 'dead-code-prune',
    label: 'Dead Code Prune',
    summary: 'Remove proven-unused files and code safely.',
    bestFor: 'Codebase cleanup and size reduction.'
  },
  {
    id: 'test-hardening',
    label: 'Test Hardening',
    summary: 'Strengthen tests around risky or recently changed areas.',
    bestFor: 'Confidence after refactors and bug fixes.'
  },
  {
    id: 'regression-hunt',
    label: 'Regression Hunt',
    summary: 'Check recent changes for regressions and fix them.',
    bestFor: 'Post-change confidence sweeps.'
  },
  {
    id: 'release-gate',
    label: 'Release Gate',
    summary: 'Run release-readiness checks and return a go/no-go verdict.',
    bestFor: 'Pre-release validation.'
  },
  {
    id: 'backend-audit',
    label: 'Backend Audit',
    summary: 'Analyze backend routes, services, and risks.',
    bestFor: 'Server-side health reviews.'
  },
  {
    id: 'backend-optimize',
    label: 'Backend Optimize',
    summary: 'Improve backend performance and reduce duplication.',
    bestFor: 'Heavy server-side cleanup and speed improvements.'
  },
  {
    id: 'security-audit',
    label: 'Security Audit',
    summary: 'Inspect auth, permissions, inputs, and risky flows.',
    bestFor: 'Security reviews.'
  },
  {
    id: 'migration-batch',
    label: 'Migration Batch',
    summary: 'Run a structured refactor in safe bounded batches.',
    bestFor: 'Architecture migrations and large renames.'
  },
  {
    id: 'project-summary',
    label: 'Project Summary',
    summary: 'Produce a concise current-state project summary.',
    bestFor: 'Handovers and stakeholder snapshots.'
  },
  {
    id: 'improvement-report',
    label: 'Improvement Report',
    summary: 'Write prioritized recommendations without changing code.',
    bestFor: 'Strategy and advisory output.'
  },
  {
    id: 'change-journal',
    label: 'Change Journal',
    summary: 'Summarize what changed, why, and what remains.',
    bestFor: 'Handoffs and recent change review.'
  },
  {
    id: 'full-enhance',
    label: 'Full Enhance',
    summary: 'Run a full analyze-plan-execute-verify loop.',
    bestFor: 'Large multi-phase improvement campaigns.'
  }
];

export const RUN_TEMPLATES = [
  {
    id: 'make-it-reliable',
    label: 'Fix bugs and stabilize the product',
    modeId: 'fix-backlog',
    request: 'Stabilize the scoped product area, fix the highest-risk bugs, verify them, and update the backlog plus documentation.'
  },
  {
    id: 'audit-product',
    label: 'Audit the current system',
    modeId: 'deep-scan',
    request: 'Audit the requested scope, identify confusing UX, broken behavior, duplication, and architecture risks, then write a prioritized backlog.'
  },
  {
    id: 'ship-feature',
    label: 'Build a new feature',
    modeId: 'feature-delivery',
    request: 'Implement the requested feature, verify it end to end, and refresh any affected documentation.'
  },
  {
    id: 'revamp-ui',
    label: 'Redesign a page or workflow',
    modeId: 'design-revamp',
    request: 'Revamp the requested interface to improve clarity, usability, and professionalism while preserving the required behavior.'
  }
];
