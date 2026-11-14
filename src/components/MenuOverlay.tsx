import { useEffect, useRef, type KeyboardEvent } from "react";
import { Github, Linkedin, Mail, X } from "lucide-react";
import { profile } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import { SECTION_IDS, sectionNumber, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { cssVars } from "@/motion/env";
import { Arrow, RollText } from "./Controls";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogoMark } from "./Logo";
import ThemeToggle from "./ThemeToggle";
import ui from "./ui.module.css";
import styles from "./Navbar.module.css";

interface MenuOverlayProps {
  open: boolean;
  onClose: (options?: { restoreFocus?: boolean }) => void;
  activeSection: SectionId | null;
}

const FOCUSABLE = "a[href], button:not([disabled])";

/**
 * Full-screen menu for narrow layouts (phones, or the desktop page squeezed by the chat
 * drawer). Always mounted so it can animate out; while closed it is inert.
 */
const MenuOverlay = ({ open, onClose, activeSection }: MenuOverlayProps) => {
  const { t, language } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.inert = !open;
    if (!open) return;

    closeRef.current?.focus({ preventScroll: true });
    // The page behind must not scroll; scrollbar-gutter keeps the layout from shifting.
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    // Keep focus inside the dialog.
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  // Section links scroll the page: close without stealing focus back to the menu button.
  const follow = () => onClose({ restoreFocus: false });

  return (
    <div
      ref={rootRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      className={cn(styles.menu, "surface-ink")}
      data-open={open || undefined}
      onKeyDown={onKeyDown}
    >
      <div className={styles.menuTop}>
        <a href="#" className={styles.logo} aria-label={profile.name} onClick={follow}>
          <LogoMark size={34} />
          <span className={cn("display", styles.wordmark)} aria-hidden="true">
            Giovanny
            <span className="accent">Lino</span>
          </span>
        </a>
        <button ref={closeRef} type="button" className={styles.menuButton} onClick={() => onClose()} aria-label={t.nav.closeMenu}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label={t.nav.primary} className={styles.menuNav}>
        <ul>
          {SECTION_IDS.map((id, index) => (
            <li key={id} className={styles.menuItem} style={cssVars({ "--i": index })}>
              <a
                href={`#${id}`}
                className={cn("display", styles.menuLink)}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={follow}
              >
                <span className={cn("label", styles.menuNumber)} aria-hidden="true">
                  {sectionNumber(id)}
                </span>
                <span className={styles.menuLabel}>{t.nav.links[id]}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.menuBottom}>
        <div className={styles.switches}>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <ul className={styles.menuSocials}>
          <li>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={ui.iconButton} aria-label="GitHub">
              <Github size={18} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={ui.iconButton} aria-label="LinkedIn">
              <Linkedin size={18} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.links.email}`} className={ui.iconButton} aria-label="Email">
              <Mail size={18} aria-hidden="true" />
            </a>
          </li>
        </ul>
        <a href={profile.links.resume[language]} target="_blank" rel="noopener noreferrer" className={ui.button}>
          <RollText>{t.nav.resume}</RollText>
          <Arrow />
        </a>
      </div>
    </div>
  );
};

export default MenuOverlay;
