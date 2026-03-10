import React from "react";
import Button from "./buttons";
import { Safari } from "../components/ui/safari"

const riseInClass ="opacity-0 translate-y-[18px] [animation:rise-in_0.82s_cubic-bezier(0.22,1,0.36,1)_forwards] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";
// const safariRise = " ";


export default function CardHero() {
  return (
    <section id="hero" className="mx-auto w-full max-w-7xl px-4 pb-10 pt-24 md:px-8 md:pb-14 md:pt-26">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className={`m-0 bg-[linear-gradient(180deg,#f3f4f6_0%,#9ca3af_100%)] bg-clip-text font-['Sora'] 
                      lg:text-6xl text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-transparent ${riseInClass} 
                      `}
          style={{ animationDelay: "0.14s" }}
        >
          Your All-in-One
          <br />
          Saving Companion
        </h1>

        <p
          className={`mx-auto mt-[1.3rem] max-w-[36rem] lg:text-lg text-sm leading-[1.52] text-[#6b7280] ${riseInClass}`}
          style={{ animationDelay: "0.22s" }}
        >
          Simplify expense and portfolio management with cutting-edge tools designed for everyone from
          beginners to pros.
        </p>

        <div className={`mt-6 ${riseInClass}`} style={{ animationDelay: "0.3s" }}>
          <Button to="/login">Get Started</Button>
        </div>

          <div className={`w-full mt-20 ${riseInClass}`}>
            <Safari url="https://trackergen.com" imageSrc="/assets/blockchainopt.png"/>
         </div>


      </div>

     
    </section>
  );
}
