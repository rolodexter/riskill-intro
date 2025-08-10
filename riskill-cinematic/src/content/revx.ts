// Content config for revx (Sprint 1.5)
// All stage copy/labels and micro-icon metadata live here for easy iteration/localization

export type RevxTone = "neutral" | "blue" | "purple" | "amber" | "emerald";

export type RevxStage = {
  id: string;
  label: string;
  tone: RevxTone;
  // Simple micro-icon identifier; UI chooses which inline SVG to render
  icon: "layers" | "chip" | "eye" | "logic" | "synthesis";
  copy?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
};

// UI copy/labels for revx surfaces
export type RevxUiCopy = {
  bubble: {
    copy_compact: string;
    copy_full: string;
    prompt_stack: string;
    learn_more: string;
    aria_label: string;
  };
  overlay: {
    title: string;
    cta_label: string;
  };
  actions: {
    explore_stack: string;
    bubble_toggle_aria: string;
    bubble_toggle_title: string;
  };
  carousel: {
    tracker_aria_label: string;
    prev_label: string;
    next_label: string;
    agent_placeholder_aria: string;
    vision_text: string;
    synthesis_label: string;
  };
};

export const REVX_UI: RevxUiCopy = {
  bubble: {
    copy_compact: "Live insight from coordinated AI models.",
    copy_full:
      "Live insight. LLMs parsed reports, Vision read invoices, Symbolic models forecasted.",
    prompt_stack: "Want to see the stack?",
    learn_more: "Learn more",
    aria_label: "AI explanation",
  },
  overlay: {
    title: "Revenue Stack Explorer",
    cta_label: "Drill into revenue drivers",
  },
  actions: {
    explore_stack: "Explore stack",
    bubble_toggle_aria: "How this is generated",
    bubble_toggle_title: "How this is generated",
  },
  carousel: {
    tracker_aria_label: "Stack stages",
    prev_label: "Previous",
    next_label: "Next",
    agent_placeholder_aria: "Agent bubble placeholder",
    vision_text: "OCR snippets (redacted) flowing in…",
    synthesis_label: "MRR (placeholder)",
  },
};

export const REVX_STAGES: RevxStage[] = [
  {
    id: "inputs",
    label: "Raw Inputs",
    tone: "neutral",
    icon: "layers",
    copy: {
      xs: "Raw docs and transactions",
      md: "Docs, TXNs, and sources flowing in",
    },
  },
  {
    id: "llm",
    label: "Language • LLM",
    tone: "blue",
    icon: "chip",
    copy: { xs: "Parsing + normalizing" },
  },
  {
    id: "vision",
    label: "Vision",
    tone: "purple",
    icon: "eye",
    copy: { xs: "OCR snippets" },
  },
  {
    id: "symbolic",
    label: "Symbolic Logic",
    tone: "amber",
    icon: "logic",
    copy: { xs: "Rules + checks" },
  },
  {
    id: "synthesis",
    label: "Synthesis",
    tone: "emerald",
    icon: "synthesis",
    copy: { xs: "KPIs + trends" },
  },
];
