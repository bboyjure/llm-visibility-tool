export const callClaude = async (sys, usr, search = true) => {
  try {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: sys,
      messages: [{ role: "user", content: usr }],
    };
    if (search) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || null;
  } catch {
    return null;
  }
};

export const extractJSON = (text) => {
  if (!text) return null;
  for (const re of [/\[[\s\S]*?\](?=\s*$|\s*[^,\]\}])/, /\[[\s\S]*\]/, /\{[\s\S]*\}/]) {
    const m = text.match(re);
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
