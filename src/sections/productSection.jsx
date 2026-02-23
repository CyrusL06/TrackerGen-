import React from "react";
import { productColumns, workflowSteps } from "../contents";

export default function ProductSection() {
  return (
    <section id="product" className="mx-auto w-full max-w-7xl px-4 pt-20 md:px-8">
      <div className="section-block mt-16">
        <p className="section-kicker">Product</p>
        <h2 className="section-title">A complete crypto workspace with a clean, simple flow.</h2>
        <div className="feature-columns">
          {productColumns.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="section-block mt-16">
        <p className="section-kicker">How It Works</p>
        <div className="workflow-list">
          {workflowSteps.map((step) => (
            <article key={step.id}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
