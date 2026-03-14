import type { Tone } from '../app/types';

export function StatusPill({
  tone = 'neutral',
  children
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return <span className={`status-pill tone-${tone}`}>{children}</span>;
}
