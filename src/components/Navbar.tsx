import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/knowledge";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useLanguage } from "@/i18n/LanguageContext";
import { SECTION_IDS, sectionNumber } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { useIntroDone } from "@/motion/intro";
import { trackProgress } from "@/motion/scroll";
import { Arrow, RollText } from "./Controls";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogoMark } from "./Logo";
import MenuOverlay from "./MenuOverlay";
import type { Surface } from "./Section";
import ThemeToggle from "./ThemeToggle";
import ui from "./ui.module.css";
import styles from "./Navbar.module.css";

const TOP_PX = 24;
const HIDE_AFTER_PX = 160;
const DIRECTION_THRESHOLD_PX = 6;

/** Hides the bar while the visitor scrolls down and brings it back on the way up. */
function useScrollState() {
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < TOP_PX);
      if (Math.abs(y - lastY) < DIRECTION_THRESHOLD_PX) return;
      setHidden(y > lastY && y > HIDE_AFTER_PX);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { atTop, hidden };
}

/** The surface (ink or paper) of the section passing under the bar, so the bar can match it. */
function useSurfaceBelow(): Surface {
  const [surface, setSurface] = useState<Surface>("ink");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));
    const under = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) under.add(entry.target);
          else under.delete(entry.target);
        }
        // Sheets overlap at their rounded corners: the later one is the one on top.
        const top = sections.filter((section) => under.has(section)).pop();
        if (top) setSurface(top.dataset.surface === "paper" ? "paper" : "ink");
      },
      // A thin band at the top of the viewport, where the bar is.
      { rootMargin: "0px 0px -96% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return surface;
}

const pageProgress = (): number => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  return scrollable <= 0 ? 0 : window.scrollY / scrollable;
};

const Navbar = () => {
  const { t, language } = useLanguage();
  const ready = useIntroDone();
  const activeSection = useScrollSpy(SECTION_IDS);
  const { atTop, hidden } = useScrollState();
  const surface = useSurfaceBelow();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Reading progress: an indicator, so it also runs under reduced motion.
  useEffect(() => {
    if (!progressRef.current) return;
    return trackProgress(progressRef.current, { measure: pageProgress, property: "--scroll", smooth: 90, essential: true });
  }, []);

  const closeMenu = useCallback(({ restoreFocus = true }: { restoreFocus?: boolean } = {}) => {
    setMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <div ref={progressRef} className={styles.progress} aria-hidden="true" />

      <header
        // Over the hero the bar is transparent, so it keeps the hero's ink colours.
        className={cn(styles.bar, `surface-${atTop ? "ink" : surface}`)}
        data-top={atTop || undefined}
        data-hidden={(hidden && !menuOpen) || undefined}
        data-ready={ready || undefined}
      >
        <nav aria-label={t.nav.primary} className={styles.inner}>
          <a href="#" className={styles.logo} aria-label={profile.name}>
            <LogoMark size={34} />
            <span className={cn("display", styles.wordmark)} aria-hidden="true">
              Giovanny
              <span className="accent">Lino</span>
            </span>
          </a>

          <ul className={styles.links}>
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={styles.link}
                  aria-current={activeSection === id ? "location" : undefined}
                >
                  <span className={styles.linkNumber} aria-hidden="true">
                    {sectionNumber(id)}
                  </span>
                  <RollText>{t.nav.links[id]}</RollText>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.tools}>
            <div className={styles.switches}>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <a
              href={profile.links.resume[language]}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(ui.button, styles.resume)}
              data-size="small"
            >
              <RollText>{t.nav.resume}</RollText>
              <Arrow />
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              onClick={() => setMenuOpen(true)}
              aria-label={t.nav.openMenu}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              <span>{t.nav.menu}</span>
              <span className={styles.menuIcon} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <MenuOverlay open={menuOpen} onClose={closeMenu} activeSection={activeSection} />
    </>
  );
};

export default Navbar;
