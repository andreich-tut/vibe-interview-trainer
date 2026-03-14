import type { ReactNode } from "react";
import { Link } from "react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "~/components/ui/button";
import LogoBrainIcon from "~/assets/icons/logo-brain.svg?react";

interface LayoutProps {
  children: ReactNode;
  wide?: boolean;
}

export function Layout({ children, wide = false }: LayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-7 flex items-center gap-5">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-base font-black text-primary tracking-tight"
        >
          <LogoBrainIcon />
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
