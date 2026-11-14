import { useEffect } from "react";
import { Arrow, RollText } from "@/components/Controls";
import { LogoMark } from "@/components/Logo";
import ui from "@/components/ui.module.css";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import SplitText from "@/motion/SplitText";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", window.location.pathname);
  }, []);

  return (
    <main className={cn(styles.page, "surface-ink", "grain")}>
      <a href="/" className={styles.logo} aria-label="Giovanny Lino">
        <LogoMark size={36} />
      </a>
      <div className={styles.content}>
        <SplitText as="h1" by="letter" text="404" className={cn("display", styles.code)} stagger={90} />
        <p className={styles.title}>{t.notFound.title}</p>
        <a href="/" className={ui.button}>
          <RollText>{t.notFound.back}</RollText>
          <Arrow />
        </a>
      </div>
    </main>
  );
};

export default NotFound;
