import { useEffect, useRef, useState } from "react";
import type { GameState } from "../model/useGameState";

// Good icon indices are even: 0,2,4,6 → ⚡🔷🎨🟢
const GOOD_ICONS = ["⚡", "🔷", "🎨", "🟢"];

interface GameHudProps {
  game: GameState;
  onStart: () => void;
  onRestart: () => void;
}

export function GameHud({ game, onStart, onRestart }: GameHudProps) {
  const { phase, score, hunger, combo, multiplier } = game;
  const [scoreFlash, setScoreFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      prevScore.current = score;
      setScoreFlash(true);
      const t = setTimeout(() => setScoreFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [score]);

  const hungerColor =
    hunger < 15 ? "bg-red-500" :
    hunger < 40 ? "bg-amber-400" :
    "bg-emerald-400";

  const hungerGlow =
    hunger < 15 ? "shadow-[0_0_6px_rgba(239,68,68,0.8)]" :
    hunger < 40 ? "shadow-[0_0_6px_rgba(251,191,36,0.6)]" :
    "";

  // ── Idle: tiny unobtrusive corner hint ───────────────────────────────────
  if (phase === "idle") {
    return (
      <div className="fixed bottom-6 right-6 z-20 pointer-events-none select-none">
        <button
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white/40 text-[11px] font-mono hover:text-white/60 hover:border-white/20 transition-all backdrop-blur-sm"
          onClick={onStart}
        >
          <span className="text-[10px]">▶</span>
          <span>play</span>
        </button>
      </div>
    );
  }

  // ── Dead / dying: centered game-over ─────────────────────────────────────
  if (phase === "dead" || phase === "dying") {
    const isDying = phase === "dying";
    return (
      <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className={`pointer-events-auto flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${isDying ? "bg-red-950/40 border-red-500/60 scale-105" : "bg-black/70 border-red-500/30 animate-[fadeIn_0.4s_ease]"}`}>
          <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${isDying ? "text-red-300 animate-pulse" : "text-red-400/80"}`}>
            {isDying ? "dying..." : "starved"}
          </span>
          <span className="text-white font-mono text-4xl font-black tabular-nums">{score}</span>
          <span className="text-slate-500 font-mono text-[10px]">score</span>
          <button
            disabled={isDying}
            className="mt-1 px-4 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white/50 text-[11px] font-mono hover:text-white/80 hover:border-white/25 transition-all disabled:opacity-0"
            onClick={onRestart}
          >
            again
          </button>
        </div>
      </div>
    );
  }

  // ── Playing: bottom-right corner strip ───────────────────────────────────
  return (
    <div className="fixed bottom-5 right-5 z-20 pointer-events-none select-none flex flex-col items-end gap-2">

      {/* Combo badge — only when active */}
      {combo >= 3 && (
        <div className="px-2 py-0.5 rounded bg-yellow-400/15 border border-yellow-400/25 text-yellow-300/80 font-mono text-[10px]">
          ×{multiplier} ×{combo}
        </div>
      )}

      {/* Main strip */}
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/30 border border-white/8 backdrop-blur-sm font-mono text-[11px]">

        {/* Good icons legend */}
        <div className="flex items-center gap-0.5 opacity-50" title="eat these">
          {GOOD_ICONS.map((icon) => (
            <span key={icon} className="text-[12px] leading-none">{icon}</span>
          ))}
        </div>

        <span className="text-white/15">│</span>

        {/* Hunger bar */}
        <div className="flex items-center gap-1.5">
          <div className={`w-16 h-1.5 bg-white/8 rounded-full overflow-hidden ${hungerGlow}`}>
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${hungerColor}`}
              style={{ width: `${hunger}%` }}
            />
          </div>
        </div>

        <span className="text-white/15">│</span>

        {/* Score */}
        <span
          className={`text-white/60 tabular-nums w-10 text-right transition-colors duration-150 ${scoreFlash ? "text-cyan-300/90" : ""}`}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
