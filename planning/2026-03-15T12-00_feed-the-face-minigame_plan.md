# Feed the Face — Mini-game Plan

## Overview
Add an endless mini-game overlay on top of the AnimatedBackground. The existing hunter (ASCII face) that eats floating emoji icons becomes the game character. A score/hunger HUD overlays the canvas.

## Approach
- **No changes to the canvas physics** — keep AnimatedBackground pure visually.
- Add a `useGameState` hook in `pages/Home/model/useGameState.ts` — manages score, hunger, combo, state machine.
- The hook communicates with AnimatedBackground via a **callback ref pattern**: AnimatedBackground accepts an optional `onEat` callback prop.
- A new `GameHud` component (`pages/Home/ui/GameHud.tsx`) renders the score/hunger bar overlay.
- `Home/index.tsx` wires them together.

## Game rules
- **Start**: first mouse move activates idle; clicking on canvas starts game
- **Hunger**: starts 100, decays 0.8/sec; eating good icon restores +30, bad icon -20
- **Score**: good eat +10×combo, bad eat -5
- **Combo**: 3+ consecutive good eats → multiplier, resets on bad eat or hunger warning
- **Good/bad icons**: even iconIdx (0,2,4,6) = good; odd (1,3,5,7) = bad (visually labeled)
- **Escalation**: every 15 eats speed tier increases (managed in AnimatedBackground via prop)
- **Mood override**: hunger<40 → "sleepy", hunger<15 → "angry"; combo≥3 → "focused"; bad eat → "surprised"
- **Death**: hunger=0 → "sleepy" face, game over overlay, click to restart

## Files
- `app/pages/Home/ui/AnimatedBackground.tsx` — add `onEat` prop, `moodOverride` prop, `speedTier` prop
- `app/pages/Home/model/useGameState.ts` — new hook
- `app/pages/Home/ui/GameHud.tsx` — new component
- `app/pages/Home/index.tsx` — wire up

## Steps
1. Add `useGameState` hook
2. Add `GameHud` component
3. Modify AnimatedBackground to accept game props
4. Update Home/index.tsx
