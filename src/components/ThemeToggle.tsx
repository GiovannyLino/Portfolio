import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import ui from "./ui.module.css";
import styles from "./Toolbar.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  // The new theme spreads from the button; keyboard activation has no pointer position,
  // so it starts from the button's centre.
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const fromPointer = event.clientX !== 0 || event.clientY !== 0;
    toggleTheme({
      x: fromPointer ? event.clientX : rect.left + rect.width / 2,
      y: fromPointer ? event.clientY : rect.top + rect.height / 2,
    });
  };

  return (
    <button
      type="button"
      className={cn(ui.iconButton, styles.theme)}
      data-theme={theme}
      onClick={onClick}
      aria-label={t.nav.theme}
      aria-pressed={theme === "dark"}
      title={t.nav.theme}
    >
      <Sun size={17} className={styles.sun} aria-hidden="true" />
      <Moon size={17} className={styles.moon} aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
