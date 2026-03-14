# Content Enrichment Plan
Date: 2026-03-14

## Goal
Make all theory and cards content detailed and comprehensive for interview preparation.

## Current State (file sizes in bytes)
### EN Theory (too thin)
- cicd.json: 1436 (skeleton bullets only)
- css.json: 1444 (skeleton bullets only)
- nextjs.json: 1396 (skeleton bullets only)
- testing.json: 1372 (skeleton bullets only)
- nodejs.json: 1656 (some detail)
- react.json: 3521 (reasonable)
- javascript.json: 4931 (good)

### RU Theory (reference quality)
- javascript.json: 6787
- react.json: 4630
- testing.json: 4684
- cicd.json: 3303
- css.json: 4307
- nextjs.json: 4610
- nodejs.json: 4412

### Cards (EN vs RU)
- testing: 6 cards EN vs 10 cards RU
- cicd: 6 cards EN vs 10 cards RU  
- All other EN cards are 6-10 cards, reasonable quality

## Tasks

### Phase 1: Expand EN theory (all 7 topics)
Each theory file should have 6-8 sections with:
- Clear HTML content with `<h3>` headings
- Real code examples in `<pre>` blocks
- Explanatory paragraphs (not just bullet lists)
- `"contentFormat": "html"` on each section

### Phase 2: Expand EN cards (testing, cicd to 10 cards each)
- Add 4 more cards to testing.json (id: 7-10)
- Add 4 more cards to cicd.json (id: 7-10)
- New topics: test coverage, CI environment variables, security scanning, advanced patterns

### Phase 3: Expand RU content to match or exceed EN
- RU theory already good, but some topics can be expanded
- RU cards already 10 each, quality check only

## File Format
Theory:
```json
{
  "theory": [
    {
      "title": "...",
      "content": "<h3>...</h3><p>...</p><pre>...</pre>",
      "contentFormat": "html"
    }
  ]
}
```

Cards:
```json
{
  "cards": [
    {
      "id": "1",
      "category": "...",
      "question": "...",
      "answer": "...",
      "keyPoints": ["...", "...", "...", "..."]
    }
  ]
}
```
