import type { RunEvent } from '../app/types';

export function Timeline({ events }: { events: RunEvent[] }) {
  if (!events.length) {
    return <div className="timeline-empty">No runtime events yet.</div>;
  }

  return (
    <ol className="timeline">
      {[...events].reverse().map((event) => (
        <li key={event.id} className={`timeline-item level-${event.level}`}>
          <div className="timeline-meta">
            <span>{new Date(event.createdAt).toLocaleTimeString()}</span>
            <span>{event.source}</span>
          </div>
          <p>{event.message}</p>
        </li>
      ))}
    </ol>
  );
}
