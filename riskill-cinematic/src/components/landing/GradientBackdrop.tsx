import { BG_URL } from "../../theme/bg";

export default function GradientBackdrop(){
  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-onyx-vista">
      <img src={BG_URL} alt="" className="w-0 h-0 opacity-0" loading="eager" />
      <div
        className="absolute inset-0 mix-blend-screen pointer-events-none"
        style={{ background: "radial-gradient(700px 420px at 70% 20%, rgba(107,229,255,.08), transparent)" }}
      />
      <div
        className="absolute inset-0 mix-blend-screen pointer-events-none"
        style={{ background: "radial-gradient(600px 360px at 25% 65%, rgba(75,225,195,.08), transparent)" }}
      />
    </div>
  );
}
