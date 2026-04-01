import { useT } from "../context/ThemeContext";
import { Toggle } from "../components/Toggle";
import { getDom } from "../api/llm";
import { OverviewTab } from "./OverviewTab";
import { PromptsTab } from "./PromptsTab";
import { BrandsTab } from "./BrandsTab";
import { CitationsTab } from "./CitationsTab";
import { ActionsTab } from "./ActionsTab";

const TABS = [
  { id: "overview", l: "Overview" },
  { id: "prompts", l: "Prompts" },
  { id: "brands", l: "Market Share" },
  { id: "citations", l: "Citations" },
  { id: "actions", l: "Actions" },
];

export function ResultsDashboard({ results, brandName, url, activeTab, setActiveTab, onReset, mode }) {
  const { t } = useT();
  const page = { fontFamily: "'Inter',-apple-system,system-ui,sans-serif", minHeight: "100vh", background: t.bg, transition: "background 0.3s" };

  return (
    <div style={page}>
      {/* Header */}
      <div style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, padding: "14px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: t.text, margin: 0 }}>Visibility Report</h1>
            <p style={{ fontSize: 12, color: t.textTer, margin: "2px 0 0" }}>{brandName} · {getDom(url)} · {results.totalPrompts} prompts</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Toggle />
            <button
              onClick={onReset}
              style={{ background: t.bgCard, color: t.textSec, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              + New
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, overflowX: "auto" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex" }}>
          {TABS.map(tb => (
            <button key={tb.id} onClick={() => setActiveTab(tb.id)} style={{
              padding: "12px 16px", border: "none", background: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              color: activeTab === tb.id ? t.accent : t.textTer,
              borderBottom: activeTab === tb.id ? `2px solid ${t.accent}` : "2px solid transparent",
            }}>
              {tb.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
        {activeTab === "overview" && <OverviewTab results={results} />}
        {activeTab === "prompts" && <PromptsTab promptData={results.promptData} />}
        {activeTab === "brands" && <BrandsTab brands={results.brands} brandName={brandName} mode={mode} />}
        {activeTab === "citations" && <CitationsTab citations={results.citations} />}
        {activeTab === "actions" && <ActionsTab recs={results.recs} />}
      </div>
    </div>
  );
}
