import { useState, useMemo, useEffect } from "react";
import { Layout } from "~/components/Layout";
import { CodeBlock } from "~/components/CodeBlock";
import { StepVisualizer } from "~/components/StepVisualizer";
import { loadContent, type EventLoopFile } from "~/lib/contentLoader";
import { useLanguage } from "~/contexts/LanguageContext";

type Screen = "splash" | "quiz" | "results";
type Level = "easy" | "medium" | "hard";

export function meta() {
  return [
    { title: "Event Loop Trainer" },
    { name: "description", content: "Interactive Event Loop trainer" },
  ];
}

export default function EventLoop() {
  const { lang, t } = useLanguage();

  const [eventLoopData, setEventLoopData] = useState<EventLoopFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [screen, setScreen] = useState<Screen>("splash");
  const [level, setLevel] = useState<Level>("easy");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Load event-loop data — re-runs when language changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setEventLoopData(null);
    loadContent(lang, "event-loop")
      .then((data) => {
        setEventLoopData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load event-loop data:", err);
        setError(t("common.failedToLoad"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const questions = useMemo(() => {
    if (!eventLoopData) return [];
    const pool = [...eventLoopData[level]];
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      // eslint-disable-next-line react-hooks/purity
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  }, [level, eventLoopData]);

  const currentQuestion = questions[currentIndex];

  const normalizeAnswer = (s: string) => {
    return s.replace(/\s+/g, "").replace(/，/g, ",").toLowerCase();
  };

  const handleStartGame = (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setCurrentIndex(0);
    setCorrect(0);
    setTotal(0);
    setAnswered(false);
    setUserAnswer("");
    setFeedback(null);
    setScreen("quiz");
  };

  const handleCheckAnswer = () => {
    if (answered || !userAnswer.trim()) return;

    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(currentQuestion.answer);

    if (isCorrect) {
      setCorrect(correct + 1);
    }

    setTotal(total + 1);
    setAnswered(true);
    setFeedback({
      isCorrect,
      message: isCorrect
        ? t("eventLoop.correct")
        : `${t("eventLoop.incorrectPrefix")}${currentQuestion.answer}`,
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setUserAnswer("");
      setFeedback(null);
    } else {
      setScreen("results");
    }
  };

  const handleRestart = () => {
    handleStartGame(level);
  };

  const handleBackToSplash = () => {
    setScreen("splash");
  };

  if (loading) {
    return (
      <Layout showBack>
        <div className="text-center py-12">
          <p className="text-(--color-muted)">{t("common.loading")}</p>
        </div>
      </Layout>
    );
  }

  if (error || !eventLoopData) {
    return (
      <Layout showBack>
        <div className="text-center py-12">
          <p className="text-red-500">{error || t("common.failedToLoadContent")}</p>
        </div>
      </Layout>
    );
  }

  if (screen === "splash") {
    return (
      <Layout showBack>
        <div className="text-center space-y-8">
          <div className="text-5xl mb-4">🔄</div>
          <div>
            <h1 className="font-display text-3xl font-black mb-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent2)] bg-clip-text text-transparent">
              {t("eventLoop.pageTitle")}
            </h1>
            <h2 className="font-display text-2xl font-black mb-4 text-[var(--color-accent2)]">
              {t("eventLoop.subtitle")}
            </h2>
            <p className="text-sm text-[var(--color-muted)] max-w-sm mx-auto mb-8">
              {t("eventLoop.description")}
            </p>
          </div>

          {/* Level selection */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {(["easy", "medium", "hard"] as Level[]).map((lv) => (
              <div
                key={lv}
                onClick={() => setLevel(lv)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  level === lv
                    ? "bg-[var(--color-accent)] bg-opacity-20 border border-[var(--color-accent)]"
                    : "bg-[var(--color-surface)] border border-[var(--color-border)]"
                }`}
              >
                <div className="text-2xl mb-2">
                  {lv === "easy" ? "🌱" : lv === "medium" ? "⚡" : "🔥"}
                </div>
                <div className="font-bold text-sm">
                  {lv === "easy" ? "Easy" : lv === "medium" ? "Medium" : "Hard"}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleStartGame(level)}
            className="inline-block py-2 px-8 bg-[var(--color-accent)] text-white font-semibold rounded hover:bg-opacity-90 transition"
          >
            {t("eventLoop.start")}
          </button>
        </div>
      </Layout>
    );
  }

  if (screen === "quiz") {
    const progress = (currentIndex / questions.length) * 100;

    return (
      <Layout showBack backTo="/">
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent2)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question header */}
          <div className="flex items-center justify-between text-xs">
            <div className="text-[var(--color-muted)]">
              {t("eventLoop.taskLabel")} {currentIndex + 1} / {questions.length}
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-bold ${
                currentQuestion.difficulty === "easy"
                  ? "bg-[rgba(52,211,153,0.15)] text-[#34d399]"
                  : currentQuestion.difficulty === "medium"
                    ? "bg-[rgba(251,146,60,0.15)] text-[#fb923c]"
                    : "bg-[rgba(248,113,113,0.15)] text-[#f87171]"
              }`}
            >
              {currentQuestion.difficulty === "easy"
                ? "Easy"
                : currentQuestion.difficulty === "medium"
                  ? "Medium"
                  : "Hard"}
            </div>
          </div>

          {/* Code */}
          <CodeBlock code={currentQuestion.code} />

          {/* Input */}
          <div className="space-y-2">
            <label className="text-xs text-[var(--color-muted)] block">
              {t("eventLoop.consolePrompt")}
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !answered) handleCheckAnswer();
              }}
              disabled={answered}
              placeholder={t("eventLoop.placeholder")}
              className={`w-full py-2 px-3 bg-[var(--color-surface)] border rounded text-sm ${
                answered
                  ? feedback?.isCorrect
                    ? "border-[var(--color-green)] bg-opacity-10"
                    : "border-[var(--color-red)] bg-opacity-10"
                  : "border-[var(--color-border)]"
              } outline-none`}
            />
            <div className="text-xs text-[var(--color-muted)]">💡 {currentQuestion.hint}</div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {!answered ? (
              <>
                <button
                  onClick={handleCheckAnswer}
                  className="flex-1 py-2 px-4 bg-[var(--color-accent)] text-white text-sm font-semibold rounded hover:bg-opacity-90 transition"
                >
                  {t("eventLoop.check")}
                </button>
                <button
                  onClick={() => {
                    setTotal(total + 1);
                    setAnswered(true);
                    setFeedback({
                      isCorrect: false,
                      message: `${t("eventLoop.correctAnswerPrefix")}${currentQuestion.answer}`,
                    });
                  }}
                  className="flex-1 py-2 px-4 border border-[var(--color-border)] text-[var(--color-muted)] text-sm font-semibold rounded hover:border-[var(--color-accent)] transition"
                >
                  {t("eventLoop.skip")}
                </button>
              </>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-2 px-4 bg-[var(--color-accent2)] text-white text-sm font-semibold rounded hover:bg-opacity-90 transition"
              >
                {t("eventLoop.next")}
              </button>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 rounded-lg border text-sm space-y-3 ${
                feedback.isCorrect
                  ? "bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.2)] text-[var(--color-green)]"
                  : "bg-[rgba(248,113,113,0.08)] border-[rgba(248,113,113,0.2)] text-[var(--color-red)]"
              }`}
            >
              <div className="font-bold">{feedback.message}</div>
              {!feedback.isCorrect && (
                <div className="text-xs text-[var(--color-text)] opacity-80">
                  {currentQuestion.explanation}
                </div>
              )}
              {feedback.isCorrect && (
                <div className="text-xs text-[var(--color-text)] opacity-80">
                  {currentQuestion.explanation}
                </div>
              )}

              {/* Steps */}
              <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                <div className="text-xs font-bold mb-3 opacity-70">{t("eventLoop.stepsLabel")}</div>
                <StepVisualizer steps={currentQuestion.steps} />
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Results screen
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  let emoji = "📚";
  let title = t("eventLoop.results.learning");
  let subtitle = t("eventLoop.results.learningSubtitle");

  if (percentage >= 100) {
    emoji = "🏆";
    title = t("eventLoop.results.perfect");
    subtitle = t("eventLoop.results.perfectSubtitle");
  } else if (percentage >= 80) {
    emoji = "🥇";
    title = t("eventLoop.results.great");
    subtitle = t("eventLoop.results.greatSubtitle");
  } else if (percentage >= 60) {
    emoji = "🥈";
    title = t("eventLoop.results.good");
    subtitle = t("eventLoop.results.goodSubtitle");
  }

  return (
    <Layout showBack backTo="/">
      <div className="text-center space-y-6">
        <div className="text-6xl">{emoji}</div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--color-accent)] mb-1">
            {title}
          </h2>
          <p className="text-sm text-[var(--color-muted)]">{subtitle}</p>
        </div>

        {/* Score grid */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
            <div className="font-black text-2xl text-[var(--color-green)] mb-1">{correct}</div>
            <div className="text-xs text-[var(--color-muted)]">{t("eventLoop.scoreCorrect")}</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
            <div className="font-black text-2xl text-[var(--color-accent2)] mb-1">{total}</div>
            <div className="text-xs text-[var(--color-muted)]">{t("eventLoop.scoreTotal")}</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
            <div className="font-black text-2xl text-[var(--color-accent)] mb-1">{percentage}%</div>
            <div className="text-xs text-[var(--color-muted)]">{t("eventLoop.scoreAccuracy")}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 max-w-sm mx-auto">
          <button
            onClick={handleRestart}
            className="flex-1 py-2 px-4 bg-[var(--color-accent)] text-white font-semibold rounded hover:bg-opacity-90 transition"
          >
            {t("eventLoop.playAgain")}
          </button>
          <button
            onClick={handleBackToSplash}
            className="flex-1 py-2 px-4 border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded hover:border-[var(--color-accent)] transition"
          >
            {t("eventLoop.changeLevel")}
          </button>
        </div>
      </div>
    </Layout>
  );
}
