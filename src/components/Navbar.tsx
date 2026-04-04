import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <span className="font-mono text-primary text-xs mr-1">0{i + 1}.</span>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/Giovanny_Lino_CV_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-primary text-primary text-sm font-medium rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-border/50 mt-2">
          <ul className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span className="font-mono text-primary text-sm mr-2">0{i + 1}.</span>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/Giovanny_Lino_CV_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
