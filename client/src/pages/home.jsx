import MarqueeStrip from "@/components/ui/HomePage/marqueeStrip";
import CtaSection from "@/components/ui/HomePage/ctaSection";
import FeatureStrip from "@/components/ui/HomePage/featureStrip";
import Hero from "@/components/ui/HomePage/hero";
import HowItWorks from "@/components/ui/HomePage/howItWorks";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white" style={{ background: "#000" }}>
      <MarqueeStrip />
      <main className="relative z-10">
        <Hero />
        <FeatureStrip />
        <HowItWorks />
        <CtaSection />
      </main>
    </div>
  );
}
