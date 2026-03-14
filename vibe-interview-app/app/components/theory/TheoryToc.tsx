import { Link } from "react-router";
import { useLanguage } from "~/contexts/useLanguage";

interface TocLinkProps {
  idx: number;
  title: string;
  active: boolean;
}

function TocLink({ idx, title, active }: TocLinkProps) {
  return (
    <li>
      <a
        href={`#section-${idx}`}
        className={`text-[0.8125rem] leading-snug transition-colors flex items-baseline gap-2.5 py-0.5 ${
          active
            ? "text-(--color-accent2) font-semibold"
            : "text-primary hover:text-(--color-accent2)"
        }`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-muted-foreground text-xs">
          {String(idx + 1).padStart(2, "0")}
        </span>
        {title}
      </a>
    </li>
  );
}

interface TheoryTocMobileProps {
  sections: { title: string }[];
  activeSection: number;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  tocRef: React.RefObject<HTMLDivElement | null>;
}

export function TheoryTocMobile({ sections, activeSection, open, onToggle, onClose, tocRef }: TheoryTocMobileProps) {
  const { t } = useLanguage();

  return (
    <div ref={tocRef} className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border -mx-6 px-6 mb-6">
      <div className="flex items-center justify-end py-3">
        {sections.length > 2 && (
          <button
            onClick={onToggle}
            className="text-xs font-semibold text-primary cursor-pointer"
          >
            {t("theory.sidebarTitle")} {open ? "↑" : "↓"}
          </button>
        )}
      </div>
      {open && sections.length > 2 && (
        <ol className="space-y-1.5 list-none p-0 m-0 pb-3" onClick={onClose}>
          {sections.map((section, idx) => (
            <TocLink key={idx} idx={idx} title={section.title} active={activeSection === idx} />
          ))}
        </ol>
      )}
    </div>
  );
}

interface TheoryTocDesktopProps {
  sections: { title: string }[];
  activeSection: number;
}

export function TheoryTocDesktop({ sections, activeSection }: TheoryTocDesktopProps) {
  const { t } = useLanguage();

  if (sections.length <= 2) return null;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-3 lg:sticky lg:top-8 lg:self-start">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("layout.goBack")}
      </Link>
      <nav className="bg-card border border-border rounded-xl p-6">
        <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-4">
          {t("theory.sidebarTitle")}
        </div>
        <ol className="space-y-2 list-none p-0 m-0">
          {sections.map((section, idx) => (
            <TocLink key={idx} idx={idx} title={section.title} active={activeSection === idx} />
          ))}
        </ol>
      </nav>
    </aside>
  );
}
