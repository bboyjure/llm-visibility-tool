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

export function ResultsDashboard({ results, brandName, url, activeTab, setActiveTab, onReset }) {
  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      {/* Header */}
      <div className="bg-bg-card border-b border-border px-5 py-3.5">
        <div className="max-w-250 mx-auto flex items-center justify-between flex-wrap gap-2.5">
          <div>
            <h1 className="text-[17px] font-extrabold text-text m-0">Visibility Report</h1>
            <p className="text-[12px] text-text-ter mt-0.5 m-0">{brandName} · {getDom(url)} · {results.totalPrompts} prompts</p>
          </div>
          <div className="flex gap-2">
            <Toggle />
            <button
              onClick={onReset}
              className="bg-bg-card text-text-sec border border-border rounded-xl px-3.5 py-2 text-[12px] font-semibold cursor-pointer"
            >
              + New
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bg-card border-b border-border overflow-x-auto">
        <div className="max-w-250 mx-auto flex">
          {TABS.map(tb => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className="px-4 py-3 border-none bg-transparent cursor-pointer text-[13px] font-semibold whitespace-nowrap transition-colors duration-150"
              style={{
                color: activeTab === tb.id ? "var(--color-accent)" : "var(--color-text-ter)",
                borderBottom: activeTab === tb.id ? "2px solid var(--color-accent)" : "2px solid transparent",
              }}
            >
              {tb.l}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-250 mx-auto p-5">
        {activeTab === "overview" && <OverviewTab results={results} />}
        {activeTab === "prompts" && <PromptsTab promptData={results.promptData} />}
        {activeTab === "brands" && <BrandsTab brands={results.brands} brandName={brandName} />}
        {activeTab === "citations" && <CitationsTab citations={results.citations} />}
        {activeTab === "actions" && <ActionsTab recs={results.recs} />}
      </div>
    </div>
  );
}
