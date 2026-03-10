import { Link } from "react-router";

interface TopicCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  progress?: { mastered: number; total: number };
}

export function TopicCard({ id, icon, title, description, progress }: TopicCardProps) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 hover:border-[var(--color-accent)] transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
      <p className="text-xs text-[var(--color-muted)] mb-4">{description}</p>

      {/* Progress bar */}
      {progress && progress.total > 0 && (
        <div className="mb-4 space-y-1">
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-green)] to-[var(--color-accent2)] transition-all duration-500"
              style={{ width: `${Math.round((progress.mastered / progress.total) * 100)}%` }}
            />
          </div>
          <div className="text-[0.5rem] text-[var(--color-muted)] text-right">
            {progress.mastered}/{progress.total}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Link
          to={`/${id}/theory`}
          className="flex-1 text-center py-2 px-3 bg-[var(--color-accent)] text-white rounded text-xs font-semibold hover:bg-[#6a56f0] transition"
        >
          Теория
        </Link>
        <Link
          to={`/${id}/practice`}
          className="flex-1 text-center py-2 px-3 border border-[var(--color-border)] text-[var(--color-text)] rounded text-xs font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition"
        >
          Практика
        </Link>
      </div>
    </div>
  );
}
