export default function Header(){
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xs bg-black/30 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-semibold tracking-tight">Riskill</div>
        <nav className="hidden md:flex gap-6 text-sm text-textSec">
          <a href="#solution" className="hover:text-textPri">Solution</a>
          <a href="#vision" className="hover:text-textPri">Vision</a>
          <a href="#demo" className="hover:text-textPri">Demo</a>
        </nav>
        <a href="#cta" className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15">Request Access</a>
      </div>
    </header>
  );
}
