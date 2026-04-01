# LLM Visibility Analysis Tool

A free, open-source tool that analyzes how well your website/brand appears in AI assistant responses (ChatGPT, Gemini). Paste your URL, get 5 customer-intent prompts, and see which brands and sources the AI recommends — plus actionable steps to improve your visibility.

**No API keys. No costs. Runs entirely on your machine.**

> [!WARNING]
> **Results accuracy disclaimer**
> The default model (`qwen2.5:1.5b`) is intentionally very small so the tool runs on a regular CPU without a GPU. This means the results **are not accurate** — brand mentions, citations, and visibility scores are based on the model's limited training knowledge, not real web searches.
>
> For meaningful results, use a larger model with actual web search capability (e.g. a locally run 7B+ model, or a hosted model like Claude/GPT with web search). See the model table below to upgrade.

---

## How it works

The tool uses **[Ollama](https://ollama.com)** — a free, open-source runtime for running large language models locally on your own hardware. No data leaves your machine, no subscriptions required.

The LLM simulates what ChatGPT and Gemini would say for each prompt, identifies brand mentions, and extracts citation sources — giving you a visibility score and recommendations.

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

## Running Ollama

You have two options:

### Option A — Docker (recommended, no install needed)

Requires [Docker](https://www.docker.com/get-started) and Docker Compose.

```bash
docker compose up -d
```

This starts Ollama and automatically pulls the `qwen2.5:1.5b` model (~1GB). Wait about 30 seconds for the model to finish downloading, then start the app.

To switch models, update `VITE_OLLAMA_MODEL` in `.env` and change the model name in `docker-compose.yml` (the `ollama pull` line), then re-run:

```bash
docker compose up ollama-init --force-recreate
```

### Option B — Run Ollama locally

1. Install Ollama from [ollama.com](https://ollama.com)
2. Pull a model:
   ```bash
   ollama pull qwen2.5:1.5b
   ```
3. Ollama starts automatically and listens on `http://localhost:11434`

---

## Choosing a model

Larger models give better, more realistic results. Pick based on your available RAM:

| Model | Size | Quality | Command |
|---|---|---|---|
| `qwen2.5:1.5b` | ~1 GB | Basic (CPU only) | `ollama pull qwen2.5:1.5b` |
| `qwen2.5:3b` | ~2 GB | Good | `ollama pull qwen2.5:3b` |
| `phi3.5:mini` | ~2.2 GB | Good | `ollama pull phi3.5:mini` |
| `llama3.2:3b` | ~2 GB | Good | `ollama pull llama3.2:3b` |
| `qwen2.5:7b` | ~4.7 GB | Great | `ollama pull qwen2.5:7b` |

After pulling, update `VITE_OLLAMA_MODEL` in `.env` to match.

---

## Getting accurate results — enabling web search

By default, the model answers from its training knowledge only. For real visibility analysis, you want the model to actually search the web. There are a few ways to do this:

### Option 1 — Ollama native web search API

Ollama exposes a `POST /api/search` endpoint that lets models fetch live web results. This requires an [Ollama account](https://ollama.com) and may have rate limits on free tiers.

You also need a model that supports **tool calling** (function calling). Recommended:

```bash
ollama pull qwen3:8b          # good balance of size and capability
ollama pull llama3.1:8b       # strong tool-calling support
ollama pull qwen3:30b-a3b     # best results, needs ~20GB RAM
```

Update `.env`:
```
VITE_OLLAMA_MODEL=qwen3:8b
```

### Option 2 — Open WebUI (recommended for non-technical users)

[Open WebUI](https://github.com/open-webui/open-webui) is a browser-based interface for Ollama that has **built-in web search** via DuckDuckGo or Bing — no extra setup needed.

```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main
```

Open `http://localhost:3000`, connect it to your local Ollama, and enable web search in the settings. You can then use it alongside this tool.

### Option 3 — MCP servers (advanced)

If you use Claude Desktop or another MCP-compatible client, you can attach an MCP web search server (e.g. [mcphost](https://github.com/mark3labs/mcphost)) to give any local model real-time search capabilities.

> [!NOTE]
> Whichever method you choose, the model must support **tool calling** for web search to work. Check the model's page on [ollama.com/library](https://ollama.com/library) — look for the `tools` tag.

---

## Start the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Using Claude instead of Ollama

For significantly more accurate results, you can switch the backend to [Claude](https://anthropic.com) (Anthropic's API). Claude has built-in web search and is a much more capable model, making the visibility analysis far more realistic.

**This requires an Anthropic API key** — sign up at [console.anthropic.com](https://console.anthropic.com). New accounts get free credits to start.

Set these two values in `.env`:

```
VITE_USE_CLAUDE=true
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

That's it — no other changes needed. The app will automatically use Claude with web search enabled for all analysis calls.

> [!IMPORTANT]
> Your API key is stored only in your local `.env` file, which is gitignored and never committed. Do not paste your key anywhere else.

---

## Usage

1. Paste your website URL
2. The tool generates 5 customer prompts across buying stages (Awareness → Decision)
3. Review the prompts, then click Analyze
4. View your results across 5 tabs:
   - **Overview** — overall visibility score, ChatGPT vs Gemini comparison
   - **Prompts** — per-prompt breakdown
   - **Market Share** — competitor brand mentions
   - **Citations** — sources the LLM referenced
   - **Actions** — prioritized recommendations (content to create, Reddit threads, Wikipedia, etc.)
