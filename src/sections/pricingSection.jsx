import React from "react";
import { pricingPlans } from "../assets/contents";
import Button from "./buttons";

export default function PricingSection() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-4 pt-20 md:px-8">
      <div className="border-t border-white/12 pt-[1.1rem]">
        <p className="text-[0.72rem] uppercase tracking-[0.12em] text-[#9ca3af]">Pricing</p>
        <h2 className="mt-[0.8rem] max-w-[50rem] font-['Sora'] text-[clamp(1.7rem,3.6vw,3.2rem)] leading-[1.2] text-[#e5e7eb]">
          Straightforward plans for every stage of your crypto journey.
        </h2>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-white/12 px-[0.45rem] py-[0.9rem] text-left text-[0.8rem] font-medium uppercase tracking-[0.1em] text-[#9ca3af]">
                  Plan
                </th>
                <th className="border-b border-white/12 px-[0.45rem] py-[0.9rem] text-left text-[0.8rem] font-medium uppercase tracking-[0.1em] text-[#9ca3af]">
                  Price
                </th>
                <th className="border-b border-white/12 px-[0.45rem] py-[0.9rem] text-left text-[0.8rem] font-medium uppercase tracking-[0.1em] text-[#9ca3af]">
                  Team
                </th>
                <th className="border-b border-white/12 px-[0.45rem] py-[0.9rem] text-left text-[0.8rem] font-medium uppercase tracking-[0.1em] text-[#9ca3af]">
                  Support
                </th>
                <th
                  className="border-b border-white/12 px-[0.45rem] py-[0.9rem] text-left text-[0.8rem] font-medium uppercase tracking-[0.1em] text-[#9ca3af]"
                  aria-label="Action"
                />
              </tr>
            </thead>
            <tbody>
              {pricingPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="whitespace-nowrap border-b border-white/12 px-[0.45rem] py-[0.9rem] text-[1rem] text-[#e5e7eb]">
                    {plan.name}
                  </td>
                  <td className="whitespace-nowrap border-b border-white/12 px-[0.45rem] py-[0.9rem] text-[1rem] text-[#e5e7eb]">
                    {plan.price}
                  </td>
                  <td className="whitespace-nowrap border-b border-white/12 px-[0.45rem] py-[0.9rem] text-[1rem] text-[#e5e7eb]">
                    {plan.users}
                  </td>
                  <td className="whitespace-nowrap border-b border-white/12 px-[0.45rem] py-[0.9rem] text-[1rem] text-[#e5e7eb]">
                    {plan.support}
                  </td>
                  <td className="whitespace-nowrap border-b border-white/12 px-[0.45rem] py-[0.9rem]">
                    <Button href="#hero" size="sm">
                      Choose
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
