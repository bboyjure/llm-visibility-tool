const SEARXNG_URL = import.meta.env.VITE_SEARXNG_URL || '/api/searxng/search';

// Extract a meaningful search query from the LLM user prompt
const extractQuery = (usr) => {
  // "Query: "..." " pattern used in analysis prompts
  const qMatch = usr.match(/Query:\s*"([^"]+)"/);
  if (qMatch) return qMatch[1];
  // URL pattern — used in research prompts
  const urlMatch = usr.match(/https?:\/\/[^\s]+/);
  if (urlMatch) return urlMatch[0];
  // Fallback: first line, trimmed
  return usr.split('\n')[0].slice(0, 120);
};

// Returns a formatted string of top search results, or null if unavailable
export const searchWeb = async (usr, count = 5) => {
  const query = extractQuery(usr);
  try {
    const url = `${SEARXNG_URL}?q=${encodeURIComponent(query)}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const results = (data.results || []).slice(0, count);
    if (!results.length) return null;
    return results
      .map((r) => `- ${r.title}: ${r.content || r.url}`)
      .join('\n');
  } catch {
    return null;
  }
};
