import React from "react";
import { faqs } from "../contents";

export default function FaqSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-20 md:px-8">
      <div className="border-t border-white/12 pt-[1.1rem]">
        <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#9ca3af]">FAQ</p>

        <h2 className="mt-[0.8rem] max-w-[50rem] font-['Sora'] text-[clamp(1.7rem,3.6vw,3.2rem)] leading-[1.2] text-[#e5e7eb]">
          Answers to common questions before you get started.
        </h2>

        <div className="mt-10 border-t border-white/12">
          {faqs.map((item) => (
            <details key={item.id} className="border-b border-white/12 py-[0.9rem]">
              <summary className="cursor-pointer list-none text-[1.05rem] text-[#f3f4f6] [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-[0.6rem] text-[0.95rem] leading-[1.6] text-[#9ca3af]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
