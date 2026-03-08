import React from "react";
import Header from "../components/header";
import TrustedSection from "../sections/trustedSection";
import ProductSection from "../sections/productSection";
import Footer from "../components/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pb-8">
        <TrustedSection />
        <ProductSection />
      </main>
      <Footer />
    </>
  );
}
