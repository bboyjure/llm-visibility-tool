import { useState, useRef, useCallback } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { callLLM, extractJSON, normUrl, getDom } from "./api/llm";
import { getSearchCitations } from "./api/search";
import { STAGES } from "./constants";
import { InputScreen } from "./screens/InputScreen";
import { GeneratingScreen } from "./screens/GeneratingScreen";
import { PromptsScreen } from "./screens/PromptsScreen";
import { AnalyzingScreen } from "./screens/AnalyzingScreen";
import { ResultsDashboard } from "./results/ResultsDashboard";

function AppInner() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState("input");
  const [prompts, setPrompts] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });
  const [brandName, setBrandName] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const timerRef = useRef(null);

  const startTO = (ms, cb) => { clearTimeout(timerRef.current); timerRef.current = setTimeout(cb, ms); };
  const clearTO = () => clearTimeout(timerRef.current);

  const generatePrompts = useCallback(async () => {
    const norm = normUrl(url);
    if (!norm) { setError("Please enter a valid URL"); return; }
    setError(""); setStep("generating");
    startTO(120000, () => { setError("Sorry, we couldn't fetch results. The website may be unreachable. Please try again."); setStep("input"); });
    try {
      const research = await callLLM(
        "You are a business analyst. Research this website and extract: brand name, product/service category (be specific, e.g. 'project management software', 'CRM for real estate'), target audience (e.g. 'small businesses', 'enterprise teams'), 3-5 key features or offerings, and 2-3 known competitors or alternatives in the same space. Be concise and specific.",
        `Analyze the business at this URL: ${norm}`,
        false,
        true
      );
      if (!research) throw new Error("Could not analyze website");
      const raw = await callLLM(
        "You output only valid JSON. No explanation, no markdown, no extra text.",
        `Business research: ${research}\n\nGenerate exactly 5 search prompts a real potential customer would type into an AI assistant (ChatGPT, Gemini) when looking for this type of product or service. Make each prompt specific to this industry, audience, and use-case — not generic.\n\nExample style for a CRM tool:\n- Awareness: "What tools help manage customer relationships?"\n- Consideration: "Best CRM software for small businesses"\n- Decision: "Salesforce vs HubSpot comparison"\n- Problem-focused: "How to track customer communications effectively"\n- Solution-focused: "CRM with email integration recommendations"\n\nReturn this exact JSON structure:\n{"brand":"BrandName","prompts":[{"stage":"Awareness","prompt":"..."},{"stage":"Consideration","prompt":"..."},{"stage":"Decision","prompt":"..."},{"stage":"Problem-focused","prompt":"..."},{"stage":"Solution-focused","prompt":"..."}]}`,
        true
      );
      const parsed = extractJSON(raw);
      const obj = parsed ? (Array.isArray(parsed) ? parsed[0] : parsed) : null;
      const promptList = obj?.prompts;
      console.log("[generatePrompts] raw response:", raw);
      console.log("[generatePrompts] extractJSON result:", parsed);
      console.log("[generatePrompts] obj:", obj);
      console.log("[generatePrompts] promptList:", promptList);
      if (!promptList || promptList.length < 5) throw new Error("Failed to generate prompts");
      setBrandName(obj.brand || getDom(norm).split(".")[0]);
      setPrompts(promptList.filter(p => p.stage && p.prompt));
      clearTO(); setStep("prompts");
    } catch (e) { clearTO(); setError(e.message); setStep("input"); }
  }, [url]);

  const analyze = useCallback(async () => {
    setStep("analyzing");
    const total = prompts.length * 2;
    setProgress({ current: 0, total, label: "Starting..." });
    startTO(300000, () => { setError("Analysis timed out."); setStep("input"); });
    const all = [];
    for (const p of prompts) {
      for (const llm of ["OpenAI", "Gemini"]) {
        setProgress({ current: all.length, total, label: `${llm} · ${p.stage}` });
        try {
          const raw = await callLLM(
            `You are simulating what ${llm === "OpenAI" ? "ChatGPT" : "Google Gemini"} would answer. Based on your training knowledge, identify relevant brands and typical sources for this query. Output only valid JSON.`,
            `Query: "${p.prompt}"\n\nReturn this exact JSON with real brand names and realistic source domains:\n{"brands_mentioned":[{"name":"BrandName","mentions":1,"context":"why mentioned"},{"name":"Brand2","mentions":1,"context":"why mentioned"}],"citations":[{"url":"https://example.com/page","domain":"example.com","title":"Page Title"},{"url":"https://site2.com","domain":"site2.com","title":"Title"}],"response_summary":"2 sentence summary of what the AI would say"}`,
            true,
            true
          );
          let parsed = extractJSON(raw);
          if (!parsed) {
            const fb = await callLLM(
              "You output only valid JSON, no explanation.",
              `For the search query "${p.prompt}", name 3 relevant software brands and 2 websites that would be cited. Use this format:\n{"brands_mentioned":[{"name":"Brand","mentions":1,"context":"ctx"}],"citations":[{"url":"https://ex.com","domain":"ex.com","title":"Title"}],"response_summary":"summary"}`,
              true,
              true
            );
            parsed = extractJSON(fb);
          }
          const r = parsed ? (Array.isArray(parsed) ? parsed[0] : parsed) : {};
          const searchCits = await getSearchCitations(p.prompt);
          all.push({ prompt: p.prompt, stage: p.stage, llm, brands: r.brands_mentioned || r.brands || [], citations: searchCits || r.citations || [], summary: r.response_summary || r.summary || "N/A" });
        } catch {
          all.push({ prompt: p.prompt, stage: p.stage, llm, brands: [], citations: [], summary: "Error" });
        }
      }
    }
    clearTO(); processResults(all);
  }, [prompts, brandName]);

  const processResults = (raw) => {
    const brand = brandName.toLowerCase();
    const bMap = {}; let totalM = 0, brandM = 0;
    raw.forEach(r => r.brands.forEach(b => {
      const n = b.name || "Unknown", k = n.toLowerCase(), c = b.mentions || 1;
      if (!bMap[k]) bMap[k] = { name: n, count: 0, openai: 0, gemini: 0 };
      bMap[k].count += c; if (r.llm === "OpenAI") bMap[k].openai += c; else bMap[k].gemini += c;
      totalM += c; if (k.includes(brand) || brand.includes(k)) brandM += c;
    }));
    const brands = Object.values(bMap).sort((a, b) => b.count - a.count);
    const vis = totalM > 0 ? (brandM / totalM) * 100 : 0;

    const isBrand = (name) => { const k = (name || "").toLowerCase(); return k.includes(brand) || brand.includes(k); };
    const presenceCount = raw.filter(r => r.brands.some(b => isBrand(b.name))).length;
    const presenceRate = raw.length > 0 ? (presenceCount / raw.length) * 100 : 0;
    const openaiRaw = raw.filter(r => r.llm === "OpenAI");
    const geminiRaw = raw.filter(r => r.llm === "Gemini");
    const openaiPresence = openaiRaw.length > 0 ? (openaiRaw.filter(r => r.brands.some(b => isBrand(b.name))).length / openaiRaw.length) * 100 : 0;
    const geminiPresence = geminiRaw.length > 0 ? (geminiRaw.filter(r => r.brands.some(b => isBrand(b.name))).length / geminiRaw.length) * 100 : 0;

    const cs = (res) => {
      let tt = 0, bm = 0;
      res.forEach(r => r.brands.forEach(x => {
        const c = x.mentions || 1; tt += c;
        if ((x.name || "").toLowerCase().includes(brand) || brand.includes((x.name || "").toLowerCase())) bm += c;
      }));
      return tt > 0 ? (bm / tt) * 100 : 0;
    };

    const promptData = prompts.map(p => {
      const pr = raw.filter(r => r.prompt === p.prompt);
      const llms = {};
      const localBMap = {};
      let localTotal = 0, localBrand = 0;
      pr.forEach(r => {
        let has = false;
        r.brands.forEach(b => {
          const c = b.mentions || 1;
          const k = (b.name || "").toLowerCase();
          if (!localBMap[k]) localBMap[k] = { name: b.name, count: 0 };
          localBMap[k].count += c;
          localTotal += c;
          if (k.includes(brand) || brand.includes(k)) { localBrand += c; has = true; }
        });
        llms[r.llm] = { mentioned: has, brands: r.brands, citations: r.citations, summary: r.summary };
      });
      const competitors = Object.values(localBMap)
        .filter(b => !(b.name.toLowerCase().includes(brand) || brand.includes(b.name.toLowerCase())))
        .sort((a, b) => b.count - a.count);
      return { ...p, vis: localTotal > 0 ? (localBrand / localTotal) * 100 : 0, llms, mostVisible: competitors[0]?.name || "—" };
    });

    const stages = STAGES.map(st => {
      const sr = raw.filter(r => r.stage === st);
      let tt = 0, bm = 0;
      sr.forEach(r => r.brands.forEach(x => {
        const c = x.mentions || 1; tt += c;
        if ((x.name || "").toLowerCase().includes(brand) || brand.includes((x.name || "").toLowerCase())) bm += c;
      }));
      return { stage: st, score: tt > 0 ? (bm / tt) * 100 : 0 };
    });

    const cMap = {};
    raw.forEach(r => r.citations.forEach(c => {
      const d = c.domain || getDom(c.url || "x");
      if (!cMap[d]) cMap[d] = { domain: d, count: 0, urls: [], llms: new Set() };
      cMap[d].count++; cMap[d].llms.add(r.llm);
      if (c.url && !cMap[d].urls.includes(c.url)) cMap[d].urls.push(c.url);
    }));
    const totalCit = Object.values(cMap).reduce((s, c) => s + c.count, 0);
    const citations = Object.values(cMap)
      .sort((a, b) => b.count - a.count)
      .map(c => ({ ...c, llms: [...c.llms], pct: totalCit > 0 ? (c.count / totalCit * 100) : 0 }));

    const recs = buildRecs(brands, citations, brandName, vis, stages, promptData, raw);
    setResults({
      overall: vis,
      openai: cs(raw.filter(r => r.llm === "OpenAI")),
      gemini: cs(raw.filter(r => r.llm === "Gemini")),
      presenceRate, presenceCount, totalChecks: raw.length,
      openaiPresence, geminiPresence,
      brands, citations, stages, promptData, perPrompt: raw, recs,
      totalPrompts: prompts.length,
    });
    setStep("results");
  };

  const buildRecs = (brands, cit, brand, score, stages, promptData, perPrompt) => {
    const r = [];
    const weak = stages.filter(s => s.score < 20);
    const reddit = cit.filter(c => c.domain.includes("reddit"));
    const wiki = cit.filter(c => c.domain.includes("wikipedia"));
    const med = cit.filter(c => c.domain.includes("medium"));
    const blogs = cit.filter(c =>
      c.domain.includes("blog") || c.domain.includes("hubspot") ||
      c.domain.includes("forbes") || c.domain.includes("techradar")
    );
    const lowVisPrompts = (promptData || []).filter(p => p.vis < 20);
    const allPrompts = (promptData || prompts);

    lowVisPrompts.forEach(p => {
      r.push({ icon: "📝", pri: "High", type: "Content", action: `Create an article on: "${p.prompt}"`, detail: `Your brand had only ${p.vis.toFixed(0)}% visibility for this ${p.stage.toLowerCase()} query. Write a comprehensive, SEO-optimized article targeting this exact topic on your blog. Include comparisons, how-tos, and mention your product naturally.`, source: "Low visibility prompt" });
    });

    if (reddit.length) {
      reddit.forEach(c => {
        r.push({ icon: "💬", pri: "High", type: "Reddit", action: `Comment on Reddit threads about your industry`, detail: `Reddit was cited ${c.count}x by LLMs. Find and contribute to active threads on ${c.domain.replace("reddit.com", "relevant subreddits")}. Provide genuine value — answer questions, share experiences, and mention ${brand} when naturally relevant.`, links: c.urls.slice(0, 3), source: `Cited ${c.count}x by LLMs` });
      });
      lowVisPrompts.slice(0, 2).forEach(p => {
        r.push({ icon: "💬", pri: "High", type: "Reddit", action: `Post on Reddit about: "${p.prompt.slice(0, 60)}"`, detail: `Create a helpful post or comment on Reddit addressing this topic. LLMs heavily cite Reddit discussions. Frame it as sharing your experience, not promoting.`, source: `Reddit cited for ${p.stage} queries` });
      });
    }

    if (med.length) {
      const topTopics = allPrompts.slice(0, 3);
      med.forEach(c => {
        r.push({ icon: "✍️", pri: "Medium", type: "Medium", action: `Publish on Medium about your expertise`, detail: `Medium was cited ${c.count}x. Write authoritative, long-form articles. LLMs frequently pull from Medium for in-depth content.`, links: c.urls.slice(0, 2), source: `Cited ${c.count}x` });
      });
      topTopics.forEach(p => {
        r.push({ icon: "✍️", pri: "Medium", type: "Medium", action: `Post on Medium: "${p.prompt.slice(0, 60)}"`, detail: `Write a detailed Medium article addressing this query. Include data, expert insights, and naturally reference ${brand}. Tag it with relevant topics for discoverability.`, source: `Target ${p.stage} stage` });
      });
    }

    if (wiki.length) {
      wiki.forEach(c => {
        r.push({ icon: "📖", pri: "Medium", type: "Wikipedia", action: `Update Wikipedia page for ${brand}`, detail: `Wikipedia was cited ${c.count}x by LLMs. If ${brand} has a Wikipedia page, ensure it's up-to-date with recent features, achievements, and accurate information. If it doesn't exist and the brand is notable enough, consider creating one following Wikipedia's guidelines.`, links: c.urls.slice(0, 2), source: `Cited ${c.count}x` });
      });
      r.push({ icon: "📖", pri: "Medium", type: "Wikipedia", action: `Get listed on Wikipedia comparison/category pages`, detail: `LLMs reference Wikipedia category and comparison pages. Find the "Comparison of..." or "List of..." Wikipedia pages relevant to your industry and ensure ${brand} is listed there (if it meets notability criteria).`, source: "Wikipedia category pages" });
    }

    const topComp = brands.filter(b => !b.name.toLowerCase().includes(brand.toLowerCase())).slice(0, 3);
    topComp.forEach(comp => {
      r.push({ icon: "⚔️", pri: "High", type: "Content", action: `Create comparison page: "${brand} vs ${comp.name}"`, detail: `${comp.name} was mentioned ${comp.count}x across LLM responses. Create a fair, detailed comparison page on your website. LLMs frequently reference comparison articles for decision-stage queries.`, source: `${comp.name}: ${comp.count} mentions` });
    });

    if (blogs.length) {
      blogs.slice(0, 3).forEach(c => {
        r.push({ icon: "🔗", pri: "Medium", type: "Outreach", action: `Get featured on ${c.domain}`, detail: `This publication was cited ${c.count}x by LLMs. Pitch a guest post, request inclusion in their listicles, or build a relationship for editorial mentions.`, links: c.urls.slice(0, 2), source: `Cited ${c.count}x` });
      });
    }

    weak.forEach(w => {
      const stagePrompt = allPrompts.find(p => p.stage === w.stage);
      r.push({
        icon: "🎯", pri: "High", type: "Strategy",
        action: `Improve ${w.stage} stage content${stagePrompt ? `: "${stagePrompt.prompt.slice(0, 50)}..."` : ""}`,
        detail: `Only ${w.score.toFixed(0)}% visibility in ${w.stage} queries. Create content that targets this intent type — ${w.stage === "Awareness" ? "educational guides and explainers" : w.stage === "Consideration" ? "comparison lists and reviews" : w.stage === "Decision" ? "detailed feature comparisons and case studies" : w.stage === "Problem-focused" ? "problem-solution articles and how-tos" : "product feature highlights and use-case articles"}.`,
        source: `${w.score.toFixed(0)}% visibility`,
      });
    });

    const otherTop = cit.filter(c =>
      !c.domain.includes(getDom(url)) &&
      !c.domain.includes("reddit") &&
      !c.domain.includes("wikipedia") &&
      !c.domain.includes("medium") &&
      !blogs.some(b => b.domain === c.domain)
    ).slice(0, 3);
    otherTop.forEach(c => {
      r.push({ icon: "🔗", pri: "Medium", type: "Outreach", action: `Get mentioned on ${c.domain}`, detail: `Cited ${c.count}x by LLMs. Pursue guest posts, product reviews, or partnership mentions.`, links: c.urls.slice(0, 2), source: `Cited ${c.count}x` });
    });

    return r.sort((a, b) => (a.pri === "High" ? 0 : 1) - (b.pri === "High" ? 0 : 1));
  };

  const handleReset = () => { setStep("input"); setResults(null); setPrompts([]); setActiveTab("overview"); };
  const handleBack = () => { setStep("input"); setPrompts([]); };

  if (step === "input") return <InputScreen url={url} setUrl={setUrl} error={error} setError={setError} onGenerate={generatePrompts} />;
  if (step === "generating") return <GeneratingScreen url={url} />;
  if (step === "prompts") return <PromptsScreen prompts={prompts} brandName={brandName} onAnalyze={analyze} onBack={handleBack} />;
  if (step === "analyzing") return <AnalyzingScreen progress={progress} />;
  if (step === "results" && results) return <ResultsDashboard results={results} brandName={brandName} url={url} activeTab={activeTab} setActiveTab={setActiveTab} onReset={handleReset} />;
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
