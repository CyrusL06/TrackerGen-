import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import NavCta from "./ui/HomePage/navcta";
import { FONTS, LAYOUT } from "./ui/pudgy-brand";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#product", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#access", label: "Preview" },
];

const baseLinkClass =
  `text-[0.85rem] font-medium text-[#6b7280] no-underline transition-all duration-200 hover:text-white ${FONTS.body}`;
const mobileLinkClass =
  `block w-full border-b border-[rgba(255,255,255,0.05)] px-4 py-4 text-[0.88rem] font-medium text-white no-underline transition-colors duration-200 hover:bg-[rgba(39,121,167,0.08)] hover:text-[#2779a7] ${FONTS.body}`;

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2.5 no-underline">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2779a7]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      </div>
      <span className={`text-[1.2rem] font-semibold tracking-[-0.02em] text-white ${FONTS.display}`}>Tracki</span>
    </a>
  );
}

function NavLink({ children, href = "#", className = "", onClick }) {
  return <a href={href} onClick={onClick} className={`${baseLinkClass} ${className}`.trim()}>{children}</a>;
}

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuId = useId();

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (event) => { if (event.key === "Escape") setIsMenuOpen(false); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.05)]" style={{ background: "rgba(0,0,0,0.92)" }}>
      <div className={`${LAYOUT.nav} flex-wrap md:flex-nowrap`}>
        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:flex-none md:justify-start">
          <Logo />
          <button type="button" aria-expanded={isMenuOpen} aria-controls={mobileMenuId} aria-label={isMenuOpen ? "Close" : "Open"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] px-3 py-2 text-[0.78rem] font-medium text-[#9ca3af] transition-all duration-200 hover:border-[#2779a7]/40 hover:text-[#2779a7] md:hidden ${FONTS.body}`}>
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span>{isMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
        <ul className="hidden flex-1 items-center justify-center gap-8 px-2 md:flex">
          {navItems.map((item) => <li key={item.href}><NavLink href={item.href}>{item.label}</NavLink></li>)}
        </ul>
        <div className="hidden shrink-0 md:block"><NavCta href="/login">Log in</NavCta></div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[rgba(255,255,255,0.05)] md:hidden">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-4">
            <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] shadow-xl">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} className={mobileLinkClass} onClick={closeMenu}>{item.label}</NavLink>
              ))}
              <a href="/login" onClick={closeMenu}
                className={`block w-full bg-[#2779a7] px-4 py-4 text-center text-[0.88rem] font-medium text-white no-underline transition-opacity hover:opacity-90 ${FONTS.body}`}>
                Log in
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
