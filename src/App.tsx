import { useCallback, useState } from "react";
import Preloader from "@/components/Preloader";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Cursor from "@/motion/Cursor";
import { IntroContext } from "@/motion/intro";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// A single page: anything but "/" is a 404 (vercel.json serves index.html for every path).
const isHome = (): boolean => /^\/(index\.html)?$/.test(window.location.pathname);

const App = () => {
  // False while the preloader covers the page; the navbar and the hero enter when it lifts.
  const [introDone, setIntroDone] = useState(false);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <IntroContext.Provider value={introDone}>
          <Preloader onDone={onIntroDone} />
          {isHome() ? <Index /> : <NotFound />}
          <Cursor />
        </IntroContext.Provider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
