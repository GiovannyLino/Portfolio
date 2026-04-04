import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card border-b border-border/50 py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="font-mono text-lg font-medium text-primary transition-colors hover:text-primary/80">
          {"<GL />"}
        </a>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <LanguageSwitcher />
          <a
            href="/Giovanny_Lino_CV_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-primary text-primary text-sm font-medium rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            {t.nav.resume}
          </a>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-border/50 mt-2">
          <ul className="flex flex-col items-center gap-6 py-8">
            <li className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
            </li>
            <li>
              <a
                href="/Giovanny_Lino_CV_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-all"
              >
                {t.nav.resume}
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
