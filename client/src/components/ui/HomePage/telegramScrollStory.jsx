import {
  BatteryMedium,
  Check,
  ChevronLeft,
  Mic,
  MoreVertical,
  Paperclip,
  Send,
  Signal,
  Smile,
  Wifi,
} from "lucide-react";
import {
  LazyMotion,
  domAnimation,
  useMotionValueEvent,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import * as Motion from "motion/react-m";
import { useLayoutEffect, useRef, useState } from "react";
import { FONTS } from "../pudgy-brand";

const stages = [
  {
    title: "Send /add",
    text: "Start the guided entry flow instead of memorizing a transaction format.",
  },
  {
    title: "Choose Expense",
    text: "The bot presents fixed Income and Expense buttons, then remembers your selection.",
  },
  {
    title: "Send the details",
    text: "Enter the description, amount, and category exactly as prompted: coffee 6.50 food.",
  },
  {
    title: "Get confirmation and context",
    text: "TrackerGen saves the expense, confirms the normalized category, then sends your recent transaction totals.",
  },
];

function MessageTime({ children = "9:42 AM", outgoing = false }) {
  return (
    <div className={`mt-1 flex items-center justify-end gap-1 text-[0.65rem] ${outgoing ? "text-[#496452]" : "text-[#536873]"} ${FONTS.body}`}>
      <span>{children}</span>
      {outgoing ? <span className="font-bold text-[#147ead]">✓✓</span> : null}
    </div>
  );
}

function IncomingBubble({ children }) {
  return <div className="max-w-[94%] rounded-2xl rounded-bl-md bg-white px-3.5 py-3 text-[#17212b] shadow-sm">{children}</div>;
}

function OutgoingBubble({ children }) {
  return (
    <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-[#e7ffd9] px-3.5 py-2.5 text-[#17212b] shadow-sm">
      <p className={`text-body-sm leading-5 ${FONTS.body}`}>{children}</p>
      <MessageTime outgoing />
    </div>
  );
}

function MessageBeat({ at, children, progress, side = "left" }) {
  const reducedMotion = useReducedMotion();
  const revealStart = Math.max(0, at - 0.055);
  const opacity = useTransform(progress, [revealStart, at], [0, 1], { clamp: true });
  const reducedOpacity = useTransform(progress, (value) => value >= at ? 1 : 0);
  const y = useTransform(progress, [revealStart, at], [10, 0], { clamp: true });
  const scale = useTransform(progress, [revealStart, at], [0.96, 1], { clamp: true });

  return (
    <Motion.div
      style={{
        opacity: reducedMotion ? reducedOpacity : opacity,
        y: reducedMotion ? 0 : y,
        scale: reducedMotion ? 1 : scale,
        transformOrigin: side === "right" ? "bottom right" : "bottom left",
        willChange: reducedMotion ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </Motion.div>
  );
}

function ConversationTranscript({ progress }) {
  return (
    <div className="space-y-3 pb-5">
      <div className={`mx-auto w-fit rounded-full bg-[#526d7b] px-3 py-1 text-caption font-medium text-white shadow-sm ${FONTS.body}`}>Today</div>

      <MessageBeat at={0.03} progress={progress} side="right">
        <OutgoingBubble>/add</OutgoingBubble>
      </MessageBeat>

      <MessageBeat at={0.18} progress={progress}>
        <IncomingBubble>
          <p className={`text-body-sm leading-5 ${FONTS.body}`}>What are you looking to add?</p>
          <div className={`mt-2 grid grid-cols-2 overflow-hidden rounded-lg border border-[#b9d4e2] text-center text-body-sm font-semibold text-[#147ead] ${FONTS.body}`}>
            <span className="border-r border-[#b9d4e2] bg-[#f6fbfd] px-2 py-2">Income</span>
            <span className="bg-[#dff3fc] px-2 py-2 text-[#0d678f]">Expense</span>
          </div>
          <MessageTime />
        </IncomingBubble>
      </MessageBeat>

      <MessageBeat at={0.34} progress={progress}>
        <div className="space-y-3">
          <div className={`mx-auto w-fit rounded-full bg-[#526d7b] px-3 py-1 text-caption font-medium text-white shadow-sm ${FONTS.body}`}>Expense selected</div>
          <IncomingBubble>
            <p className={`text-body-sm leading-5 ${FONTS.body}`}>Send the details like this:<br /><strong>coffee 6.50 food</strong></p>
            <MessageTime />
          </IncomingBubble>
        </div>
      </MessageBeat>

      <MessageBeat at={0.55} progress={progress} side="right">
        <OutgoingBubble>coffee 6.50 food</OutgoingBubble>
      </MessageBeat>

      <MessageBeat at={0.72} progress={progress}>
        <IncomingBubble>
          <div className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#26845f] text-white">
              <Check aria-hidden="true" size={12} strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-body-sm font-semibold ${FONTS.body}`}>Saved to TrackerGen: coffee</p>
              <p className={`mt-1 text-body-sm leading-5 text-[#40515d] ${FONTS.body}`}>Expense: -$6.50<br />Category: Food &amp; Drink</p>
              <MessageTime>9:43 AM</MessageTime>
            </div>
          </div>
        </IncomingBubble>
      </MessageBeat>

      <MessageBeat at={0.88} progress={progress}>
        <IncomingBubble>
          <p className={`text-body-sm font-semibold ${FONTS.body}`}>Recent 5 transactions:</p>
          <p className={`mt-1 text-caption leading-5 text-[#40515d] ${FONTS.body}`}>
            1. coffee (Food &amp; Drink) -$6.50<br />Recent income: $926.00<br />Recent expenses: $184.00<br />Recent net: +$742.00
          </p>
          <MessageTime>9:43 AM</MessageTime>
        </IncomingBubble>
      </MessageBeat>
    </div>
  );
}

function PhoneMockup({ progress }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const maxTravel = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const y = useTransform(() => -progress.get() * maxTravel.get());

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;

    const measure = () => {
      maxTravel.set(Math.max(0, track.scrollHeight - viewport.clientHeight));
    };
    measure();

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(viewport);
    observer?.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [maxTravel]);

  return (
    <div className="telegram-phone-shell relative mx-auto w-[min(14.5rem,calc(100vw-2.5rem))] shrink-0 rounded-[3rem] border border-white/[0.16] bg-[#050a0f] p-[0.45rem] shadow-[0_32px_70px_rgba(0,0,0,0.48)] sm:w-[16rem] lg:w-[17rem]" role="group" aria-label="Telegram conversation demonstrating the TrackerGen add-expense workflow">
      <span aria-hidden="true" className="absolute -left-[0.22rem] top-28 h-12 w-[0.22rem] rounded-l bg-[#25323d]" />
      <span aria-hidden="true" className="absolute -left-[0.22rem] top-44 h-16 w-[0.22rem] rounded-l bg-[#25323d]" />
      <span aria-hidden="true" className="absolute -right-[0.22rem] top-36 h-20 w-[0.22rem] rounded-r bg-[#25323d]" />
      <div className="absolute left-1/2 top-3 z-20 h-[1.15rem] w-[4.75rem] -translate-x-1/2 rounded-full bg-[#050a0f]">
        <span className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#152b3d]" />
      </div>

      <div className="overflow-hidden rounded-[2.55rem] bg-[#dce8ee]">
        <div className={`flex h-8 items-center justify-between bg-[#147ead] px-4 pt-1 text-[0.65rem] font-semibold text-white sm:h-10 sm:px-5 sm:text-caption ${FONTS.body}`}>
          <span>9:42</span>
          <div className="flex items-center gap-1" aria-hidden="true"><Signal size={11} fill="currentColor" /><Wifi size={12} /><BatteryMedium size={14} /></div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#147ead] px-2.5 pb-2 text-white shadow-sm sm:gap-2 sm:px-3 sm:pb-3">
          <ChevronLeft aria-hidden="true" size={18} />
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#147ead] shadow-sm sm:h-10 sm:w-10"><Send aria-hidden="true" size={16} fill="currentColor" /></div>
          <div className="min-w-0 flex-1"><p className={`truncate text-caption font-semibold sm:text-body-sm ${FONTS.body}`}>TrackerGen</p><p className={`text-[0.65rem] sm:text-caption ${FONTS.body}`}>bot</p></div>
          <MoreVertical aria-hidden="true" size={18} />
        </div>

        <div ref={viewportRef} className="telegram-phone-screen h-[19rem] overflow-hidden px-3 py-4 sm:h-[22rem] lg:h-[24rem]" style={{ backgroundColor: "#dce8ee", backgroundImage: "radial-gradient(circle at 18px 18px, rgb(79 119 142 / 9%) 1.5px, transparent 1.5px), radial-gradient(circle at 42px 42px, rgb(79 119 142 / 7%) 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
          <Motion.div ref={trackRef} style={{ y: reducedMotion ? 0 : y, willChange: reducedMotion ? "auto" : "transform" }}>
            <ConversationTranscript progress={progress} />
          </Motion.div>
        </div>

        <div className="flex items-center gap-2 border-t border-[#c5d5dc] bg-[#f7fafb] px-3 py-2.5 text-[#526672]">
          <Paperclip aria-hidden="true" size={20} />
          <div className={`flex h-9 flex-1 items-center rounded-full bg-white px-3 text-body-sm text-[#526672] shadow-sm ${FONTS.body}`}><span>Message</span><Smile aria-hidden="true" size={18} className="ml-auto" /></div>
          <Mic aria-hidden="true" size={20} />
        </div>
      </div>
    </div>
  );
}

export default function TelegramScrollStory() {
  const storyRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  });
  const animationProgress = prefersReducedMotion ? scrollYProgress : springProgress;
  const progressWidth = useTransform(animationProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(animationProgress, "change", (value) => {
    const nextStage = Math.min(stages.length - 1, Math.max(0, Math.round(value * (stages.length - 1))));
    setActiveStage((currentStage) => currentStage === nextStage ? currentStage : nextStage);
  });

  return (
    <LazyMotion features={domAnimation} strict>
      <figure
        ref={storyRef}
        className="telegram-scroll-story cinematic-full-bleed relative border-y border-[var(--home-border)]"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(39,121,167,0.1), transparent 58%), var(--bg-page)" }}
      >
      <div className="telegram-mobile-scene sticky top-0 flex h-svh items-center overflow-hidden px-5 pb-1 pt-16 sm:pb-3 sm:pt-20 md:px-10 md:pb-6 md:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[4rem] border-[#2779a7]/[0.05]" />
        <div className="pointer-events-none absolute inset-x-[-15%] top-[38%] h-[38%] -rotate-3 bg-[#2779a7]/[0.07] lg:hidden" />
        <span key={`mobile-number-${activeStage}`} className={`story-copy-enter pointer-events-none absolute left-3 top-[42%] text-[5.5rem] font-bold leading-none tracking-[-0.06em] text-[var(--home-accent)] opacity-10 lg:hidden ${FONTS.display}`}>
          0{activeStage + 1}
        </span>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-3 sm:gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <div key={`copy-${activeStage}`} className="story-copy-enter hidden max-w-sm justify-self-end lg:block">
             <span className={`text-body-sm font-semibold text-[var(--home-accent)] ${FONTS.body}`}>Step {activeStage + 1} of {stages.length}</span>
             <h3 className={`mt-3 text-balance text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.04] tracking-[-0.035em] text-[var(--home-text)] ${FONTS.display}`}>{stages[activeStage].title}</h3>
             <p className={`mt-5 text-pretty text-body leading-7 text-[var(--home-muted)] ${FONTS.body}`}>{stages[activeStage].text}</p>
          </div>

          <div key={`mobile-copy-${activeStage}`} className="story-copy-enter mx-auto w-full max-w-[21rem] text-center lg:hidden">
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className={`text-caption font-semibold text-[var(--home-accent)] ${FONTS.body}`}>Telegram workflow</p>
              <p className={`text-caption font-semibold tabular-nums text-[var(--home-dim)] ${FONTS.body}`}>{activeStage + 1} / {stages.length}</p>
            </div>
            <div className="mb-3 h-1 overflow-hidden rounded-full bg-[var(--home-surface-subtle)]">
              <Motion.div className="h-full rounded-full bg-[var(--home-accent)]" style={{ width: progressWidth }} />
            </div>
            <h3 className={`text-balance text-[clamp(1.55rem,7vw,2rem)] font-bold leading-[1.05] tracking-[-0.035em] text-[var(--home-text)] ${FONTS.display}`}>{stages[activeStage].title}</h3>
            <p className={`telegram-mobile-description mx-auto mt-2 max-w-[32ch] text-body-sm leading-5 text-[var(--home-muted)] ${FONTS.body}`}>{stages[activeStage].text}</p>
          </div>

          <div className="relative z-10 justify-self-center">
            <PhoneMockup progress={animationProgress} />
          </div>

          <ol className="hidden w-full max-w-[13rem] space-y-4 justify-self-start lg:block" aria-label="Telegram workflow progress">
            {stages.map((stage, index) => (
              <li key={stage.title} className={`flex items-center gap-3 transition-opacity duration-300 ${index === activeStage ? "opacity-100" : "opacity-30"}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${index === activeStage ? "bg-[var(--home-accent)] shadow-[0_0_18px_var(--home-accent-soft)]" : "bg-[var(--home-surface-subtle)]"}`} />
                 <span className={`text-body-sm ${index === activeStage ? "font-semibold text-[var(--home-text)]" : "text-[var(--home-muted)]"} ${FONTS.body}`}>{stage.title}</span>
              </li>
            ))}
          </ol>

        </div>
      </div>

      <ol className="sr-only">
        {stages.map((stage) => <li key={stage.title}><strong>{stage.title}</strong>: {stage.text}</li>)}
      </ol>
      <figcaption className="sr-only">A fixed-size phone scrolls naturally through the documented TrackerGen Telegram conversation.</figcaption>
      </figure>
    </LazyMotion>
  );
}
