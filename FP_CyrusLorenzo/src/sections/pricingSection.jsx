import React from "react";
import { pricingPlans } from "../contents";
import Button from "./buttons";

export default function PricingSection() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-4 pt-20 md:px-8">
      <div className="section-block">
        <p className="section-kicker">Pricing</p>
        <h2 className="section-title">Straightforward plans for every stage of your crypto journey.</h2>

        <div className="pricing-table-wrap mt-10">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Team</th>
                <th>Support</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {pricingPlans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.name}</td>
                  <td>{plan.price}</td>
                  <td>{plan.users}</td>
                  <td>{plan.support}</td>
                  <td>
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
