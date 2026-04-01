# LLM Visibility Analysis Tool

A free, open-source tool that analyzes how well your website/brand appears in AI assistant responses (ChatGPT, Gemini). Paste your URL, get 5 customer-intent prompts, and see which brands and sources the AI recommends — plus actionable steps to improve your visibility.

**No API keys. No costs. Runs entirely on your machine.**

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
```

Change `VITE_OLLAMA_MODEL` to any model you want (see options below).

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
| `qwen2.5:1.5b` | ~1 GB | Basic | `ollama pull qwen2.5:1.5b` |
| `qwen2.5:3b` | ~2 GB | Good | `ollama pull qwen2.5:3b` |
| `phi3.5:mini` | ~2.2 GB | Good | `ollama pull phi3.5:mini` |
| `llama3.2:3b` | ~2 GB | Good | `ollama pull llama3.2:3b` |
| `qwen2.5:7b` | ~4.7 GB | Great | `ollama pull qwen2.5:7b` |

After pulling, update `VITE_OLLAMA_MODEL` in `.env` to match.

---

## Start the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

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
