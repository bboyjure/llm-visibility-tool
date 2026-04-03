# LLM Visibility Analysis Tool

A free, open-source tool that analyzes how well your website/brand appears in AI assistant responses (ChatGPT, Gemini). Paste your URL, get 5 customer-intent prompts, and see which brands and sources the AI recommends — plus actionable steps to improve your visibility.

**No subscriptions. Runs entirely on your machine.**

> [!WARNING]
> **Results accuracy disclaimer**
> The default model (`qwen2.5:1.5b`) is intentionally very small so the tool runs on a regular CPU without a GPU. Results **are not accurate** without web search — brand mentions and citations are based on the model's limited training knowledge only.
>
> Enable SearXNG (see below) for real web results. Or switch to a larger model or Claude for better quality analysis.
>
> **The "ChatGPT" and "Gemini" scores are simulated — not real.**
> This tool has no access to the ChatGPT or Gemini APIs. Both scores are produced by Ollama (or Claude) asked to roleplay as each platform. The split between them is largely meaningless; treat the combined result as a single rough proxy for brand visibility across AI-style queries.

---

## How it works

The tool uses **[Ollama](https://ollama.com)** to run an LLM locally. For each prompt it simulates what ChatGPT and Gemini would say, identifies brand mentions, and extracts citation sources — giving you a visibility score and recommendations.

When **SearXNG** is running, the tool automatically fetches live web search results before each LLM call and injects them as context. This makes the brand mentions and citations reflect what's actually on the web today, not just the model's training data.

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd llm-visibility-tool
npm install
```

### 2. Configure environment

`.env` is already included with defaults:

```
VITE_OLLAMA_URL=http://localhost:11434/api/chat
VITE_OLLAMA_MODEL=qwen2.5:1.5b

# Set to true to use Claude instead of Ollama (requires API key below)
VITE_USE_CLAUDE=false
VITE_ANTHROPIC_API_KEY=
```

Change `VITE_OLLAMA_MODEL` to any model you want (see options below), or switch to Claude for much better results (see [Using Claude instead of Ollama](#using-claude-instead-of-ollama)).

---

## Running the stack

The services are split into two compose files:

| File | Services | Ports |
|---|---|---|
| `docker-compose.ollama.yml` | `ollama`, `ollama-init` (model download) | 11434 |
| `docker-compose.searxng.yml` | `searxng` | 8888 |

Start both:

```bash
docker compose -f docker-compose.ollama.yml up -d
docker compose -f docker-compose.searxng.yml up -d
```

Wait about 30 seconds for Ollama to finish downloading the model, then start the app.

### Running only what you need

If you're using Claude (no Ollama needed), just start SearXNG — or skip it entirely since Claude has built-in web search:

```bash
# SearXNG only
docker compose -f docker-compose.searxng.yml up -d

# Ollama only (if you don't want web search)
docker compose -f docker-compose.ollama.yml up -d
```

### Running Ollama without Docker

1. Install Ollama from [ollama.com](https://ollama.com)
2. Pull a model:
   ```bash
   ollama pull qwen2.5:1.5b
   ```
3. Ollama starts automatically and listens on `http://localhost:11434`

If you run Ollama natively you still need SearXNG in Docker for web search:

```bash
docker compose -f docker-compose.searxng.yml up -d
```

---

## Web search with SearXNG

SearXNG is a free, self-hosted metasearch engine. When running, the tool fetches real search results for every prompt and passes them to the LLM as context — dramatically improving accuracy.

### How it works in the app

1. Before each LLM call the app extracts a search query from the prompt
2. It calls `localhost:8888/search?format=json` via the Vite dev proxy (no CORS issues)
3. The top 5 results are prepended to the LLM's user message
4. The LLM answers with real, current web context instead of guessing

### First-time SearXNG setup

SearXNG requires a config file on first run. It's already included at `searxng/settings.yml`. If you need to regenerate it:

```bash
docker compose -f docker-compose.searxng.yml up -d
# then check http://localhost:8888 — it should load the search UI
```

The `searxng/settings.yml` has JSON output enabled (required by the app) and the rate limiter disabled (fine for local use).

> [!NOTE]
> The Vite dev proxy handles the browser → SearXNG connection. You do **not** need to set `VITE_SEARXNG_URL` in `.env` — the default `/api/searxng/search` path works automatically. Only set it if you're pointing at a remote SearXNG instance.

---

## Choosing a model

Larger models give better, more realistic results. Pick based on your available RAM:

| Model | Size | Quality | Command |
|---|---|---|---|
| `qwen2.5:1.5b` | ~1 GB | Basic (CPU only) | `ollama pull qwen2.5:1.5b` |
| `qwen2.5:3b` | ~2 GB | Good | `ollama pull qwen2.5:3b` |
| `llama3.2:3b` | ~2 GB | Good | `ollama pull llama3.2:3b` |
| `qwen2.5:7b` | ~4.7 GB | Great | `ollama pull qwen2.5:7b` |

After pulling, update `VITE_OLLAMA_MODEL` in `.env` to match. For tool-calling support (function calling), prefer `qwen2.5:7b` or larger.

To switch models via Docker:

```bash
# Edit the ollama pull line in docker-compose.ollama.yml, then:
docker compose -f docker-compose.ollama.yml up ollama-init --force-recreate
```

---

## Start the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Using Claude instead of Ollama

For significantly more accurate results, you can switch to [Claude](https://anthropic.com) (Anthropic's API). Claude has built-in web search and does not need Ollama or SearXNG.

**This requires an Anthropic API key** — sign up at [console.anthropic.com](https://console.anthropic.com). New accounts get free credits to start.

Set these two values in `.env`:

```
VITE_USE_CLAUDE=true
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

That's it — no other changes needed. SearXNG is bypassed automatically when Claude is active (Claude handles web search internally).

> [!IMPORTANT]
> Your API key is stored only in your local `.env` file, which is gitignored and never committed. Do not paste your key anywhere else.

---

## Usage

1. Paste your website URL
2. The tool researches your site and generates 5 customer prompts across buying stages (Awareness → Decision)
3. Review the prompts, then click Analyze
4. View your results across 5 tabs:
   - **Overview** — overall visibility score, ChatGPT vs Gemini comparison, top sources
   - **Prompts** — per-prompt breakdown
   - **Market Share** — competitor brand mentions
   - **Citations** — sources the LLM referenced; click any row to see page titles, URLs, and which prompts cited them
   - **Actions** — prioritized recommendations (content to create, Reddit threads, Wikipedia, etc.)
