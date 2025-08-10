import CardWidget from "./CardWidget";

export default function NavigationCard() {
  return (
    <CardWidget title="Navigation">
      <nav className="text-sm">
        <ul className="space-y-2">
          {[
            "Overview",
            "Data Sources",
            "Agents",
            "Insights",
          ].map((t) => (
            <li key={t}>
              <a className="block px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition" href="#">{t}</a>
            </li>
          ))}
        </ul>
      </nav>
    </CardWidget>
  );
}
