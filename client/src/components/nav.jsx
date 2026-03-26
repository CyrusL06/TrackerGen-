import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import NavCta from "./ui2.0/HomePage/navcta";
import { FONTS, LAYOUT } from "./ui2.0/brand";

const navItems = [
  { href: "#home", label: "Overview" },
  { href: "#workflow", label: "Workflow" },
  { href: "#access", label: "Access" },
];

const baseLinkClass =
  `text-[0.78rem] uppercase tracking-[0.06em] text-[color:var(--brand-muted)] no-underline transition-colors duration-200 hover:text-[color:var(--brand-text)] ${FONTS.mono}`;
const mobileLinkClass =
  `block w-full border-b border-[color:var(--brand-border)] px-3 py-4 text-[0.76rem] uppercase tracking-[0.12em] text-[color:var(--brand-text)] no-underline transition-colors duration-200 hover:bg-[color:var(--brand-surface)] hover:text-[color:var(--brand-accent)] ${FONTS.mono}`;
const mobilePanelShellClass = "mx-auto w-full max-w-[1400px] px-4 pb-4";

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2.5 no-underline">
      <div className="delight-orbit flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-accent)] shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 10 L5 6 L8 8 L12 3" stroke="var(--brand-bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={`text-[1.3rem] tracking-[0.05em] text-[color:var(--brand-text)] ${FONTS.display}`}>
        TRACKERGEN
      </span>
    </a>
  );
}

function NavLink({ children, href = "#", className = "", onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`${baseLinkClass} ${className}`.trim()}
    >
      {children}
    </a>
  );
}

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuId = useId();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[color:var(--brand-border)] bg-[rgba(18,16,13,0.94)]">
      <div className={`${LAYOUT.nav} flex-wrap md:flex-nowrap`}>
        <div className="delight-rise flex w-full items-center justify-between gap-4 md:w-auto md:flex-none md:justify-start">
          <Logo />
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`inline-flex items-center gap-2 border border-[color:var(--brand-border)] px-3 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-[color:var(--brand-text)] transition-colors duration-200 hover:border-[color:var(--brand-accent)] hover:text-[color:var(--brand-accent)] md:hidden ${FONTS.mono}`}
          >
            {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
            <span>{isMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        <ul className="hidden flex-1 items-center justify-center gap-4 px-2 md:flex md:gap-8 delight-rise delight-delay-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 md:block delight-rise delight-delay-2">
          <NavCta href="/login">Log in</NavCta>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[color:var(--brand-border)] md:hidden">
          <div className={mobilePanelShellClass}>
            <div
              id={mobileMenuId}
              className="border-x border-b border-[color:var(--brand-border)] bg-[color:var(--brand-bg)]"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className={mobileLinkClass}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              ))}

              <a
                href="/login"
                onClick={closeMenu}
                className={`block w-full px-3 py-4 text-[0.76rem] uppercase tracking-[0.12em] text-[color:var(--brand-accent)] no-underline transition-colors duration-200 hover:bg-[color:var(--brand-surface)] hover:text-[color:var(--brand-text)] ${FONTS.mono}`}
              >
                Preview login
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
