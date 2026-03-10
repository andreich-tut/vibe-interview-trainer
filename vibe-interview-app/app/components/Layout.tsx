import type { ReactNode } from "react";
import { Link } from "react-router";

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backTo?: string;
}

export function Layout({ children, showBack = false, backTo = "/" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] p-7 flex items-center gap-5">
        <Link
          to="/"
          className="font-display text-base font-black text-[var(--color-accent)] tracking-tight"
        >
          interview<span className="text-[var(--color-accent2)]">trainer</span>
        </Link>
        {showBack && (
          <Link
            to={backTo}
            className="ml-auto text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
          >
            ← Назад
          </Link>
        )}
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-5 py-8">{children}</main>
    </div>
  );
}
