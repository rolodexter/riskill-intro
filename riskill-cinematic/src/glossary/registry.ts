export type GlossaryKey =
  | "ops.summary"
  | "ops.composite"
  | "ops.uptime"
  | "ops.risk.operational"
  | "ops.risk.technical"
  | "ops.risk.legal"
  | "ops.risk.economic";

export const GLOSSARY: Record<GlossaryKey, {
  title: string;
  quick: string;        // ≤120 chars (tooltip)
  detail: string[];     // bullets for explainer sheet
}> = {
  "ops.summary": {
    title: "Summary of key operational metrics",
    quick:
      "Synthesis KPI derived from connected files, databases, email, SaaS and SQL sources.",
    detail: [
      "Continuously ingests all connected data (files, DBs, email, SaaS, SQL).",
      "Streams metrics in real time; no static reports.",
      "Weights and reconciles signals (incidents, latency, risk, backlog).",
      "Click any term to see definition and data lineage."
    ]
  },
  "ops.composite": {
    title: "Composite operational view",
    quick: "Aggregated health from incidents, latency, backlog and risk forecast.",
    detail: [
      "Blends multiple leading/lagging indicators.",
      "Calibrated for executive scan (low false-positive rate).",
      "Hover/tap any label for meaning and source."
    ]
  },
  "ops.uptime": {
    title: "Uptime",
    quick: "Percent of time services met availability SLO across environments.",
    detail: [
      "Rollup of service uptime weighted by traffic share.",
      "Excludes planned maintenance windows.",
      "Links to incident timeline for root cause drill-down."
    ]
  },
  "ops.risk.operational": {
    title: "Operational Risk",
    quick: "Capacity, vendors, process variance and schedule slippage.",
    detail: [
      "Signals from throughput, backlog age, SLAs and staffing.",
      "Vendors and dependencies tracked for delivery risk.",
      "Change windows and freeze periods indicated in context."
    ]
  },
  "ops.risk.technical": {
    title: "Technical Risk",
    quick: "Incidents, reliability tails, vulnerabilities and debt.",
    detail: [
      "Correlates incident rate, MTTR, error budgets and rollbacks.",
      "Security advisories and unresolved CVEs weighted by exposure.",
      "Refactors and migrations tracked for blast radius."
    ]
  },
  "ops.risk.legal": {
    title: "Legal Risk",
    quick: "Regulatory filings, contractual obligations, DPIAs and audits.",
    detail: [
      "Upcoming compliance checkpoints and deadlines.",
      "Open matters from counsel and triage folders.",
      "Jurisdictional exposure and data handling constraints."
    ]
  },
  "ops.risk.economic": {
    title: "Economic Risk",
    quick: "Budget variance, demand shifts, FX/commodity sensitivity.",
    detail: [
      "Run-rate variance vs. plan; unit economics drift.",
      "External indicators (FX/commodity) linked to margin risk.",
      "Demand/booking signals and forecast confidence."
    ]
  }
};
