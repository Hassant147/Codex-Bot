import type { ReactNode } from 'react';

export function SectionCard({
  title,
  description,
  children,
  accent = 'neutral',
  footer,
  surface = 'supporting',
  className = ''
}: {
  title: string;
  description?: string;
  children: ReactNode;
  accent?: 'neutral' | 'success' | 'warning' | 'error' | 'brand';
  footer?: ReactNode;
  surface?: 'primary' | 'operational' | 'supporting';
  className?: string;
}) {
  return (
    <section className={`section-card surface-${surface} accent-${accent} ${className}`.trim()}>
      <div className="section-card-header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      <div className="section-card-body">{children}</div>
      {footer ? <div className="section-card-footer">{footer}</div> : null}
    </section>
  );
}
