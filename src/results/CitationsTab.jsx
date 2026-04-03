import { useState } from "react";

export function CitationsTab({ citations }) {
  const [expanded, setExpanded] = useState(null);

  const toggle = (i) => setExpanded(expanded === i ? null : i);

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5 transition-colors duration-300">
      <h3 className="text-[14px] font-bold text-text mb-1">Top Cited Sources</h3>
      <p className="text-[13px] text-text-ter mb-4">Where LLMs sourced their answers — click a row for details</p>
      <div className="flex flex-col">
        {citations.map((c, i) => (
          <div
            key={i}
            style={{ borderBottom: i < citations.length - 1 ? "1px solid var(--color-border-light)" : "none" }}
          >
            {/* Row header */}
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between py-3 gap-3 bg-transparent border-none cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-track flex items-center justify-center text-[12px] font-bold text-text-ter shrink-0">
                  {c.domain.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="block text-[13px] font-semibold text-accent overflow-hidden text-ellipsis whitespace-nowrap">
                    {c.domain}
                  </span>
                  <span className="text-[11px] text-text-mut">{c.urls.length} URL{c.urls.length !== 1 ? "s" : ""} · {c.sources.length} citation{c.sources.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex gap-0.75">
                  {c.llms.map(l => (
                    <div
                      key={l}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                      style={{ background: l === "OpenAI" ? "#10A37F" : "#4285F4" }}
                    >
                      {l === "OpenAI" ? "C" : "G"}
                    </div>
                  ))}
                </div>
                <span className="text-[13px] font-bold text-text min-w-14 text-right">{c.count} resp.</span>
                <span className="text-[11px] text-text-ter w-4">{expanded === i ? "▲" : "▼"}</span>
              </div>
            </button>

            {/* Expanded detail */}
            {expanded === i && (
              <div className="pb-4 pl-9 flex flex-col gap-4">
                {/* URLs with titles */}
                {c.urls.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-text-ter uppercase tracking-wider mb-2">Pages cited</div>
                    <div className="flex flex-col gap-1.5">
                      {c.urls.map((url, j) => (
                        <a
                          key={j}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col no-underline group"
                        >
                          <span className="text-[13px] font-medium text-accent group-hover:underline leading-snug">
                            {c.titles[url] || url}
                          </span>
                          {c.titles[url] && (
                            <span className="text-[11px] text-text-mut overflow-hidden text-ellipsis whitespace-nowrap max-w-120">
                              {url}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source contexts */}
                {c.sources.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-text-ter uppercase tracking-wider mb-2">Cited in responses</div>
                    <div className="flex flex-col gap-2">
                      {c.sources.map((s, j) => (
                        <div key={j} className="flex gap-2 items-start">
                          <div
                            className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                            style={{ background: s.llm === "OpenAI" ? "#10A37F" : "#4285F4" }}
                          >
                            {s.llm === "OpenAI" ? "C" : "G"}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-semibold text-text-sec">{s.stage}</span>
                            <span className="text-[11px] text-text-ter"> · {s.llm === "OpenAI" ? "ChatGPT" : "Gemini"}</span>
                            {s.summary && s.summary !== "N/A" && s.summary !== "Error" && (
                              <p className="text-[12px] text-text-sec mt-0.5 mb-0 leading-snug">{s.summary}</p>
                            )}
                            <p className="text-[11px] text-text-mut mt-0.5 mb-0 overflow-hidden text-ellipsis whitespace-nowrap max-w-120" title={s.prompt}>
                              Query: {s.prompt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {citations.length === 0 && (
        <p className="text-center text-text-mut py-10">No citations detected.</p>
      )}
    </div>
  );
}
