// Risk Index content, labels, thresholds, and mock payload
// Types
export type RiskDomainId = 'operational' | 'technical' | 'legal' | 'economic';

export type RiskDomain = {
  id: RiskDomainId;
  severity: number;     // 0..1
  probability: number;  // 0..1
  proximity: number;    // 0..1 (sooner = higher)
  impact: number;       // 0..1
  coverage: number;     // 0..1 data completeness
  lastUpdate: string;   // ISO timestamp
  trend7d: number;      // normalized -1..+1
};

export type RiskIndexPayload = {
  composite: number;    // 0..100
  trend7d: number;      // scaled -100..+100 (EWMA)
  domains: RiskDomain[];
};

// Tokenized labels and thresholds (no raw colors here)
export const RISK_LABELS = {
  high: 'high',
  moderate: 'moderate',
  low: 'low',
  veryLow: 'very low',
} as const;

export const RISK_THRESHOLDS = {
  highMax: 34,          // 0–34 → high (bad)
  moderateMax: 69,      // 35–69 → moderate
  lowMax: 84,           // 70–84 → low
  veryLowMax: 100,      // 85–100 → very low
} as const;

export const RISK_DOMAINS: RiskDomainId[] = ['operational', 'technical', 'legal', 'economic'];

export function labelForComposite(score: number): string {
  if (score <= RISK_THRESHOLDS.highMax) return RISK_LABELS.high;
  if (score <= RISK_THRESHOLDS.moderateMax) return RISK_LABELS.moderate;
  if (score <= RISK_THRESHOLDS.lowMax) return RISK_LABELS.low;
  return RISK_LABELS.veryLow;
}

// Mock payload for stub preview
export function getMockRiskIndexPayload(now: Date = new Date()): RiskIndexPayload {
  const iso = (d: Date) => d.toISOString();
  const t = now.getTime();
  const d0 = new Date(t - 60 * 60 * 1000);   // 1h ago
  const d1 = new Date(t - 2 * 60 * 60 * 1000); // 2h ago
  const d2 = new Date(t - 3 * 60 * 60 * 1000); // 3h ago
  const d3 = new Date(t - 4 * 60 * 60 * 1000); // 4h ago

  return {
    composite: 78,
    trend7d: -3, // scaled -100..+100
    domains: [
      {
        id: 'operational',
        severity: 0.45,
        probability: 0.40,
        proximity: 0.35,
        impact: 0.50,
        coverage: 0.9,
        lastUpdate: iso(d0),
        trend7d: +0.25,
      },
      {
        id: 'economic',
        severity: 0.40,
        probability: 0.38,
        proximity: 0.30,
        impact: 0.45,
        coverage: 0.8,
        lastUpdate: iso(d1),
        trend7d: -0.30,
      },
      {
        id: 'legal',
        severity: 0.35,
        probability: 0.32,
        proximity: 0.25,
        impact: 0.40,
        coverage: 0.7,
        lastUpdate: iso(d2),
        trend7d: +0.02, // stable
      },
      {
        id: 'technical',
        severity: 0.42,
        probability: 0.36,
        proximity: 0.28,
        impact: 0.48,
        coverage: 0.85,
        lastUpdate: iso(d3),
        trend7d: -0.05, // slightly down
      },
    ],
  };
}
