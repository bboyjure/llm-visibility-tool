export function CitationsTab({ citations }) {
  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5 transition-colors duration-300">
      <h3 className="text-[14px] font-bold text-text mb-1">Top Cited Sources</h3>
      <p className="text-[13px] text-text-ter mb-4">Where LLMs sourced their answers</p>
      <div className="flex flex-col">
        {citations.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 gap-3"
            style={{ borderBottom: i < citations.length - 1 ? "1px solid var(--color-border-light)" : "none" }}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-lg bg-track flex items-center justify-center text-[12px] font-bold text-text-ter shrink-0">
                {c.domain.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <a
                  href={`https://${c.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[13px] font-semibold text-accent overflow-hidden text-ellipsis whitespace-nowrap no-underline"
                >
                  {c.domain}
                </a>
                {c.urls.length > 0 && (
                  <a
                    href={c.urls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[11px] text-text-mut overflow-hidden text-ellipsis whitespace-nowrap max-w-75 no-underline"
                  >
                    {c.urls[0]}
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
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
              <span className="text-[13px] font-bold text-text min-w-15 text-right">{c.count} resp.</span>
            </div>
          </div>
        ))}
      </div>
      {citations.length === 0 && (
        <p className="text-center text-text-mut py-10">No citations detected.</p>
      )}
    </div>
  );
}
