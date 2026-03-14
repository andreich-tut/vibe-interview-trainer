import { useCallback, useEffect, useRef, useState } from "react";
import type { FaceMood } from "../ui/AnimatedBackground";

export type GamePhase = "idle" | "playing" | "dying" | "dead";

export interface GameState {
  phase: GamePhase;
  score: number;
  hunger: number;      // 0–100
  combo: number;
  multiplier: number;
  speedTier: number;   // 0–4, passed to AnimatedBackground
  moodOverride: FaceMood | null;
  totalEaten: number;
}

interface UseGameStateReturn {
  game: GameState;
  start: () => void;
  restart: () => void;
  onEat: (iconIdx: number) => void;
}

const HUNGER_DECAY_RATE = 0.8;       // per second
const GOOD_HUNGER_RESTORE = 30;
const BAD_HUNGER_PENALTY = 20;
const GOOD_SCORE_BASE = 10;
const BAD_SCORE_PENALTY = 5;
const COMBO_THRESHOLD = 3;
const SPEED_TIER_EVERY = 15;
const MAX_SPEED_TIER = 4;

// Death glitch: rapid mood sequence before settling to dead
const GLITCH_SEQUENCE: FaceMood[] = [
  "surprised", "angry", "wink", "sleepy", "surprised",
  "angry", "focused", "wink", "angry", "surprised",
  "sleepy", "angry", "sleepy",
];
const GLITCH_FRAME_MS = 80;

function isGoodIcon(iconIdx: number): boolean {
  return iconIdx % 2 === 0;
}

function computeMood(hunger: number, combo: number): FaceMood | null {
  if (combo >= COMBO_THRESHOLD) return "focused";
  if (hunger < 15) return "angry";
  if (hunger < 40) return "sleepy";
  return null;
}

const INITIAL: GameState = {
  phase: "idle",
  score: 0,
  hunger: 100,
  combo: 0,
  multiplier: 1,
  speedTier: 0,
  moodOverride: null,
  totalEaten: 0,
};

export function useGameState(): UseGameStateReturn {
  const [game, setGame] = useState<GameState>(INITIAL);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const surprisedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justBadEatRef = useRef(false);
  const glitchTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Hunger decay loop
  useEffect(() => {
    if (game.phase !== "playing") return;

    function tick(now: number) {
      if (lastTimeRef.current === 0) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setGame((prev) => {
        if (prev.phase !== "playing") return prev;
        const newHunger = Math.max(0, prev.hunger - HUNGER_DECAY_RATE * dt);
        if (newHunger === 0) {
          // Will trigger glitch via phase change — handled in separate effect
          return { ...prev, hunger: 0, phase: "dying", moodOverride: "surprised" };
        }
        const mood = justBadEatRef.current ? "surprised" : computeMood(newHunger, prev.combo);
        return { ...prev, hunger: newHunger, moodOverride: mood };
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [game.phase]);

  // Death glitch sequence
  useEffect(() => {
    if (game.phase !== "dying") return;

    // Clear any pending glitch timers
    glitchTimersRef.current.forEach(clearTimeout);
    glitchTimersRef.current = [];

    GLITCH_SEQUENCE.forEach((mood, i) => {
      const t = setTimeout(() => {
        setGame((prev) => prev.phase === "dying" ? { ...prev, moodOverride: mood } : prev);
      }, i * GLITCH_FRAME_MS);
      glitchTimersRef.current.push(t);
    });

    // End glitch → dead
    const endT = setTimeout(() => {
      setGame((prev) => prev.phase === "dying" ? { ...prev, phase: "dead", moodOverride: "sleepy" } : prev);
    }, GLITCH_SEQUENCE.length * GLITCH_FRAME_MS + 100);
    glitchTimersRef.current.push(endT);

    return () => {
      glitchTimersRef.current.forEach(clearTimeout);
    };
  }, [game.phase]);

  const start = useCallback(() => {
    glitchTimersRef.current.forEach(clearTimeout);
    setGame({ ...INITIAL, phase: "playing" });
  }, []);

  const restart = useCallback(() => {
    glitchTimersRef.current.forEach(clearTimeout);
    setGame({ ...INITIAL, phase: "playing" });
  }, []);

  const onEat = useCallback((iconIdx: number) => {
    const good = isGoodIcon(iconIdx);

    if (good) {
      justBadEatRef.current = false;
    } else {
      justBadEatRef.current = true;
      if (surprisedTimerRef.current) clearTimeout(surprisedTimerRef.current);
      surprisedTimerRef.current = setTimeout(() => {
        justBadEatRef.current = false;
      }, 800);
    }

    setGame((prev) => {
      if (prev.phase !== "playing") return prev;

      const newCombo = good ? prev.combo + 1 : 0;
      const multiplier = newCombo >= COMBO_THRESHOLD ? 2 : 1;
      const scoreGain = good ? GOOD_SCORE_BASE * multiplier : -BAD_SCORE_PENALTY;
      const newScore = Math.max(0, prev.score + scoreGain);
      const hungerDelta = good ? GOOD_HUNGER_RESTORE : -BAD_HUNGER_PENALTY;
      const newHunger = Math.min(100, Math.max(0, prev.hunger + hungerDelta));
      const newTotalEaten = prev.totalEaten + 1;
      const newSpeedTier = Math.min(MAX_SPEED_TIER, Math.floor(newTotalEaten / SPEED_TIER_EVERY));
      const mood = justBadEatRef.current ? "surprised" : computeMood(newHunger, newCombo);

      return {
        ...prev,
        score: newScore,
        hunger: newHunger,
        combo: newCombo,
        multiplier,
        totalEaten: newTotalEaten,
        speedTier: newSpeedTier,
        moodOverride: mood,
      };
    });
  }, []);

  return { game, start, restart, onEat };
}
