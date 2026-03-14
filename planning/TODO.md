# TODO

## 1. SVG Handling — Replace Inline SVG with SVGR Imports

Inline SVG code in components is noisy and hard to maintain. Switch to importing SVGs as React components via SVGR (or similar), so SVG files live in `assets/` and are imported cleanly.

## 2. Update File Structure Docs — CLAUDE.md and Memory

The file structure sections in [CLAUDE.md](../CLAUDE.md) and the memory index are stale. Update them to reflect current `app/` layout, added routes, and any structural changes made since initial setup.

## 3. Update README.md

[README.md](../README.md) may be out of date. Review and update: features list, tech stack table, project structure tree, and any commands that have changed.

## 4. Analyze Skills and Agents — Resolve Conflicts, Fill Gaps

Review all configured specialist subagents in `.claude/agents/` and all skills in `.claude/`. Identify:
- Overlaps or conflicts between agents and skills (e.g., `react-ui-builder` agent vs `frontend-patterns` skill)
- Gaps: tools or workflows missing from the current setup
- Suggest what additional agents/skills would improve the workflow for this project
