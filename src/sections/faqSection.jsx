import React from "react";
import { faqs } from "../contents";

export default function FaqSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-20 md:px-8">
      <div className="section-block">
        <p className="section-kicker">FAQ</p>
        <h2 className="section-title">Answers to common questions before you get started.</h2>

        <div className="faq-list mt-10">
          {faqs.map((item) => (
            <details key={item.id}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
