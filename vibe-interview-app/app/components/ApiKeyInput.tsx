import { useState } from "react";
import { hasApiKey, setApiKey, removeApiKey, getApiKey } from "~/lib/llm";

function maskKey(key: string): string {
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "..." + key.slice(-4);
}

export function ApiKeyInput({ onDone }: { onDone?: () => void }) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(hasApiKey);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setApiKey(trimmed);
    setValue("");
    setSaved(true);
    onDone?.();
  };

  const handleRemove = () => {
    removeApiKey();
    setSaved(false);
  };

  if (saved) {
    const key = getApiKey() ?? "";
    return (
      <div className="flex items-center gap-3 text-xs">
        <span className="text-[var(--color-muted)]">
          Groq API: <code className="text-[var(--color-accent)]">{maskKey(key)}</code>
        </span>
        <button
          onClick={handleRemove}
          className="text-[var(--color-red)] hover:underline"
        >
          Удалить ключ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--color-muted)]">
        Для AI-проверки ответов введите{" "}
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-accent)] hover:underline"
        >
          Groq API ключ
        </a>{" "}
        (бесплатно, без карты):
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="gsk_..."
          className="flex-1 px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button
          onClick={handleSave}
          className="px-4 py-1.5 bg-[var(--color-accent)] text-white text-sm rounded hover:bg-[#6a56f0] transition"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
