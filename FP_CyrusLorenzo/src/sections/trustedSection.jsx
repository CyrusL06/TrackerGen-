import React from "react";
import { trustedLogos } from "../contents";

const iconClassMap = {
  aceternity: "trusted-icon trusted-icon-aceternity",
  gamity: "trusted-icon trusted-icon-gamity",
  host: "trusted-icon trusted-icon-host",
  asteroid: "trusted-icon trusted-icon-asteroid",
};

export default function TrustedSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-14 md:px-8 md:pt-20">
      <div className="text-center">
        <h2 className="trusted-title">Trusted by Industry Leaders</h2>
        <p className="trusted-subtitle">
          Join the ranks of forward-thinking companies already leveraging our AI technology
        </p>
      </div>

      <div className="trusted-logo-row">
        {trustedLogos.map((logo) => (
          <article key={logo.id} className="trusted-logo-item">
            <span className={iconClassMap[logo.kind]} aria-hidden="true" />
            <p>{logo.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
