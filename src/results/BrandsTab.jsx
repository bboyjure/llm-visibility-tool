import { useState, useMemo } from "react";
import { useT } from "../context/ThemeContext";

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <span style={{ opacity: 0.3 }}>↕</span>;
  return <span>{sortDir === "asc" ? "↑" : "↓"}</span>;
}

export function BrandsTab({ brands, brandName, mode }) {
  const { t } = useT();
  const [sortCol, setSortCol] = useState("count");
  const [sortDir, setSortDir] = useState("desc");

  const card = { background: t.bgCard, borderRadius: 14, border: `1px solid ${t.border}`, padding: 22, transition: "background 0.3s, border-color 0.3s" };
  const hd = { fontSize: 14, fontWeight: 700, color: t.text, margin: 0 };
  const sub = { fontSize: 13, color: t.textTer, margin: 0 };
  const pTrack = { width: "100%", height: 5, background: t.track, borderRadius: 100, overflow: "hidden" };

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
      <div style={{ ...card, marginBottom: 16 }}>
        <h3 style={{ ...hd, marginBottom: 16 }}>Competitor Mentions vs {brandName}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {brands.slice(0, 10).map((b, i) => {
            const maxCount = brands[0]?.count || 1;
            const me = isBrand(b.name);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 100, flexShrink: 0, textAlign: "right" }}>
                  <span style={{ fontSize: 12, fontWeight: me ? 700 : 500, color: me ? t.accent : t.textSec }}>{b.name}</span>
                </div>
                <div style={{ flex: 1, height: 8, background: t.track, borderRadius: 100, overflow: "hidden" }}>
                  <div style={{
                    width: `${(b.count / maxCount) * 100}%`, height: "100%",
                    background: me ? t.accent : (mode === "dark" ? "#4B5563" : "#D1D5DB"),
                    borderRadius: 100, transition: "width 0.6s ease",
                  }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.text, minWidth: 32, textAlign: "right" }}>
                  {totalBrandCount > 0 ? (b.count / totalBrandCount * 100).toFixed(0) : 0}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sortable table */}
      <div style={{ ...card, overflowX: "auto" }}>
        <h3 style={{ ...hd, marginBottom: 4 }}>All Brands</h3>
        <p style={{ ...sub, marginBottom: 16 }}>Click column headers to sort</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.border}` }}>
              {[{ k: "name", l: "Brand", align: "left" }, { k: "count", l: "Total", align: "center" }, { k: "openai", l: "ChatGPT", align: "center" }, { k: "gemini", l: "Gemini", align: "center" }].map(col => (
                <th key={col.k} onClick={() => handleSort(col.k)} style={{
                  textAlign: col.align, padding: "10px 12px", fontSize: 10, fontWeight: 700,
                  color: t.textMut, textTransform: "uppercase", letterSpacing: "0.06em",
                  cursor: "pointer", userSelect: "none",
                }}>
                  {col.l} <SortIcon col={col.k} sortCol={sortCol} sortDir={sortDir} />
                </th>
              ))}
              <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 10, fontWeight: 700, color: t.textMut, textTransform: "uppercase", width: 120 }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {sortedBrands.map((b, i) => {
              const share = totalBrandCount > 0 ? (b.count / totalBrandCount * 100) : 0;
              const me = isBrand(b.name);
              return (
                <tr key={i} style={{ background: me ? t.rowHL : "transparent", borderBottom: `1px solid ${t.borderLight}` }}>
                  <td style={{ padding: 12 }}>
                    <span style={{ fontWeight: me ? 700 : 500, color: me ? t.accent : t.text }}>{b.name}</span>
                    {me && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, background: t.youBg, color: t.youText, padding: "2px 6px", borderRadius: 4 }}>YOU</span>}
                  </td>
                  <td style={{ padding: 12, textAlign: "center", fontWeight: 700, color: t.text }}>{b.count}</td>
                  <td style={{ padding: 12, textAlign: "center", color: "#10A37F", fontWeight: 600 }}>{b.openai}</td>
                  <td style={{ padding: 12, textAlign: "center", color: "#4285F4", fontWeight: 600 }}>{b.gemini}</td>
                  <td style={{ padding: 12, width: 120 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, ...pTrack, height: 4 }}>
                        <div style={{ width: `${share}%`, height: "100%", background: me ? t.accent : "#6B7280", borderRadius: 100 }} />
                      </div>
                      <span style={{ fontSize: 11, color: t.textTer, fontWeight: 600, minWidth: 28, textAlign: "right" }}>{share.toFixed(0)}%</span>
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
