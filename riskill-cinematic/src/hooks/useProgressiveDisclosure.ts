import { pub } from "../widgets/bus";

export type ProgressiveContext = {
  source: string; // e.g., "revenue-widget"
  cardId?: string;
  title?: string;
  primary?: string;
  metrics?: Array<{ label: string; value: string }>;
  anchorRect?: { top: number; left: number; right: number; bottom: number; width: number; height: number };
  narrative?: string;
};

/**
 * Progressive disclosure utility: call to escalate from summary → deep dive.
 * This emits an app-wide event so overlay chat can open with context.
 */
export function escalateToChat(ctx: ProgressiveContext) {
  pub("progressive.open", ctx);
}

/**
 * Hook wrapper in case we want to expand later (e.g., track last context).
 */
export function useProgressiveDisclosure() {
  return {
    escalateToChat,
  };
}
