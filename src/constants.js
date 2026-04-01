export const STAGES = ["Awareness", "Consideration", "Decision", "Problem-focused", "Solution-focused"];

export const STAGE_DOT = {
  Awareness: "#8B5CF6",
  Consideration: "#3B82F6",
  Decision: "#10B981",
  "Problem-focused": "#F59E0B",
  "Solution-focused": "#EF4444",
};

export const STAGE_PILL = {
  Awareness: { bg: "#8B5CF620", c: "#A78BFA" },
  Consideration: { bg: "#3B82F620", c: "#60A5FA" },
  Decision: { bg: "#10B98120", c: "#34D399" },
  "Problem-focused": { bg: "#F59E0B20", c: "#FBBF24" },
  "Solution-focused": { bg: "#EF444420", c: "#F87171" },
};

export const DONUT_COLORS = [
  "#818CF8", "#F59E0B", "#10B981", "#F87171", "#3B82F6",
  "#A78BFA", "#34D399", "#FBBF24", "#60A5FA", "#FB923C",
];

export const themes = {
  dark: {
    bg: "#0F1117", bgCard: "#181A23", bgInner: "#13151D", border: "#2A2D3A", borderLight: "#23263280",
    text: "#F0F0F4", textSec: "#9CA3B0", textTer: "#6B7280", textMut: "#4B5060",
    accent: "#818CF8", accentBg: "#818CF820", accentText: "#A5B4FC",
    track: "#23263A", rowHover: "#1C1F2E", rowHL: "#252845",
    grad: "linear-gradient(135deg, #6366F1, #818CF8)",
    youBg: "#312E81", youText: "#A5B4FC",
    inputBg: "#181A23", inputBorder: "#2A2D3A",
  },
  light: {
    bg: "#F7F8FA", bgCard: "#FFFFFF", bgInner: "#F9FAFB", border: "#E5E7EB", borderLight: "#F0F0F3",
    text: "#111827", textSec: "#6B7280", textTer: "#9CA3AF", textMut: "#D1D5DB",
    accent: "#6366F1", accentBg: "#6366F112", accentText: "#6366F1",
    track: "#F0F0F3", rowHover: "#F9FAFB", rowHL: "#F5F3FF",
    grad: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    youBg: "#EDE9FE", youText: "#6366F1",
    inputBg: "#FFFFFF", inputBorder: "#E5E7EB",
  },
};
