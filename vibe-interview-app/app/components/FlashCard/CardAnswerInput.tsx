import { useEffect, useRef } from "react";
import { Textarea } from "~/components/ui/textarea";
import type { UseSpeechRecognitionReturn } from "~/hooks/shared/useSpeechRecognition";
import { useLanguage } from "~/contexts/useLanguage";
import MicStopIcon from "~/assets/icons/mic-stop.svg?react";
import MicIcon from "~/assets/icons/mic.svg?react";

interface CardAnswerInputProps {
  userAnswer: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  speech: UseSpeechRecognitionReturn;
  toggleMic: () => void;
}

export function CardAnswerInput({
  userAnswer,
  onChange,
  onCheck,
  speech,
  toggleMic,
}: CardAnswerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);
  const { t } = useLanguage();
  return (
    <div className="flex flex-col flex-1 space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={userAnswer}
          onChange={(e) => onChange(e.target.value)}
          placeholder={speech.isListening ? t("flashCard.listening") : t("flashCard.placeholder")}
          rows={4}
          className="pr-12"
          style={{
            borderColor: speech.isListening ? "var(--destructive)" : undefined,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              onCheck();
            }
          }}
        />
        {speech.isSupported && (
          <button
            type="button"
            onClick={toggleMic}
            title={speech.isListening ? t("flashCard.recording") : t("flashCard.ctrlEnterHint")}
            className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: speech.isListening ? "rgba(248,113,113,0.2)" : "transparent",
              color: speech.isListening ? "var(--destructive)" : "var(--muted-foreground)",
            }}
          >
            {speech.isListening ? <MicStopIcon /> : <MicIcon />}
          </button>
        )}
      </div>
      {speech.error && (
        <div className="text-xs text-destructive">
          {speech.error}
        </div>
      )}
      {speech.isListening && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <span className="inline-block w-2 h-2 rounded-full bg-destructive animate-pulse" />
          {t("flashCard.recording")}
        </div>
      )}
      <div className="text-[0.625rem] text-muted-foreground text-center">
        {t("flashCard.ctrlEnterHint")}
      </div>
    </div>
  );
}
