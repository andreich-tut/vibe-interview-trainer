import { useState } from "react";
import { hasApiKey, setApiKey, removeApiKey, getApiKey } from "~/lib/llm";
import { useLanguage } from "~/contexts/useLanguage";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

function maskKey(key: string): string {
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "..." + key.slice(-4);
}

export function ApiKeyInput({ onDone }: { onDone?: () => void }) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(hasApiKey);
  const { t } = useLanguage();

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
        <span className="text-muted-foreground">
          Groq API: <code className="text-primary">{maskKey(key)}</code>
        </span>
        <Button variant="ghost" size="sm" onClick={handleRemove} className="h-auto py-0.5 px-2 text-destructive">
          {t("apiKeyInput.clear")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {t("apiKeyInput.hint")}{" "}
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {t("apiKeyInput.hintLink")}
        </a>{" "}
        {t("apiKeyInput.hintSuffix")}
      </p>
      <div className="flex gap-2">
        <Input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("apiKeyInput.placeholder")}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <Button size="sm" onClick={handleSave}>
          {t("apiKeyInput.submit")}
        </Button>
      </div>
    </div>
  );
}
