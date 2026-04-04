import { useLanguage } from "@/i18n/LanguageContext";
import { Language } from "@/i18n/translations";

const flags: Record<Language, string> = {
  en: "🇺🇸",
  pt: "🇧🇷",
  es: "🇪🇸",
};

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const langs: Language[] = ["en", "pt", "es"];

  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
      {langs.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`text-sm px-2 py-1 rounded-full transition-all duration-200 ${
            language === lang
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={`Switch to ${lang}`}
        >
          {flags[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
