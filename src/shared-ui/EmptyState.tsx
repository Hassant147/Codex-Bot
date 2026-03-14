export function EmptyState({
  title,
  body,
  tone = 'default',
  compact = false,
  actions
}: {
  title: string;
  body: string;
  tone?: 'default' | 'primary';
  compact?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className={`empty-state empty-state-${tone} ${compact ? 'empty-state-compact' : ''}`.trim()}>
      <strong>{title}</strong>
      <p>{body}</p>
      {actions ? <div className="empty-state-actions">{actions}</div> : null}
    </div>
  );
}
