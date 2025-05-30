import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button onClick={toggleLanguage} style={{ position: "fixed", top: 20, right: 20 }}>
      {language === "en" ? "🇧🇷 Português" : "🇺🇸 English"}
    </button>
  );
};

export default LanguageToggle;
