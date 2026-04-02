import { callOllama } from "./ollama";
import { callClaude } from "./claude";
export { extractJSON, normUrl, getDom } from "./ollama";

const USE_CLAUDE = import.meta.env.VITE_USE_CLAUDE === "true";

// Unified call — uses Claude if VITE_USE_CLAUDE=true, otherwise Ollama
// jsonMode: force JSON output (Ollama only)
// search: fetch SearXNG results and inject as context (Ollama only; Claude always searches)
export const callLLM = (sys, usr, jsonMode = false, search = false) =>
  USE_CLAUDE ? callClaude(sys, usr, true) : callOllama(sys, usr, jsonMode, search);
