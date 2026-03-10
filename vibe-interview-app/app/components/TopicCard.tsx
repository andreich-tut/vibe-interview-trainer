import { Link } from "react-router";

interface TopicCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export function TopicCard({ id, icon, title, description }: TopicCardProps) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 hover:border-[var(--color-accent)] transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
      <p className="text-xs text-[var(--color-muted)] mb-4">{description}</p>
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
