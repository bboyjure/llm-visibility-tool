import { callOllama } from "./ollama";
import { callClaude } from "./claude";
export { extractJSON, normUrl, getDom } from "./ollama";

const USE_CLAUDE = import.meta.env.VITE_USE_CLAUDE === "true";

// Unified call — uses Claude if VITE_USE_CLAUDE=true, otherwise Ollama
// jsonMode only applies to Ollama (Claude doesn't need it)
export const callLLM = (sys, usr, jsonMode = false) =>
  USE_CLAUDE ? callClaude(sys, usr, true) : callOllama(sys, usr, jsonMode);
