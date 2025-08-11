export type MicroKey = "uptime" | "backlog" | "sla";
export interface MicroEntry {
  key: MicroKey;
  label: string;
  maxWords: number;
  summary: string;
  prompts: string[];
}
export interface SystemsCatalog {
  erp: string[]; crm: string[]; itsm: string[]; project: string[]; data: string[]; docs: string[];
}

export const MICRO: MicroEntry[] = [
  { key: "uptime",  label: "Uptime",  maxWords: 15,
    summary: "99.9% uptime — uninterrupted this week.",
    prompts: ["Explain last incident", "Compare uptime by vendor", "Forecast risk next 14 days"] },
  { key: "backlog", label: "Backlog", maxWords: 15,
    summary: "Backlog minimal: 3 issues, declining.",
    prompts: ["Top causes this month", "Who’s blocked and why", "Cycle time vs last quarter"] },
  { key: "sla",     label: "SLA",     maxWords: 15,
    summary: "SLAs met, zero penalties forecast.",
    prompts: ["Which contracts are at risk", "Latency trend 95th pct", "Penalty impact modeling"] }
];

export const SYSTEMS: SystemsCatalog = {
  erp: ["SAP", "Oracle NetSuite", "Dynamics 365"],
  crm: ["Salesforce", "HubSpot"],
  itsm:["ServiceNow", "Jira Service Management", "Zendesk"],
  project:["Asana", "Monday.com", "Jira"],
  data:["Snowflake", "BigQuery"],
  docs:["SharePoint", "Confluence", "Google Drive"],
};
