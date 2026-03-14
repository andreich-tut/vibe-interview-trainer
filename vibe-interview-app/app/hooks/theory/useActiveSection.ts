import { useState, useEffect } from "react";

export function useActiveSection(itemCount: number) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (!itemCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.id.replace("section-", ""));
            if (!Number.isNaN(idx)) setActiveSection(idx);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    for (let i = 0; i < itemCount; i++) {
      const el = document.getElementById(`section-${i}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [itemCount]);

  return activeSection;
}
