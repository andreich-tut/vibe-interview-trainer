# Voice Answers — Implementation Plan

## Goal
Allow users to answer interview questions by voice using the Web Speech API (`SpeechRecognition`). Transcribed text fills the existing textarea and is evaluated by the Groq LLM — same flow as typed answers.

## Architecture

```
User speaks → SpeechRecognition API → transcript text → textarea → Groq LLM evaluation
```

No new dependencies. No backend changes. Browser-native speech-to-text only.

## Components

### 1. `useSpeechRecognition` Hook
**File:** `app/hooks/useSpeechRecognition.ts`

Encapsulates the Web Speech API with a clean React interface.

**API:**
```ts
interface UseSpeechRecognitionReturn {
  isListening: boolean;       // microphone is active
  transcript: string;         // current interim + final text
  isSupported: boolean;       // browser supports SpeechRecognition
  start: () => void;          // begin recording
  stop: () => void;           // stop recording
  reset: () => void;          // clear transcript
}
```

**Key decisions:**
- `lang: "ru-RU"` — app is in Russian
- `continuous: true` — don't stop after first pause
- `interimResults: true` — show text as user speaks (real-time feedback)
- Accumulate final results into a growing transcript string
- Show interim (in-progress) text appended to final text
- Auto-stop on `onerror` or `onend` events
- Handle edge case: only one `SpeechRecognition` instance at a time (browser limitation)

### 2. FlashCard UI Changes
**File:** `app/components/FlashCard.tsx`

**Changes:**
- Add a microphone toggle button next to the textarea
- When recording: pulsing red indicator + "Говорите..." hint
- Transcript from hook → appended to `userAnswer` state on stop (or continuously synced)
- Disable mic button during AI evaluation phase
- Show "Браузер не поддерживает голосовой ввод" if `!isSupported`

**UI layout (input phase):**
```
┌──────────────────────────────┐
│  Question text               │
│                              │
│  ┌────────────────────┐ 🎤  │
│  │ textarea            │     │
│  │                     │     │
│  └────────────────────┘     │
│  Ctrl+Enter — проверить      │
│  [Проверить]                 │
└──────────────────────────────┘
```

The mic button toggles recording on/off. While recording, it turns red/pulsing.

### 3. Behavior Flow

1. User clicks 🎤 → `start()` → mic indicator active
2. User speaks → interim text shown in textarea in real-time
3. User clicks 🎤 again (or recognition ends) → `stop()` → final transcript committed to textarea
4. User can edit transcribed text manually if needed
5. User clicks "Проверить" → normal LLM evaluation flow

**Edge cases:**
- User types some text, then uses voice → voice appends to existing text
- User clicks mic while already recording → stops recording
- Recognition error (no permission, no mic) → show error message, fall back to typing
- Browser not supported → hide mic button entirely

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full  |
| Edge    | ✅ Full  |
| Safari  | ✅ Full (14.1+) |
| Firefox | ❌ Not supported |

For unsupported browsers, the mic button is hidden — typing remains the only option.

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/hooks/useSpeechRecognition.ts` | **Create** — new hook |
| `app/components/FlashCard.tsx` | **Modify** — add mic button + wire hook |

## No External Dependencies

Everything uses the built-in `webkitSpeechRecognition` / `SpeechRecognition` browser API. Zero npm packages needed.
