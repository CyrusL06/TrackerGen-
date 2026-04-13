import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import NavCta from "./ui2.0/HomePage/navcta";
import { FONTS, LAYOUT } from "./ui2.0/brand";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#access", label: "Preview" },
];

const baseLinkClass =
  `text-[0.78rem] uppercase tracking-[0.06em] text-[#6b6860] no-underline transition-colors duration-200 hover:text-[#f2ede6] ${FONTS.mono}`;
const mobileLinkClass =
  `block w-full border-b border-[#222220] px-3 py-4 text-[0.76rem] uppercase tracking-[0.12em] text-[#f2ede6] no-underline transition-colors duration-200 hover:bg-[#111110] hover:text-[#c8f135] ${FONTS.mono}`;
const mobilePanelShellClass = "mx-auto w-full max-w-[1400px] px-4 pb-4";

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2.5 no-underline">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c8f135]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 10 L5 6 L8 8 L12 3" stroke="#0a0a08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={`text-[1.3rem] tracking-[0.05em] text-[#f2ede6] ${FONTS.display}`}>
        TRACKI
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
    <nav className="sticky top-0 z-50 border-b border-[#222220] bg-[rgba(10,10,8,0.85)] backdrop-blur-[12px]">
      <div className={`${LAYOUT.nav} flex-wrap md:flex-nowrap`}>
        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:flex-none md:justify-start">
          <Logo />
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`inline-flex items-center gap-2 border border-[#222220] px-3 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-[#f2ede6] transition-colors duration-200 hover:border-[#c8f135] hover:text-[#c8f135] md:hidden ${FONTS.mono}`}
          >
            {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
            <span>{isMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        <ul className="hidden flex-1 items-center justify-center gap-4 px-2 md:flex md:gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 md:block">
          <NavCta href="/login">Log in</NavCta>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[#222220] md:hidden">
          <div className={mobilePanelShellClass}>
            <div id={mobileMenuId} className="border-x border-b border-[#222220] bg-[#0a0a08]">
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
                className={`block w-full px-3 py-4 text-[0.76rem] uppercase tracking-[0.12em] text-[#c8f135] no-underline transition-colors duration-200 hover:bg-[#111110] hover:text-[#f2ede6] ${FONTS.mono}`}
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
