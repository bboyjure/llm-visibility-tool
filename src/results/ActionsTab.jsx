import { Pill } from "../components/Pill";

export function ActionsTab({ recs }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="bg-grad rounded-2xl px-6 py-5 text-white">
        <h3 className="text-[17px] font-extrabold mb-1">Recommended Actions</h3>
        <p className="text-[13px] text-white/70 m-0">Based on where LLMs source their answers.</p>
      </div>
      {recs.map((rec, i) => (
        <div key={i} className="bg-bg-card border border-border rounded-2xl p-5 flex items-start gap-3.5 transition-colors duration-300">
          <div className="w-9.5 h-9.5 rounded-xl bg-track flex items-center justify-center text-[18px] shrink-0">
            {rec.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[13px] font-bold text-text">{rec.action}</span>
              <Pill bg={rec.pri === "High" ? "#EF444420" : "#F59E0B20"} color={rec.pri === "High" ? "#F87171" : "#FBBF24"}>
                {rec.pri}
              </Pill>
              {rec.type && <Pill bg="var(--color-accent-bg)" color="var(--color-accent-text)">{rec.type}</Pill>}
            </div>
            <p className="text-[12px] text-text-sec leading-relaxed m-0">{rec.detail}</p>
            {rec.source && <div className="text-[11px] text-text-mut mt-1.5">Source: {rec.source}</div>}
            {rec.links && rec.links.length > 0 && (
              <div className="flex flex-col gap-0.75 mt-2">
                {rec.links.map((link, j) => (
                  <a
                    key={j}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-accent overflow-hidden text-ellipsis whitespace-nowrap no-underline"
                  >
                    🔗 {link}
                  </a>
                ))}
              </div>
            )}
            {rec.domains && (
              <div className="flex flex-wrap gap-1 mt-2">
                {rec.domains.map((d, j) => (
                  <span key={j} className="text-[10px] bg-track text-text-ter px-2 py-0.75 rounded-md font-medium">{d}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {recs.length === 0 && (
        <div className="bg-bg-card border border-border rounded-2xl p-12 text-center transition-colors duration-300">
          <div className="text-[32px] mb-2">🎉</div>
          <p className="text-text-ter font-semibold">Visibility is strong!</p>
        </div>
      )}
    </div>
  );
}
