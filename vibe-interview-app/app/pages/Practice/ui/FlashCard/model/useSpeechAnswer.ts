import { useState, useEffect, useCallback, useRef } from "react";
import type { UseSpeechRecognitionReturn } from "./useSpeechRecognition";

export function useSpeechAnswer(
  speech: UseSpeechRecognitionReturn,
  cardId: string,
) {
  const [userAnswer, setUserAnswer] = useState("");
  const typedBeforeMicRef = useRef("");

  // Compose displayed answer: typed prefix + speech transcript + interim
  useEffect(() => {
    if (!speech.isListening && !speech.transcript) return;
    const prefix = typedBeforeMicRef.current;
    const sep = prefix && !prefix.endsWith(" ") && !prefix.endsWith("\n") ? " " : "";
    const voicePart = speech.transcript + (speech.interimText ? ` ${speech.interimText}` : "");
    setUserAnswer(voicePart ? `${prefix}${sep}${voicePart}` : prefix);
  }, [speech.transcript, speech.interimText, speech.isListening]);

  // When mic stops, commit the full text so user can continue typing
  useEffect(() => {
    if (!speech.isListening && speech.transcript) {
      const prefix = typedBeforeMicRef.current;
      const sep = prefix && !prefix.endsWith(" ") && !prefix.endsWith("\n") ? " " : "";
      setUserAnswer(`${prefix}${sep}${speech.transcript}`);
    }
  }, [speech.isListening, speech.transcript]);

  // Reset speech state when card changes
  useEffect(() => {
    speech.reset();
    typedBeforeMicRef.current = "";
    setUserAnswer("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId]);

  const toggleMic = useCallback(() => {
    if (speech.isListening) {
      speech.stop();
    } else {
      typedBeforeMicRef.current = userAnswer;
      speech.reset();
      speech.start();
    }
  }, [speech, userAnswer]);

  return { userAnswer, setUserAnswer, toggleMic };
}
