import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { FONTS } from "./ui/pudgy-brand";

const navItems = [
  { href: "#product", label: "See it work" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

const baseLinkClass =
  `inline-flex h-[58px] items-center px-2 text-[0.875rem] font-medium text-[var(--home-muted)] no-underline transition-colors duration-150 hover:text-[var(--home-text)] focus-visible:text-[var(--home-text)] lg:px-4 ${FONTS.body}`;
const mobileLinkClass =
  `flex min-h-16 w-full items-center border-b border-[var(--home-border)] py-4 text-[1.05rem] font-medium text-[var(--home-text)] no-underline transition-colors duration-150 hover:text-[var(--home-accent)] ${FONTS.body}`;

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2.5 no-underline">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2779a7]">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      </div>
      <span className={`text-sub font-semibold tracking-[-0.02em] text-[var(--home-text)] ${FONTS.display}`}>TrackerGen</span>
    </a>
  );
}

function NavLink({ children, href = "#", className = "", onClick }) {
  return <a href={href} onClick={onClick} className={`${baseLinkClass} ${className}`.trim()}>{children}</a>;
}

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        menuButtonRef.current?.focus();
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav aria-label="Primary navigation" className="sticky top-0 z-[80] isolate border-b border-[var(--home-border)] bg-[var(--home-nav)] backdrop-blur-xl">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center px-6 md:h-[58px] md:max-w-7xl">
        <div className="flex w-full items-center justify-between py-4 md:w-auto md:flex-1 md:py-0">
          <Logo />
          <div className="flex items-center md:hidden">
            <button ref={menuButtonRef} type="button" aria-expanded={isMenuOpen} aria-controls={mobileMenuId} aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--home-text)] transition-colors duration-150 hover:bg-[var(--home-surface-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--home-border-strong)]">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
        <ul className="hidden items-center justify-center md:flex">
          {navItems.map((item) => <li key={item.href}><NavLink href={item.href}>{item.label}</NavLink></li>)}
        </ul>
        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          <a href="/login" className={`nav-signin-glow inline-flex ${FONTS.body}`}>Sign In</a>
        </div>
      </div>

      {isMenuOpen ? (
        <div id={mobileMenuId} className="absolute inset-x-0 top-full z-20 h-[calc(100svh-73px)] overflow-y-auto border-t border-[var(--home-border)] bg-[var(--home-bg)] md:hidden">
          <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 pb-6">
            <div>
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} className={mobileLinkClass} onClick={closeMenu}>{item.label}</NavLink>
              ))}
              <a href="/login" onClick={closeMenu} className={mobileLinkClass}>Sign in</a>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
