# LLM Visibility Analysis Tool — Project Context

## What This Is

A free, public web tool that analyzes how well a website/brand appears in ChatGPT and Gemini responses. It tells you:
- How often your brand gets mentioned (visibility score)
- Which competitors are mentioned alongside you
- Where the LLMs sourced their answers from (citations)
- What to do to improve your presence

## Tech Stack

- **React 19** + **Vite 8** (frontend only, no backend)
- **Tailwind CSS 4** + inline style objects (theme-driven)
- **Anthropic Claude API** (claude-sonnet-4-20250514) — the only external dependency
  - Uses `web_search` tool to simulate ChatGPT/Gemini queries
  - Direct HTTP calls from the browser to `https://api.anthropic.com/v1/messages`
- **No backend, no database, no auth**

## Directory Structure

```
src/
  api/
    claude.js              # All API calls: callClaude(), extractJSON(), normUrl(), getDom()
  components/
    Bar.jsx                # Horizontal progress bar
    DonutChart.jsx         # SVG donut/pie chart
    Pill.jsx               # Badge/tag component
    ScoreRing.jsx          # SVG circular score indicator
    Toggle.jsx             # Dark/light theme toggle
  context/
    ThemeContext.jsx        # Theme provider; useT() hook for color access
  results/
    ResultsDashboard.jsx   # Tabbed results layout wrapper
    OverviewTab.jsx        # Summary: scores, donut chart, top sources
    PromptsTab.jsx         # Per-prompt breakdown table
    BrandsTab.jsx          # Competitor market share bars + table
    CitationsTab.jsx       # Citation domains + which LLM cited them
    ActionsTab.jsx         # Prioritized recommendations
  screens/
    InputScreen.jsx        # URL entry
    GeneratingScreen.jsx   # Loading spinner during prompt generation
    PromptsScreen.jsx      # Review 5 generated prompts before analysis
    AnalyzingScreen.jsx    # Progress bar during analysis (10 API calls)
  App.jsx                  # All state + core logic
  constants.js             # Theme colors, stage definitions, chart colors
```

## Application Flow

```
InputScreen (url input)
  → generatePrompts()        [2 Claude calls: research site → generate 5 prompts]
  → PromptsScreen            [user reviews prompts]
  → analyze()                [10 Claude calls: 5 prompts × 2 LLMs with web_search]
  → processResults()         [aggregate into analytics object]
  → ResultsDashboard (5 tabs)
  → onReset() → back to InputScreen
```

State is a single `step` string: `"input" | "generating" | "prompts" | "analyzing" | "results"`

## Core Logic (App.jsx)

### `generatePrompts(url)`
1. Normalizes the URL
2. Calls Claude to research the website (what business it is)
3. Calls Claude again to generate 5 prompts across buying stages: Awareness, Consideration, Decision, Problem-focused, Solution-focused
4. Extracts JSON from the response
5. Timeout: 120s

### `analyze(prompts)`
1. For each of 5 prompts, calls Claude twice (once framed as ChatGPT, once as Gemini) with `web_search` enabled
2. Each call asks Claude to identify brand mentions and citation sources in the response
3. Updates progress state in real-time (current/total)
4. Timeout: 300s

### `processResults(rawResults)`
Aggregates raw data into:
- `overallScore`: brand mentions ÷ total unique brands
- `openaiScore` / `geminiScore`: per-LLM visibility
- `topBrands`: ranked competitor list with per-LLM counts
- `topDomains`: citation domains with frequency + which LLMs cited them
- `byStage`: visibility per buying stage
- `promptResults`: per-prompt detail rows
- `recommendations`: from `buildRecs()` — array of `{priority, title, detail, links[]}`

### `buildRecs()`
Generates actionable recommendations from citation analysis:
- Low-visibility prompts → content creation suggestions
- Reddit citations → Reddit engagement
- Medium citations → Medium article ideas
- Wikipedia citations → Wikipedia page updates
- Competitor-heavy results → comparison page ideas
- Blog/publication citations → outreach targets

## Styling

All component styles are inline object literals using theme colors. No CSS files per component.

Theme colors come from `constants.js` (two themes: dark/light) and are accessed via `useT()` from `ThemeContext`.

Example pattern used throughout:
```jsx
const t = useT();
<div style={{ background: t.bg, color: t.text, border: `1px solid ${t.border}` }}>
```

## API Layer (src/api/claude.js)

```js
callClaude(systemPrompt, userPrompt, useSearch=true)
// → POST to Anthropic API, returns response text string

extractJSON(text)
// → finds and parses first JSON block in markdown/text response

normUrl(input)
// → validates and normalizes URL string

getDom(url)
// → extracts domain name from URL
```


## Key Constraints

- All 10 analysis calls happen from the browser — no server-side proxy
- The app is stateless: no persistence between sessions
- Analysis requires ~10 API calls and can take up to 5 minutes
- The "ChatGPT" and "Gemini" simulation is done via Claude with web_search (not actual GPT/Gemini APIs)
