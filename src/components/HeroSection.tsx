import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import profileImg from "@/assets/profile.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

      <div className="container relative z-10 py-20">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          <div className="max-w-3xl">
            <p className="font-mono text-primary text-sm md:text-base mb-4 animate-fade-up">
              {t.hero.greeting}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-2 animate-fade-up-delay-1">
              {t.hero.name}
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-6 animate-fade-up-delay-2">
              {t.hero.subtitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-10 animate-fade-up-delay-3">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 animate-fade-up-delay-4">
              <Button variant="hero" size="lg" asChild>
                <a href="#content">{t.hero.viewWork}</a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#content">{t.hero.getInTouch}</a>
              </Button>
            </div>

            <div className="flex items-center gap-5 mt-12 animate-fade-up-delay-4">
              <a href="https://github.com/GiovannyLino" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:-translate-y-1 transform" aria-label="GitHub">
                <Github size={22} />
              </a>
              <a href="https://www.linkedin.com/in/giovanny-lino/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:-translate-y-1 transform" aria-label="LinkedIn">
                <Linkedin size={22} />
              </a>
              <a href="mailto:giovannylino9@gmail.com" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:-translate-y-1 transform" aria-label="Email">
                <Mail size={22} />
              </a>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="relative flex-shrink-0">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg glow">
              <img
                src={profileImg}
                alt="Giovanny Lino"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
              <span className="text-primary-foreground text-xs font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      <a href="#content" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors" style={{ animation: "float 2s ease-in-out infinite" }}>
        <ArrowDown size={24} />
      </a>
    </section>
  );
};

export default HeroSection;
