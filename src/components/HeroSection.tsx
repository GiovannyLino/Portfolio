import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import { cn } from "@/lib/utils";
import { useIntroDone } from "@/motion/intro";
import Magnetic from "@/motion/Magnetic";
import { Reveal, RevealGroup } from "@/motion/Reveal";
import { trackProgress } from "@/motion/scroll";
import SplitText from "@/motion/SplitText";
import { Arrow, RollText } from "./Controls";
import HeroGlobe from "./HeroGlobe";
import ui from "./ui.module.css";
import styles from "./HeroSection.module.css";

// Words of the tagline set in the accent colour, in any of the three languages. A tagline
// that stops using them simply loses the highlight.
const ACCENT_WORDS = new Set(["code", "infrastructure", "código", "infraestrutura", "infraestructura"]);
const isAccentWord = (word: string): boolean => ACCENT_WORDS.has(word.toLowerCase().replace(/[^\p{L}]/gu, ""));

// São Paulo, SP (profile.location).
const TIME_ZONE = "America/Sao_Paulo";
const LOCALES: Record<Language, string> = { en: "en-US", pt: "pt-BR", es: "es" };

/** Giovanny's wall-clock time, refreshed on the minute. */
function useLocalTime(language: Language): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setNow(Date.now());
        schedule();
      }, 60_000 - (Date.now() % 60_000) + 50);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return useMemo(() => {
    try {
      return new Intl.DateTimeFormat(LOCALES[language], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: TIME_ZONE,
        timeZoneName: "short",
      }).format(now);
    } catch {
      return "";
    }
  }, [language, now]);
}

const HeroSection = () => {
  const { t, language } = useLanguage();
  const ready = useIntroDone();
  const localTime = useLocalTime(language);
  const badgePathId = `hero-badge-${useId().replace(/:/g, "")}`;
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  // The next section slides over the pinned hero: once it is fully covered, stop drawing it.
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;
    return trackProgress(frame, {
      measure: () => window.scrollY / Math.max(1, section.offsetHeight),
      smooth: 70,
      essential: true,
      onChange: (progress) => setCovered(progress >= 0.999),
    });
  }, []);

  const [role, focus] = profile.headline[language].split(" | ");
  const badgeText = `${t.hero.scrollDown} • `.repeat(2);

  return (
    <section
      ref={sectionRef}
      className={cn(styles.hero, "surface-ink")}
      data-surface="ink"
      data-covered={covered || undefined}
      aria-labelledby="hero-name"
    >
      <div ref={frameRef} className={cn(styles.frame, "grain")}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.globe}>
          <HeroGlobe className={styles.canvas} play={ready} paused={covered} />
        </div>

        {/* Reading order: name and tagline, introduction, actions. On wide screens the grid
            lifts the introduction up beside the badge. */}
        <div className={cn("wrap", styles.content)}>
          <Reveal play={ready} variant="scale" delay={900} className={styles.badgeSlot}>
            <Magnetic strength={0.28}>
              <a href="#about" className={styles.badge} aria-label={t.hero.scrollDown}>
                <svg viewBox="0 0 120 120" className={styles.badgeRing} aria-hidden="true" focusable="false">
                  <defs>
                    <path id={badgePathId} d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0" />
                  </defs>
                  <text>
                    <textPath href={`#${badgePathId}`} textLength="291" lengthAdjust="spacing">
                      {badgeText}
                    </textPath>
                  </text>
                </svg>
                <span className={styles.badgeCore}>
                  <ArrowDown size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
              </a>
            </Magnetic>
          </Reveal>

          <div className={styles.headline}>
            <Reveal play={ready} delay={150} className={cn("label", styles.eyebrow)}>
              <span>{t.hero.greeting}</span>{" "}
              <h1 id="hero-name" className={styles.name}>
                {t.hero.name}
              </h1>
            </Reveal>
            <SplitText
              as="h2"
              text={profile.tagline[language]}
              className={cn("display", styles.tagline)}
              accent={isAccentWord}
              play={ready}
              delay={260}
              stagger={75}
            />
          </div>

          <Reveal play={ready} delay={750} className={styles.lede}>
            <p className={cn("label", styles.role)}>
              {role}
              {focus && <span>{focus}</span>}
            </p>
            <p>{profile.intro[language]}</p>
          </Reveal>

          <RevealGroup play={ready} className={styles.bottom}>
            <Reveal as="p" index={9} className={cn("label", styles.meta)}>
              <span>{profile.location[language]}</span>
              {localTime && (
                <span className={styles.clock}>
                  <span className="live-dot" aria-hidden="true" />
                  <span className="sr-only">{t.hero.localTime}: </span>
                  <time>{localTime}</time>
                </span>
              )}
            </Reveal>

            <Reveal index={10} className={styles.actions}>
              <a href="#projects" className={ui.button}>
                <RollText>{t.hero.viewWork}</RollText>
                <Arrow direction="down" />
              </a>
              <a href="#contact" className={ui.button} data-variant="outline">
                <RollText>{t.hero.getInTouch}</RollText>
                <Arrow />
              </a>
            </Reveal>

            <Reveal as="ul" index={11} className={styles.socials}>
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
            </Reveal>
          </RevealGroup>
        </div>

        <div className={styles.dim} aria-hidden="true" />
      </div>
    </section>
  );
};

export default HeroSection;
