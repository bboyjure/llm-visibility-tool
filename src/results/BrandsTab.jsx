import { useState, useMemo } from "react";

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <span className="opacity-30">↕</span>;
  return <span>{sortDir === "asc" ? "↑" : "↓"}</span>;
}

export function BrandsTab({ brands, brandName }) {
  const [sortCol, setSortCol] = useState("count");
  const [sortDir, setSortDir] = useState("desc");

  const totalBrandCount = brands.reduce((s, b) => s + b.count, 0);
  const isBrand = (n) => {
    const a = (n || "").toLowerCase(), b = brandName.toLowerCase();
    return a.includes(b) || b.includes(a);
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const sortedBrands = useMemo(() => {
    const arr = [...brands];
    arr.sort((a, b) => {
      const av = sortCol === "name" ? a.name.toLowerCase() : a[sortCol];
      const bv = sortCol === "name" ? b.name.toLowerCase() : b[sortCol];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [brands, sortCol, sortDir]);

  return (
    <>
      {/* Competitor horizontal bars */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 mb-4 transition-colors duration-300">
        <h3 className="text-[14px] font-bold text-text mb-4">Competitor Mentions vs {brandName}</h3>
        <div className="flex flex-col gap-2.5">
          {brands.slice(0, 10).map((b, i) => {
            const maxCount = brands[0]?.count || 1;
            const me = isBrand(b.name);
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-25 shrink-0 text-right">
                  <span
                    className="text-[12px]"
                    style={{ fontWeight: me ? 700 : 500, color: me ? "var(--color-accent)" : "var(--color-text-sec)" }}
                  >
                    {b.name}
                  </span>
                </div>
                <div className="flex-1 h-2 bg-track rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-500 ease-out"
                    style={{
                      width: `${(b.count / maxCount) * 100}%`,
                      background: me ? "var(--color-accent)" : "var(--color-bar-comp)",
                    }}
                  />
                </div>
                <span className="text-[12px] font-bold text-text min-w-8 text-right">
                  {totalBrandCount > 0 ? (b.count / totalBrandCount * 100).toFixed(0) : 0}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sortable table */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 overflow-x-auto transition-colors duration-300">
        <h3 className="text-[14px] font-bold text-text mb-1">All Brands</h3>
        <p className="text-[13px] text-text-ter mb-4">Click column headers to sort</p>
        <table className="w-full border-collapse text-[13px] min-w-120">
          <thead>
            <tr className="border-b-2 border-border">
              {[{ k: "name", l: "Brand", align: "left" }, { k: "count", l: "Total", align: "center" }, { k: "openai", l: "ChatGPT", align: "center" }, { k: "gemini", l: "Gemini", align: "center" }].map(col => (
                <th
                  key={col.k}
                  onClick={() => handleSort(col.k)}
                  className="px-3 py-2.5 text-[10px] font-bold text-text-mut uppercase tracking-widest cursor-pointer select-none"
                  style={{ textAlign: col.align }}
                >
                  {col.l} <SortIcon col={col.k} sortCol={sortCol} sortDir={sortDir} />
                </th>
              ))}
              <th className="px-3 py-2.5 text-[10px] font-bold text-text-mut uppercase tracking-widest text-left w-30">Share</th>
            </tr>
          </thead>
          <tbody>
            {sortedBrands.map((b, i) => {
              const share = totalBrandCount > 0 ? (b.count / totalBrandCount * 100) : 0;
              const me = isBrand(b.name);
              return (
                <tr
                  key={i}
                  className="border-b border-border-light"
                  style={{ background: me ? "var(--color-row-hl)" : "transparent" }}
                >
                  <td className="p-3">
                    <span style={{ fontWeight: me ? 700 : 500, color: me ? "var(--color-accent)" : "var(--color-text)" }}>{b.name}</span>
                    {me && (
                      <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "var(--color-you-bg)", color: "var(--color-you-text)" }}>
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center font-bold text-text">{b.count}</td>
                  <td className="p-3 text-center font-semibold text-[#10A37F]">{b.openai}</td>
                  <td className="p-3 text-center font-semibold text-[#4285F4]">{b.gemini}</td>
                  <td className="p-3 w-30">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-track rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${share}%`, background: me ? "var(--color-accent)" : "#6B7280" }}
                        />
                      </div>
                      <span className="text-[11px] text-text-ter font-semibold min-w-7 text-right">{share.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
