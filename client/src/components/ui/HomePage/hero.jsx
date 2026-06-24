import { FONTS, COLORS, LAYOUT } from "../pudgy-brand";

function PenguinBack() {
  const sz = { width: "clamp(100px, 16vw, 180px)" };
  return (
    <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: -1 }}>
      <svg viewBox="0 0 1024 1024" fill="none" className="h-auto drop-shadow-xl overflow-visible" style={sz}>
        <defs>
          <linearGradient id="nb" x1="240" y1="140" x2="820" y2="880" gradientUnits="userSpaceOnUse">
            <stop stopColor="#102956"/><stop offset="1" stopColor="#06152F"/>
          </linearGradient>
          <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1A3769"/><stop offset="1" stopColor="#091A37"/>
          </linearGradient>
          <linearGradient id="sg" x1="320" y1="520" x2="760" y2="760" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3D97FF"/><stop offset="1" stopColor="#1268D1"/>
          </linearGradient>
          <linearGradient id="bg" x1="450" y1="425" x2="585" y2="475" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBF33"/><stop offset="1" stopColor="#FF9B16"/>
          </linearGradient>
          <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFC233"/><stop offset="1" stopColor="#FF940D"/>
          </linearGradient>
        </defs>

        {/* Wind gusts */}
        <g className="animate-wind" style={{ transformOrigin: "450px 80px" }}>
          <path d="M 50 100 C 180 30, 260 140, 400 70 C 500 25, 600 100, 750 50" stroke="#6CB5FF" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 20 140 C 160 50, 250 160, 400 100 C 520 55, 620 130, 780 70" stroke="#6CB5FF" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 80 60 C 200 10, 300 80, 450 35 C 550 5, 650 60, 800 25" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5"/>
          <path d="M 130 170 C 250 110, 330 190, 480 130 C 570 95, 660 160, 800 110" stroke="#6CB5FF" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3"/>
          <circle cx="380" cy="40" r="6" fill="#FFFFFF" opacity="0.5"/>
          <circle cx="520" cy="25" r="4" fill="#6CB5FF" opacity="0.4"/>
          <circle cx="280" cy="130" r="5" fill="#FFFFFF" opacity="0.3"/>
          <circle cx="620" cy="60" r="6" fill="#6CB5FF" opacity="0.35"/>
          <circle cx="180" cy="80" r="3" fill="#FFFFFF" opacity="0.25"/>
          <circle cx="700" cy="40" r="4" fill="#FFFFFF" opacity="0.3"/>
        </g>

        <g className="animate-bob" style={{ transformOrigin: "512px 700px" }}>
          <g className="animate-dangle" style={{ transformOrigin: "410px 850px", animationDuration: "0.9s", animationDelay: "0s" }}>
            <path d="M364 850 C386 829 419 820 453 825 C473 828 494 837 509 850 C495 869 465 882 424 884 C388 886 355 876 342 860 C346 856 355 853 364 850Z" fill="#FFD700" stroke="#B8860B" strokeWidth="10" strokeLinejoin="round"/>
            <path d="M393 859 C417 847 441 844 468 848" stroke="#DAA520" strokeWidth="8" strokeLinecap="round" opacity="0.75"/>
          </g>
          <g className="animate-dangle" style={{ transformOrigin: "614px 850px", animationDuration: "0.9s", animationDelay: "-0.45s" }}>
            <path d="M660 850 C638 829 605 820 571 825 C551 828 530 837 515 850 C529 869 559 882 600 884 C636 886 669 876 682 860 C678 856 669 853 660 850Z" fill="#FFD700" stroke="#B8860B" strokeWidth="10" strokeLinejoin="round"/>
            <path d="M631 859 C607 847 583 844 556 848" stroke="#DAA520" strokeWidth="8" strokeLinecap="round" opacity="0.75"/>
          </g>
          <path d="M512 118 C451 118 395 136 345 172 C281 218 240 292 240 380 L240 713 C240 785 292 849 364 880 C409 899 457 910 512 910 C567 910 615 899 660 880 C732 849 784 785 784 713 L784 380 C784 292 743 218 679 172 C629 136 573 118 512 118Z" fill="url(#nb)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
            <g className="animate-peek" style={{ transformOrigin: "502px 157px" }}>
              <path d="M485 144 C492 112 509 90 531 73 C548 60 565 52 584 49 C572 67 564 86 563 110 C584 89 612 81 648 82 C636 95 621 110 599 122 C573 136 545 146 520 157Z" fill="url(#nb)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
            </g>
            <path d="M264 578 C217 557 176 584 168 629 C158 683 186 742 242 766 C261 774 281 777 301 775 C286 719 280 651 264 578Z" fill="url(#wg)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
            <path d="M760 578 C807 557 848 584 856 629 C866 683 838 742 782 766 C763 774 743 777 723 775 C738 719 744 651 760 578Z" fill="url(#wg)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
            <path d="M360 278 C402 228 451 202 512 202 C573 202 622 228 664 278 C694 314 708 360 705 417 C693 414 683 413 672 413 C646 413 622 423 603 443 C580 467 548 479 512 479 C476 479 444 467 421 443 C402 423 378 413 352 413 C341 413 331 414 319 417 C316 360 330 314 360 278Z" fill="#D4DCE8" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
            <path d="M369 469 C411 435 459 420 512 420 C565 420 613 435 655 469 C682 491 696 536 696 609 L696 838 C650 870 590 892 512 892 C434 892 374 870 328 838 L328 609 C328 536 342 491 369 469Z" fill="#B8C6D8" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
            <ellipse cx="343" cy="444" rx="40" ry="22" fill="#F6C7BF" opacity="0.9"/>
            <ellipse cx="681" cy="444" rx="40" ry="22" fill="#F6C7BF" opacity="0.9"/>
            <g className="animate-blink" style={{ transformOrigin: "400px 360px" }}>
              <ellipse cx="400" cy="360" rx="50" ry="67" fill="#07152E"/>
              <ellipse cx="414" cy="375" rx="23" ry="33" fill="#183C74"/>
              <circle cx="372" cy="334" r="20" fill="#FFFFFF"/>
              <circle cx="444" cy="349" r="11" fill="#FFFFFF"/>
              <circle cx="445" cy="401" r="12" fill="#FFFFFF" opacity="0.95"/>
            </g>
            <g className="animate-blink" style={{ transformOrigin: "620px 360px" }}>
              <ellipse cx="620" cy="360" rx="50" ry="67" fill="#07152E"/>
              <ellipse cx="634" cy="375" rx="23" ry="33" fill="#183C74"/>
              <circle cx="592" cy="334" r="20" fill="#FFFFFF"/>
              <circle cx="664" cy="349" r="11" fill="#FFFFFF"/>
              <circle cx="665" cy="401" r="12" fill="#FFFFFF" opacity="0.95"/>
            </g>
            <path d="M321 287 C343 267 373 262 403 275" stroke="#041127" strokeWidth="12" strokeLinecap="round"/>
            <path d="M703 287 C681 267 651 262 621 275" stroke="#041127" strokeWidth="12" strokeLinecap="round"/>
            <path d="M430 414 C453 386 479 375 512 375 C545 375 571 386 594 414 C571 443 545 457 512 457 C479 457 453 443 430 414Z" fill="url(#bg)" stroke="#041127" strokeWidth="14" strokeLinejoin="round"/>
            <path d="M459 445 C477 468 492 477 512 477 C532 477 547 468 565 445" fill="#0C1022" stroke="#041127" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M484 470 C495 459 505 455 512 455 C519 455 529 459 540 470 C529 480 520 485 512 485 C504 485 495 480 484 470Z" fill="#F07A57"/>
            <path d="M295 505 C344 483 414 471 512 471 C610 471 680 483 729 505 C715 543 694 569 662 583 C617 565 566 557 512 557 C458 557 407 565 362 583 C330 569 309 543 295 505Z" fill="url(#sg)" stroke="#0B3E87" strokeWidth="16" strokeLinejoin="round"/>
            <path d="M332 518 C392 494 453 489 520 492" stroke="#6CB5FF" strokeWidth="10" strokeLinecap="round" opacity="0.55"/>
            <path d="M552 515 C583 504 616 507 639 522 C656 533 664 551 664 581 L664 748 C664 772 650 790 627 800 C607 809 582 812 559 804 C536 796 522 779 522 756 L522 577 C522 547 532 526 552 515Z" fill="url(#sg)" stroke="#0B3E87" strokeWidth="16" strokeLinejoin="round"/>
            <path d="M541 545 C562 534 585 529 618 533" stroke="#6CB5FF" strokeWidth="10" strokeLinecap="round" opacity="0.5"/>
            <path d="M586 658 C598 634 628 624 650 635 C670 645 678 668 668 686 C654 713 628 730 599 750 C570 729 544 712 530 686 C520 668 528 645 548 635 C570 624 600 634 612 658 C607 663 592 663 586 658Z" fill="#FFFFFF"/>
          </g>
      </svg>
    </div>
  );
}

function PenguinFront() {
  const sz = { width: "clamp(100px, 16vw, 180px)" };
  return (
    <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1 }}>
      <svg viewBox="0 0 1024 1024" fill="none" className="h-auto overflow-visible" style={sz}>
        <defs>
          <linearGradient id="wg2" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1A3769"/><stop offset="1" stopColor="#091A37"/>
          </linearGradient>
        </defs>
        <g className="animate-wave" style={{ transformOrigin: "310px 520px" }}>
          <path d="M320 519 C298 535 286 562 286 600 C286 649 309 695 350 719 C383 737 420 730 432 695 C440 671 436 643 424 611 C410 572 388 544 360 522 C348 513 333 511 320 519Z" fill="url(#wg2)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
        </g>
        <path d="M704 519 C726 535 738 562 738 600 C738 649 715 695 674 719 C641 737 604 730 592 695 C584 671 588 643 600 611 C614 572 636 544 664 522 C676 513 691 511 704 519Z" fill="url(#wg2)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="w-full max-w-4xl rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4 shadow-2xl backdrop-blur-sm md:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#EF476F]" />
          <div className="h-3 w-3 rounded-full bg-[#FFD166]" />
          <div className="h-3 w-3 rounded-full bg-[#10B981]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 rounded bg-[rgba(255,255,255,0.06)]" />
          <div className="h-5 w-5 rounded bg-[rgba(255,255,255,0.06)]" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[66, 42, 28, 18].map((pct, i) => (
          <div key={i} className="rounded-lg border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] p-3">
            <div className="mb-1 h-2 w-12 rounded bg-[rgba(255,255,255,0.06)]" />
            <div className="mb-2 h-5 w-16 rounded bg-[rgba(255,255,255,0.04)]" />
            <div className="flex items-end gap-1">
              <div
                className="w-2 rounded-t"
                style={{ height: `${pct}px`, background: i === 0 ? "#2779a7" : "#2779a740" }}
              />
              <div
                className="w-2 rounded-t"
                style={{ height: `${pct * 0.7}px`, background: i === 0 ? "#2779a7" : "#2779a740" }}
              />
              <div
                className="w-2 rounded-t"
                style={{ height: `${pct * 0.4}px`, background: i === 0 ? "#2779a7" : "#2779a740" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] p-3">
          <div className="mb-1 h-2 w-16 rounded bg-[rgba(255,255,255,0.06)]" />
          <div className="flex items-baseline gap-1">
            <div className="h-5 w-20 rounded bg-[rgba(255,255,255,0.04)]" />
            <div className="h-3 w-10 rounded bg-[rgba(16,185,129,0.2)]" />
          </div>
        </div>
        <div className="rounded-lg border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] p-3">
          <div className="mb-1 h-2 w-16 rounded bg-[rgba(255,255,255,0.06)]" />
          <div className="flex items-baseline gap-1">
            <div className="h-5 w-16 rounded bg-[rgba(255,255,255,0.04)]" />
            <div className="h-3 w-8 rounded bg-[rgba(239,71,111,0.2)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20 pb-20 text-center md:pb-24"
      style={{ background: "var(--bg-page)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2779a7]/6 via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[-20%] h-[600px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse,#2779a7/5_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 md:px-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(39,121,167,0.2)] bg-[rgba(39,121,167,0.06)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2779a7] animate-pulse" />
          <span className={`text-caption font-medium uppercase tracking-[0.12em] text-[#2779a7] ${FONTS.mono}`}>
            Early Access
          </span>
        </div>

        <h1 className={`mb-4 text-[clamp(3.5rem,10vw,6rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white ${FONTS.hero}`}>
          <span className="relative inline-block">
            <PenguinBack />
            <span style={{ position: "relative", zIndex: 0, textShadow: "0 0 30px rgba(0,0,0,0.95), 0 6px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.9)" }}>Track</span>
            <PenguinFront />
          </span>{" "}
          your finances
          <br />
          <span className="text-[#2779a7]">from Telegram.</span>
        </h1>

        <p className={`mx-auto mb-10 max-w-lg text-body leading-relaxed text-[oklch(0.52_0.025_260)] md:text-lead ${FONTS.body}`}>
          Add income and expenses via text message. See your monthly snapshot in one place. No bank connections required.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2779a7] px-8 py-3.5 text-body font-medium text-white no-underline transition-all duration-200 hover:bg-[#1d5f83] hover:-translate-y-0.5"
          >
            Open Preview
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.15)] px-8 py-3.5 text-body font-medium text-[oklch(0.65_0.025_260)] no-underline transition-all duration-200 hover:border-[rgba(255,255,255,0.3)] hover:text-white"
          >
            See how it works
          </a>
        </div>

        <div className="mt-16 w-full">
          <DashboardPreview />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
          {[
            { label: "Manual entry", detail: "Income & expenses" },
            { label: "Monthly review", detail: "Cash flow snapshot" },
            { label: "Telegram native", detail: "Text-based logging" },
          ].map(({ label, detail }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2779a7]/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2779a7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-left">
                <div className={`text-body-sm font-medium text-white ${FONTS.body}`}>{label}</div>
                <div className={`text-caption text-[oklch(0.52_0.025_260)] ${FONTS.body}`}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
