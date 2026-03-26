import CtaSection from "@/components/ui2.0/HomePage/ctaSection";
import FeatureStrip from "@/components/ui2.0/HomePage/featureStrip";
import Hero from "@/components/ui2.0/HomePage/hero";
import HowItWorks from "@/components/ui2.0/HomePage/howItWorks";
import { FONTS, NOISE_BACKGROUND } from "@/components/ui2.0/brand";

export default function Home() {
  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-[color:var(--brand-bg)] text-[color:var(--brand-text)] ${FONTS.mono}`}
    >
      <div
        className="pointer-events-none fixed inset-0 z-[100] opacity-40"
        style={{ backgroundImage: NOISE_BACKGROUND }}
      />
      <div className="pointer-events-none absolute left-[-10rem] top-16 h-72 w-72 rounded-full bg-[color:var(--brand-accent)]/8 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-[28rem] h-80 w-80 rounded-full bg-[color:var(--brand-amber)]/8 blur-3xl" />

      <main className="relative z-10">
        <Hero className="flex justify-center w-full items-center" />
        <FeatureStrip />
        <HowItWorks />
        <CtaSection />
      </main>
    </div>
  );
}
