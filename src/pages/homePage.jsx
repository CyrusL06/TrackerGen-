import React from "react";
import Header from "../components/header";
import TrustedSection from "../sections/trustedSection";
import ProductSection from "../sections/productSection";
import PricingSection from "../sections/pricingSection";
import FaqSection from "../sections/faqSection";
import Footer from "../components/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pb-8">
        <TrustedSection />
        <ProductSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
