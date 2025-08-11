import "./index.css";
import GradientBackdrop from "./components/landing/GradientBackdrop";
import TopWidgets from "./components/landing/TopWidgets";
import LeftZone from "./components/landing/LeftZone";
import MiddleCanvas from "./components/landing/MiddleCanvas";
import RightZone from "./components/landing/RightZone";
import Footer from "./components/landing/Footer";
import ChatWindow from "./components/chat/ChatWindow";
import { useFeatureFlag } from "./hooks/useFeatureFlag";

export default function App(){
  const revx = useFeatureFlag("revx");
  return (
    <div className="relative isolate min-h-dvh text-textPri">
      <GradientBackdrop />
      <TopWidgets />
      <main className="relative mx-auto max-w-[1280px] w-full px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 py-6">
          {/* Left 25% */}
          <aside className="md:col-span-1 order-3 md:order-1"><LeftZone /></aside>
          {/* Middle 50% */}
          <section className="md:col-span-2 order-2"><MiddleCanvas /></section>
          {/* Right 25% */}
          <aside className="md:col-span-1 order-4 md:order-3"><RightZone /></aside>
        </div>
        {/* Grid overlay root for floating widgets (chat, etc.). Pointer-events off by default. */}
        <div id="dashboard-overlay" className="pointer-events-none absolute inset-0 z-[90]" />
      </main>
      <Footer />
      {revx && <ChatWindow />}
    </div>
  );
}
