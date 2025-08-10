import type { KPIIconName, TrendDir } from "../components/icons/KPI";

export type KPIMetric = { label: string; value: string };
export type KPITrend = { dir: TrendDir; pct: string; period: string };
export type KPIItem = {
  id: string;
  title: string;
  icon: KPIIconName;
  primary: string;
  contextShort: string; // parenthetical source/context shown inline
  secondary?: KPIMetric[]; // up to 2
  trend?: KPITrend; // optional
  narrative: string; // messenger body
};

export const KPI_COPY = {
  opsHealth: {
    id: "ops-health",
    title: "Ops Health",
    icon: "ops" as const,
    primary: "—",
    contextShort: "(Composite operational score)",
    secondary: [
      { label: "Uptime", value: "99.9%" },
      { label: "Backlog", value: "Low" },
    ],
    trend: { dir: "flat", pct: "0%", period: "v. prior 30 days" },
    narrative:
      "Ops Health is a composite indicator derived from service uptime, SLA adherence, backlog velocity, and incident impact across your connected sources. Scores update as telemetry and ticket data refresh.",
  } as KPIItem,
  riskAlerts: {
    id: "risk-alerts",
    title: "Risk Alerts",
    icon: "risk" as const,
    primary: "0",
    contextShort: "(Open critical risks)",
    secondary: [
      { label: "High", value: "0" },
      { label: "Medium", value: "2" },
    ],
    trend: { dir: "down", pct: "-1", period: "v. prior 7 days" },
    narrative:
      "Risk Alerts aggregates model- and rule-based findings from your Riskill detectors. Counts are grouped by severity and de-duplicated per entity. Trends compare against your selected lookback period.",
  } as KPIItem,
  agentActivity: {
    id: "agent-activity",
    title: "Agent Activity",
    icon: "agent" as const,
    primary: "—",
    contextShort: "(Agents online)",
    secondary: [
      { label: "24h Actions", value: "—" },
      { label: "Avg. Latency", value: "—" },
    ],
    trend: { dir: "up", pct: "+4%", period: "v. prior 7 days" },
    narrative:
      "Agent Activity summarizes connected assistant sessions, task runs, and response latency. Use this to understand utilization and recent changes across your org.",
  } as KPIItem,
};
