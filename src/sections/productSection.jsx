import React from "react";
import { productColumns, workflowSteps } from "../contents";

export default function ProductSection() {
  return (
    <section id="product" className="mx-auto w-full max-w-7xl px-4 pt-20 md:px-8">
      <div className="mt-16 border-t border-white/12 pt-[1.1rem]">
        <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#9ca3af]">Product</p>

        <h2 className="mt-[0.8rem] max-w-[50rem] font-['Sora'] text-[clamp(1.7rem,3.6vw,3.2rem)] leading-[1.2] text-[#e5e7eb]">
          A complete expense tracker workspace with a clean, simple flow.
        </h2>

        <div className="mt-8 grid gap-[1.2rem] min-[720px]:grid-cols-3 min-[720px]:gap-6">
          {productColumns.map((item) => (
            <article key={item.id} className="py-[0.4rem]">
              <h3 className="m-0 text-[1.4rem] tracking-[-0.02em] text-[#f3f4f6]">{item.title}</h3>
              <p className="mt-[0.5rem] text-[1rem] leading-[1.6] text-[#9ca3af]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-white/12 pt-[1.1rem]">
        <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#9ca3af]">How It Works</p>

        <div className="mt-[1.4rem] border-t border-white/12">
          {workflowSteps.map((step) => (
            <article
              key={step.id}
              className="grid grid-cols-[auto_1fr] items-start gap-4 border-b border-white/12 py-4"
            >
              <span className="text-[0.82rem] tracking-[0.14em] text-[#9ca3af]">{step.number}</span>
              <div>
                <h3 className="m-0 text-[1.2rem] text-[#f3f4f6]">{step.title}</h3>
                <p className="mt-[0.4rem] text-[0.98rem] text-[#9ca3af]">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
