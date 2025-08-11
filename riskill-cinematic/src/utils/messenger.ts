import { emit } from "./telemetry";
import { pub } from "../widgets/bus";

export type MessengerIntent = "discuss" | "open" | "breakdown" | string;

export type MessengerMeta = Record<string, unknown>;

export type MessengerHandoffParams = {
  source: string; // widget/component source, e.g. 'risk-index', 'operations', 'disclosure'
  intent: MessengerIntent; // action intent, e.g. 'discuss', 'open', 'breakdown'
  faceId?: string; // optional active face identifier
  cardId?: string; // optional card/widget id
  title?: string; // chat window title
  primary?: string; // primary KPI/value string
  narrative?: string; // short narrative/context
  // Allow richer metric objects (additive-safe). Callers may pass label/value or domain metrics.
  metrics?: Array<Record<string, unknown>>;
  anchorEl?: Element | null; // optional anchor element to position near
  anchorRect?: { top: number; left: number; right: number; bottom: number; width: number; height: number } | null; // direct rect
  meta?: MessengerMeta; // normalized, structured metadata for telemetry
};

/**
 * Opens the in-app Messenger with a standardized event contract and telemetry.
 * - Emits sampled telemetry `progressive.open` with { source, faceId, intent, meta }
 * - Publishes `progressive.open` on the app bus with chat context consumed by ChatWindow
 */
export function messengerHandoff(params: MessengerHandoffParams) {
  const {
    source,
    intent,
    faceId,
    cardId,
    title,
    primary,
    narrative,
    metrics,
    anchorEl,
    anchorRect: rectIn,
    meta = {},
  } = params;

  // Telemetry: normalized contract
  try {
    emit("progressive.open", { source, faceId, intent, meta });
  } catch {}

  // Resolve anchor rectangle in viewport coordinates
  let rect = rectIn || null;
  try {
    if (!rect && anchorEl && typeof (anchorEl as HTMLElement).getBoundingClientRect === "function") {
      const r = (anchorEl as HTMLElement).getBoundingClientRect();
      rect = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    }
  } catch {}

  // Publish to in-app bus for ChatWindow consumption
  try {
    pub("progressive.open", {
      source,
      cardId,
      title,
      primary,
      metrics,
      narrative,
      anchorRect: rect || undefined,
    });
  } catch {}
}
