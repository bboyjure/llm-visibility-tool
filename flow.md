## The full flow



```
User enters URL
  → generatePrompts()
      → SearXNG search (what is this website?)
      → Ollama: research the site
      → SearXNG search (generate prompts)
      → Ollama: output 5 prompts as JSON
  → User reviews prompts
  → analyze()
      → for each of 5 prompts × 2 LLMs (ChatGPT sim, Gemini sim):
          → SearXNG search (the actual customer query)
          → Ollama: who gets mentioned? what sites get cited?
  → processResults() → scores, brands, citations, recommendations
  → ResultsDashboard (5 tabs)
```

------

## How SearXNG fits in specifically

Every time `callLLM(..., search=true)` is called in [App.jsx](vscode-webview://01tpjp93gblj273tcmc2lsidp85k41i1ovbn02ko3htdtupqkgao/src/App.jsx), it routes through [src/api/llm.js](vscode-webview://01tpjp93gblj273tcmc2lsidp85k41i1ovbn02ko3htdtupqkgao/src/api/llm.js) → `callOllama(..., search=true)` → which calls `searchWeb()` from [src/api/search.js](vscode-webview://01tpjp93gblj273tcmc2lsidp85k41i1ovbn02ko3htdtupqkgao/src/api/search.js) **before** sending anything to Ollama.

`searchWeb()` extracts a query from the prompt (looks for `Query: "..."` pattern first, then a URL, then the first line), hits `http://localhost:5173/api/searxng/search` (the Vite proxy), which forwards to `http://localhost:8888` (SearXNG in Docker). It gets back the top 5 results and formats them as:



```
- Title: snippet
- Title: snippet
...
```

That text is **prepended to the user message** before Ollama sees it:



```
Web search results:
- HubSpot: CRM software for small businesses...
- Salesforce: ...

Query: "Best CRM for small teams"
Return this JSON: {...}
```

So Ollama doesn't have to guess from training data — it reads actual current web results and uses those to identify real brands and real citation sources.

------

## Why the Vite proxy?

Browsers block cross-origin requests (CORS). Your React app runs on port 5173, SearXNG on port 8888 — direct fetch would be blocked. The proxy in [vite.config.js](vscode-webview://01tpjp93gblj273tcmc2lsidp85k41i1ovbn02ko3htdtupqkgao/vite.config.js) makes the browser call `/api/searxng/search` (same origin, allowed), and Vite's Node server forwards it to SearXNG. Node has no CORS restrictions.

------

## Why SearXNG and not DuckDuckGo/Brave?

- **DuckDuckGo** scraping is fragile and technically against ToS
- **Brave Search API** requires an account and has a monthly limit
- **SearXNG** is self-hosted, unlimited, no account, and returns proper JSON with a `?format=json` param — exactly what the app needs

------

## Component map

| File                       | Role                                                         |
| -------------------------- | ------------------------------------------------------------ |
| `App.jsx`                  | All state + the 3 core functions: `generatePrompts`, `analyze`, `processResults` |
| `api/llm.js`               | Routing layer — sends calls to Ollama or Claude based on `VITE_USE_CLAUDE` |
| `api/ollama.js`            | Calls local Ollama; if `search=true`, fetches SearXNG results first |
| `api/claude.js`            | Calls Anthropic API directly from browser with `web_search` tool enabled |
| `api/search.js`            | Fetches SearXNG, extracts query from prompt, returns formatted bullet list |
| `screens/`                 | 4 full-page states: input form, "generating…", prompt review, "analyzing…" |
| `results/`                 | ResultsDashboard + 5 tabs (Overview, Prompts, Market Share, Citations, Actions) |
| `components/`              | Bar, DonutChart, Pill, ScoreRing, Toggle — reusable UI primitives |
| `context/ThemeContext.jsx` | Toggles `.dark` class on `<html>`; all colors are CSS vars in `index.css` |

------

## When Claude is used instead

When `VITE_USE_CLAUDE=true`, `llm.js` calls `callClaude()` instead of `callOllama()`. Claude's API has a built-in `web_search` tool — so SearXNG is completely bypassed. The search parameter is still passed but `callClaude` ignores it and always searches via Anthropic's own infrastructure.The full flow