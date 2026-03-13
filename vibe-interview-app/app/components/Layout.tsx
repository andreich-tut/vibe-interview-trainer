import type { ReactNode } from "react";
import { Link } from "react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "~/components/ui/button";

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backTo?: string;
  wide?: boolean;
}

export function Layout({ children, showBack = false, backTo = "/", wide = false }: LayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-7 flex items-center gap-5">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-base font-black text-primary tracking-tight"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Left lobe */}
            <path d="M16 8 C10 8 6 11 6 16 C6 20 8 23 12 24 L16 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            {/* Right lobe */}
            <path d="M16 8 C22 8 26 11 26 16 C26 20 24 23 20 24 L16 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            {/* Center split dashes */}
            <line x1="16" y1="9" x2="16" y2="23" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.45"/>
            {/* Circuit nodes — left */}
            <circle cx="10" cy="14" r="1.5" fill="currentColor" opacity="0.85"/>
            <circle cx="9"  cy="19" r="1.5" fill="currentColor" opacity="0.85"/>
            <circle cx="13" cy="11" r="1"   fill="currentColor" opacity="0.55"/>
            {/* Connectors — left */}
            <line x1="10" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <line x1="9"  y1="19" x2="12" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            {/* Circuit nodes — right */}
            <circle cx="22" cy="14" r="1.5" fill="currentColor" opacity="0.85"/>
            <circle cx="23" cy="19" r="1.5" fill="currentColor" opacity="0.85"/>
            <circle cx="19" cy="11" r="1"   fill="currentColor" opacity="0.55"/>
            {/* Connectors — right */}
            <line x1="22" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <line x1="23" y1="19" x2="20" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            {/* Bottom base */}
            <line x1="12" y1="24" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Antenna */}
            <line x1="16" y1="8" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="16" cy="4" r="1.5" fill="var(--color-accent2)"/>
          </svg>
          interview<span className="text-[var(--color-accent2)]">trainer</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </Button>
        </div>
      </header>
      <main className={`${wide ? "max-w-screen-2xl" : "max-w-4xl"} mx-auto px-6 py-8 lg:px-10`}>{children}</main>
    </div>
  );
}
