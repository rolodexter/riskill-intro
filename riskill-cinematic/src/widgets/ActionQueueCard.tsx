import CardWidget from "./CardWidget";
import { useEffect, useState } from "react";
import { sub } from "./bus";

type Item = { id: string; type: string; ts: number };

export default function ActionQueueCard() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() =>
    sub("action.queue.push", (payload: unknown) => {
      if (
        payload &&
        typeof payload === "object" &&
        "id" in payload &&
        "type" in payload &&
        "ts" in payload
      ) {
        const it = payload as Item;
        setItems((p) => [it, ...p]);
      }
    }),
  []);

  return (
    <CardWidget title="Action Queue" subtitle="Triggered by widgets">
      <ul className="space-y-2 text-sm">
        {items.length === 0 && <li className="text-textSec">No actions yet.</li>}
        {items.map((i) => (
          <li key={i.id} className="flex justify-between">
            <span>{i.type}</span>
            <span className="text-textSec">{new Date(i.ts).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </CardWidget>
  );
}
