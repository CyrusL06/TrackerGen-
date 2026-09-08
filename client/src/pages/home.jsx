import CtaSection from "@/components/ui/HomePage/ctaSection";
import BenefitsSection from "@/components/ui/HomePage/benefitsSection";
import FaqSection from "@/components/ui/HomePage/faqSection";
import Hero from "@/components/ui/HomePage/hero";
import HowItWorks from "@/components/ui/HomePage/howItWorks";
import PrivacySection from "@/components/ui/HomePage/privacySection";
import ProductStory from "@/components/ui/HomePage/productStory";
import GsapHomepageMotion from "@/components/ui/HomePage/gsapHomepageMotion";

export default function Home() {
  return (
    <div className="relative min-h-screen text-[var(--home-text)]" style={{ background: "var(--bg-page)" }}>
      <GsapHomepageMotion />
      <main className="relative z-10">
        <Hero />
        <ProductStory />
        <BenefitsSection />
        <HowItWorks />
        <PrivacySection />
        <FaqSection />
        <CtaSection />
      </main>
    </div>
  );
}
