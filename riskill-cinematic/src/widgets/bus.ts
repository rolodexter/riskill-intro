type Fn = (p: unknown) => void;
const map = new Map<string, Set<Fn>>();

export function pub(topic: string, payload: unknown) {
  if (!map.has(topic)) return;
  for (const fn of map.get(topic)!) fn(payload);
}

export function sub(topic: string, fn: Fn) {
  if (!map.has(topic)) map.set(topic, new Set());
  map.get(topic)!.add(fn);
  return () => { map.get(topic)!.delete(fn); };
}
