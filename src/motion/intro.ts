import { createContext, useContext } from "react";

/**
 * False while the preloader still covers the page, true from the moment it starts to lift:
 * the cue for the navbar and the hero to make their entrance. Components rendered without
 * the provider (tests, the 404 page) are simply "ready".
 */
export const IntroContext = createContext(true);

export const useIntroDone = (): boolean => useContext(IntroContext);
