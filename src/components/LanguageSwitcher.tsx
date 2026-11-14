import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import { cssVars } from "@/motion/env";
import styles from "./Toolbar.module.css";

// Codes instead of flags: a language is not a country, and Windows draws no flag emoji.
const LANGUAGES: readonly { code: Language; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "pt", label: "PT", name: "Português" },
  { code: "es", label: "ES", name: "Español" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const active = LANGUAGES.findIndex((item) => item.code === language);

  return (
    <div role="group" aria-label={t.nav.language} className={styles.languages} style={cssVars({ "--active": active })}>
      <span className={styles.thumb} aria-hidden="true" />
      {LANGUAGES.map((item) => (
        <button
          key={item.code}
          type="button"
          lang={item.code}
          className={styles.language}
          aria-label={item.name}
          aria-pressed={item.code === language}
          onClick={() => setLanguage(item.code)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
