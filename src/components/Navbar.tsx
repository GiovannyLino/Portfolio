import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/knowledge";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useLanguage } from "@/i18n/LanguageContext";
import { SECTION_IDS, sectionNumber } from "@/lib/sections";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language } = useLanguage();
  const activeSection = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const sectionLinks = (linkClassName: string) =>
    SECTION_IDS.map((id) => {
      const isActive = activeSection === id;
      return (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={closeMobile}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "font-mono transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground",
              linkClassName,
            )}
          >
            <span className="text-primary">{sectionNumber(id)}</span> {t.nav.links[id]}
          </a>
        </li>
      );
    });

  const resumeLink = (className: string) => (
    <a
      href={profile.links.resume[language]}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-200",
        className,
      )}
    >
      {t.nav.resume}
    </a>
  );

  return (
    <nav
      aria-label={t.nav.primary}
      // Leaves room for the chat drawer on desktop, like the body does.
      style={{ right: "var(--gioai-offset, 0px)" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ? "glass-card border-b border-border/50 py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between gap-6">
        <a href="#" className="shrink-0 whitespace-nowrap font-mono text-lg font-medium text-primary transition-colors hover:text-primary/80">
          {"<GL />"}
        </a>

        {/* With the chat drawer open the page is ~420px narrower: use the compact menu. */}
        <ul className="hidden lg:flex items-center gap-6 [[data-gioai-open]_&]:hidden">{sectionLinks("text-sm")}</ul>

        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <LanguageSwitcher />
          {resumeLink("px-4 py-2 text-sm")}
        </div>

        <button
          className="lg:hidden text-foreground [[data-gioai-open]_&]:block"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-border/50 mt-3 [[data-gioai-open]_&]:block">
          <ul className="flex flex-col items-center gap-5 py-8">
            {sectionLinks("text-base")}
            <li className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </li>
            <li>{resumeLink("px-6 py-2")}</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
