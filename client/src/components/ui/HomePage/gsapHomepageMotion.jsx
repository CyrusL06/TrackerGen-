import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GsapHomepageMotion() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-gsap-section]").forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 42, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-gsap-card]").forEach((card, index) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 28, rotate: index % 2 === 0 ? -1.5 : 1.5 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "back.out(1.15)",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-gsap-drift]").forEach((item) => {
        gsap.to(item, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
