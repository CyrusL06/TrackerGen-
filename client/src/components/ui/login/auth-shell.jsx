import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { COLORS, FONTS } from "@/components/ui/pudgy-brand";

const pageVars = {
  "--auth-bg": COLORS.bg,
  "--auth-border": COLORS.border,
  "--auth-border-strong": "rgba(255,255,255,0.12)",
  "--auth-text": COLORS.text,
  "--auth-muted": COLORS.dim,
  "--auth-accent": COLORS.blue,
};

function PenguinBack() {
  const sz = { width: "clamp(90px, 12vw, 130px)" };
  return (
    <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: -1 }}>
      <svg viewBox="0 0 1024 1024" fill="none" className="h-auto drop-shadow-xl" style={sz} aria-hidden="true">
        <defs>
          <linearGradient id="pnb" x1="240" y1="140" x2="820" y2="880" gradientUnits="userSpaceOnUse">
            <stop stopColor="#102956"/><stop offset="1" stopColor="#06152F"/>
          </linearGradient>
          <linearGradient id="pwg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1A3769"/><stop offset="1" stopColor="#091A37"/>
          </linearGradient>
          <linearGradient id="psg" x1="320" y1="520" x2="760" y2="760" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3D97FF"/><stop offset="1" stopColor="#1268D1"/>
          </linearGradient>
          <linearGradient id="pbg" x1="450" y1="425" x2="585" y2="475" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBF33"/><stop offset="1" stopColor="#FF9B16"/>
          </linearGradient>
          <linearGradient id="pfg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFC233"/><stop offset="1" stopColor="#FF940D"/>
          </linearGradient>
          <filter id="psh" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.25"/>
          </filter>
        </defs>
        <g filter="url(#psh)" className="animate-bob" style={{ transformOrigin: "512px 700px", animationDuration: "2s" }}>
          <g className="animate-dangle" style={{ transformOrigin: "410px 850px", animationDuration: "1.4s" }}>
            <path d="M364 850 C386 829 419 820 453 825 C473 828 494 837 509 850 C495 869 465 882 424 884 C388 886 355 876 342 860 C346 856 355 853 364 850Z" fill="url(#pfg)" stroke="#A45300" strokeWidth="10" strokeLinejoin="round"/>
            <path d="M393 859 C417 847 441 844 468 848" stroke="#E5891A" strokeWidth="8" strokeLinecap="round" opacity="0.75"/>
          </g>
          <g className="animate-dangle" style={{ transformOrigin: "614px 850px", animationDuration: "1.6s", animationDelay: "-0.3s" }}>
            <path d="M660 850 C638 829 605 820 571 825 C551 828 530 837 515 850 C529 869 559 882 600 884 C636 886 669 876 682 860 C678 856 669 853 660 850Z" fill="url(#pfg)" stroke="#A45300" strokeWidth="10" strokeLinejoin="round"/>
            <path d="M631 859 C607 847 583 844 556 848" stroke="#E5891A" strokeWidth="8" strokeLinecap="round" opacity="0.75"/>
          </g>
          <path d="M512 118 C451 118 395 136 345 172 C281 218 240 292 240 380 L240 713 C240 785 292 849 364 880 C409 899 457 910 512 910 C567 910 615 899 660 880 C732 849 784 785 784 713 L784 380 C784 292 743 218 679 172 C629 136 573 118 512 118Z" fill="url(#pnb)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
          <path d="M485 144 C492 112 509 90 531 73 C548 60 565 52 584 49 C572 67 564 86 563 110 C584 89 612 81 648 82 C636 95 621 110 599 122 C573 136 545 146 520 157Z" fill="url(#pnb)" stroke="#041127" strokeWidth="16" strokeLinejoin="round" className="animate-peek" style={{ transformOrigin: "502px 157px" }}/>
          <path d="M264 578 C217 557 176 584 168 629 C158 683 186 742 242 766 C261 774 281 777 301 775 C286 719 280 651 264 578Z" fill="url(#pwg)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
          <path d="M760 578 C807 557 848 584 856 629 C866 683 838 742 782 766 C763 774 743 777 723 775 C738 719 744 651 760 578Z" fill="url(#pwg)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
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
          <path d="M430 414 C453 386 479 375 512 375 C545 375 571 386 594 414 C571 443 545 457 512 457 C479 457 453 443 430 414Z" fill="url(#pbg)" stroke="#041127" strokeWidth="14" strokeLinejoin="round"/>
          <path d="M459 445 C477 468 492 477 512 477 C532 477 547 468 565 445" fill="#0C1022" stroke="#041127" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M484 470 C495 459 505 455 512 455 C519 455 529 459 540 470 C529 480 520 485 512 485 C504 485 495 480 484 470Z" fill="#F07A57"/>
          <path d="M295 505 C344 483 414 471 512 471 C610 471 680 483 729 505 C715 543 694 569 662 583 C617 565 566 557 512 557 C458 557 407 565 362 583 C330 569 309 543 295 505Z" fill="url(#psg)" stroke="#0B3E87" strokeWidth="16" strokeLinejoin="round"/>
          <path d="M332 518 C392 494 453 489 520 492" stroke="#6CB5FF" strokeWidth="10" strokeLinecap="round" opacity="0.55"/>
          <path d="M552 515 C583 504 616 507 639 522 C656 533 664 551 664 581 L664 748 C664 772 650 790 627 800 C607 809 582 812 559 804 C536 796 522 779 522 756 L522 577 C522 547 532 526 552 515Z" fill="url(#psg)" stroke="#0B3E87" strokeWidth="16" strokeLinejoin="round"/>
          <path d="M541 545 C562 534 585 529 618 533" stroke="#6CB5FF" strokeWidth="10" strokeLinecap="round" opacity="0.5"/>
          <path d="M586 658 C598 634 628 624 650 635 C670 645 678 668 668 686 C654 713 628 730 599 750 C570 729 544 712 530 686 C520 668 528 645 548 635 C570 624 600 634 612 658 C607 663 592 663 586 658Z" fill="#FFFFFF"/>
        </g>
      </svg>
    </div>
  );
}

function PenguinFront() {
  const sz = { width: "clamp(90px, 12vw, 130px)" };
  return (
    <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
      <svg viewBox="0 0 1024 1024" fill="none" className="h-auto overflow-visible" style={sz} aria-hidden="true">
        <linearGradient id="pwg2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#1A3769"/><stop offset="1" stopColor="#091A37"/>
        </linearGradient>
        <path d="M320 519 C298 535 286 562 286 600 C286 649 309 695 350 719 C383 737 420 730 432 695 C440 671 436 643 424 611 C410 572 388 544 360 522 C348 513 333 511 320 519Z" fill="url(#pwg2)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
        <path d="M704 519 C726 535 738 562 738 600 C738 649 715 695 674 719 C641 737 604 730 592 695 C584 671 588 643 600 611 C614 572 636 544 664 522 C676 513 691 511 704 519Z" fill="url(#pwg2)" stroke="#041127" strokeWidth="16" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export function AuthMark() {
  return (
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[12px] border border-[color:var(--auth-border)] bg-[#2779a7]">
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M2 10 L5 6 L8 8 L12 3"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function AuthLogo() {
  return (
    <div className="mx-auto w-fit relative z-0">
      <PenguinBack />
      <div className="relative z-10">
        <AuthMark />
      </div>
      <PenguinFront />
    </div>
  );
}

export function AuthShell({
  title,
  subtitle,
  eyebrow,
  switchPrompt,
  switchCta,
  switchTo,
  children,
  footerNote,
  topActionTo = "/",
  topActionLabel = "Home",
  showTopAction = true,
}) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[color:var(--auth-bg)]" style={pageVars}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.08]" />
      {showTopAction ? (
        <Link
          to={topActionTo}
          className={`absolute left-4 top-4 z-10 inline-flex min-h-10 items-center gap-2 text-caption tracking-[0.02em] text-[color:var(--auth-muted)] transition-colors hover:text-[color:var(--auth-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(255,255,255,0.15)] sm:left-5 sm:top-5 ${FONTS.body}`}
        >
          <ChevronLeft size={16} />
          <span>{topActionLabel}</span>
        </Link>
      ) : null}

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[34rem] items-center justify-center px-5 py-8 sm:py-10">
        <section className="w-full">
          <AuthLogo />
          <div className="mt-6 text-center">
            {eyebrow ? (
              <div
                className={`mb-2.5 text-caption tracking-[0.08em] text-[color:var(--auth-muted)] ${FONTS.body}`}
              >
                {eyebrow}
              </div>
            ) : null}

            <h1
              className={`text-[clamp(2rem,5vw,2.75rem)] font-bold leading-[1] tracking-[-0.035em] text-[color:var(--auth-text)] ${FONTS.display}`}
            >
              {title}
            </h1>
            <p
              className={`mx-auto mt-3 max-w-[22rem] text-body-sm leading-6 text-[#a8bdce] ${FONTS.body}`}
            >
              {subtitle}
            </p>
            {switchPrompt && switchCta && switchTo ? (
              <p
                className={`mx-auto mt-1.5 text-body-sm leading-5 text-[color:var(--auth-muted)] ${FONTS.body}`}
              >
                {switchPrompt}{" "}
                <Link
                  to={switchTo}
                  className="text-[color:var(--auth-text)] transition-opacity hover:opacity-75"
                >
                  {switchCta}
                </Link>
              </p>
            ) : null}
          </div>

          <div className="mt-7">{children}</div>

          {footerNote ? (
            <p
              className={`mx-auto mt-6 max-w-[24rem] text-center text-tiny leading-5 text-[color:var(--auth-muted)] ${FONTS.body}`}
            >
              {footerNote}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
