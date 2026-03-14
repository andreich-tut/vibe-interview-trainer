import { useEffect } from "react";
import type { LLMResult } from "~/lib/llm";

export function useFlashCardKeyboard(
  aiResult: LLMResult | null,
  handleCheck: () => void,
  handleNext: () => void,
) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          handleCheck();
        }
        return;
      }
      if (e.target instanceof HTMLInputElement) return;

      if (aiResult && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [aiResult, handleCheck, handleNext]);
}
