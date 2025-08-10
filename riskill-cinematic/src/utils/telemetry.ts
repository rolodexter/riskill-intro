type Payload = Record<string, unknown>;

function sample(p: number) {
  return Math.random() < p;
}

export function emit(event: string, payload: Payload = {}, { sampleRate = 0.2 } = {}) {
  if (!sample(sampleRate)) return;
  // Minimal stub: console logging only (no PII)
  console.info(`[telemetry] ${event}` , payload);
}
