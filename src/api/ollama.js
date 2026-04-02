import { searchWeb } from "./search";

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434/api/chat";
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || "qwen2.5:1.5b";

// jsonMode=true uses Ollama's format:"json" which forces valid JSON output
// search=true fetches SearXNG results and prepends them as context
export const callOllama = async (sys, usr, jsonMode = false, search = false) => {
  console.group(`[Ollama] ${jsonMode ? "JSON" : "TEXT"}${search ? "+search" : ""} call`);
  console.log("SYSTEM:", sys);
  console.log("USER:", usr);

  let userMsg = usr;
  if (search) {
    const webResults = await searchWeb(usr);
    if (webResults) {
      console.log("SEARCH RESULTS:", webResults);
      userMsg = `Web search results:\n${webResults}\n\n${usr}`;
    }
  }

  try {
    const body = {
      model: MODEL,
      stream: false,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: userMsg },
      ],
    };
    if (jsonMode) body.format = "json";
    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("HTTP error:", res.status, res.statusText);
      console.groupEnd();
      return null;
    }
    const data = await res.json();
    const content = data.message?.content || null;
    console.log("RESPONSE:", content);
    console.groupEnd();
    return content;
  } catch (e) {
    console.error("Fetch error:", e);
    console.groupEnd();
    return null;
  }
};

export const extractJSON = (text) => {
  if (!text) return null;
  // Strip markdown code fences first
  const src = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, "$1").trim();
  // Try parsing the whole response as-is first (preserves outer object)
  try { const p = JSON.parse(src); return Array.isArray(p) ? p : [p]; } catch {}
  // Fallback: extract outermost object first, then array
  for (const re of [/\{[\s\S]*\}/, /\[[\s\S]*\]/]) {
    const m = src.match(re);
    if (m) try { const p = JSON.parse(m[0]); return Array.isArray(p) ? p : [p]; } catch {}
  }
  return null;
};

export const normUrl = (i) => {
  let u = i.trim();
  if (!u.match(/^https?:\/\//i)) u = "https://" + u;
  try { return new URL(u).href; } catch { return null; }
};

export const getDom = (u) => {
  try { return new URL(u.startsWith("http") ? u : "https://" + u).hostname.replace("www.", ""); }
  catch { return u; }
};
