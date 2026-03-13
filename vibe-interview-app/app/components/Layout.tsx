import type { ReactNode } from "react";
import { Link } from "react-router";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";
import type { ThemeMode } from "~/hooks/useTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "~/contexts/LanguageContext";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const themeIcons: Record<ThemeMode, ReactNode> = {
  light: <Sun size={14} />,
  dark: <Moon size={14} />,
  system: <Monitor size={14} />,
};

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backTo?: string;
  wide?: boolean;
}

export function Layout({ children, showBack = false, backTo = "/", wide = false }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-7 flex items-center gap-5">
        <Link
          to="/"
          className="font-display text-base font-black text-primary tracking-tight"
        >
          interview<span className="text-[var(--color-accent2)]">trainer</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                {themeIcons[theme]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("dark")} className={theme === "dark" ? "text-primary" : ""}>
                <Moon size={14} />
                {t("layout.themeDark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")} className={theme === "light" ? "text-primary" : ""}>
                <Sun size={14} />
                {t("layout.themeLight")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className={theme === "system" ? "text-primary" : ""}>
                <Monitor size={14} />
                {t("layout.themeSystem")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {showBack && (
            <Link
              to={backTo}
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              {t("layout.goBack")}
            </Link>
          )}
        </div>
      </header>
      <main className={`${wide ? "max-w-screen-2xl" : "max-w-4xl"} mx-auto px-6 py-8 lg:px-10`}>{children}</main>
    </div>
  );
}
