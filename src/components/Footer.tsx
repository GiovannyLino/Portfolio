import { ArrowUp } from "lucide-react";
import { currentPosition, profile } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import { SECTION_IDS } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup } from "@/motion/Reveal";
import SplitText from "@/motion/SplitText";
import portrait380 from "@/assets/portrait-380.webp";
import portrait760 from "@/assets/portrait-760.webp";
import { Arrow } from "./Controls";
import ui from "./ui.module.css";
import styles from "./Footer.module.css";

// The footer is the end of the page: nothing can scroll further "into" the viewport.
const AT_PAGE_END = "0px";

const Footer = () => {
  const { t, language } = useLanguage();

  const external = [
    { label: "GitHub", href: profile.links.github },
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: t.nav.resume, href: profile.links.resume[language] },
  ];

  return (
    <footer className={cn(styles.footer, "surface-ink")} data-surface="ink">
      <div className="wrap">
        <div className={styles.top}>
          <Reveal as="figure" className={styles.card} margin={AT_PAGE_END}>
            <div className={styles.portrait}>
              <img
                src={portrait760}
                srcSet={`${portrait380} 380w, ${portrait760} 760w`}
                sizes="(min-width: 900px) 22vw, 60vw"
                width={380}
                height={475}
                alt={profile.name}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <span className={cn("display", styles.name)}>{profile.name}</span>
              <span className="label">
                {currentPosition.role[language]} · {currentPosition.company}
              </span>
            </figcaption>
          </Reveal>

          <RevealGroup className={styles.card} margin={AT_PAGE_END}>
            <ul className={styles.list}>
              {SECTION_IDS.map((id, index) => (
                <Reveal as="li" key={id} index={index}>
                  <a href={`#${id}`} className={cn("display", styles.bigLink)}>
                    {t.nav.links[id]}
                  </a>
                </Reveal>
              ))}
            </ul>
          </RevealGroup>

          <RevealGroup className={styles.card} margin={AT_PAGE_END}>
            <ul className={styles.list}>
              {external.map((link, index) => (
                <Reveal as="li" key={link.label} index={index}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={cn("display", styles.bigLink)}>
                    {link.label}
                    <Arrow />
                  </a>
                </Reveal>
              ))}
              <Reveal as="li" index={external.length}>
                <a href={`mailto:${profile.links.email}`} className={cn("display", styles.bigLink)}>
                  Email
                  <Arrow />
                </a>
              </Reveal>
            </ul>
          </RevealGroup>
        </div>

        {/* The name, as wide as the page. The portrait's caption already states it for
            assistive tech. */}
        <SplitText
          as="p"
          by="letter"
          text={profile.name}
          className={cn("display", styles.wordmark)}
          accent={(_, index) => index > 0}
          stagger={45}
          margin={AT_PAGE_END}
          aria-hidden="true"
        />

        <div className={styles.bottom}>
          <p className="label">
            © {new Date().getFullYear()} · {t.footer.built}
          </p>
          <a href="#" className={cn("label", ui.textLink)}>
            {t.footer.backToTop}
            <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
