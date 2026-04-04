import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <p className="font-mono text-primary text-sm md:text-base mb-4 animate-fade-up">
            Hi, my name is
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-2 animate-fade-up-delay-1">
            Giovanny Lino.
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-muted-foreground mb-6 animate-fade-up-delay-2">
            I build things for the web.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mb-10 animate-fade-up-delay-3">
            Computer Science student & aspiring DevOps engineer, focused on building
            scalable systems with clean architecture. Currently working with APIs,
            infrastructure, and cloud solutions.
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-fade-up-delay-4">
            <Button variant="hero" size="lg" asChild>
              <a href="#projects">View My Work</a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#contact">Get In Touch</a>
            </Button>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5 mt-12 animate-fade-up-delay-4">
            <a
              href="https://github.com/GiovannyLino"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:-translate-y-1 transform"
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/giovanny-lino/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:-translate-y-1 transform"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="mailto:giovannylino9@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:-translate-y-1 transform"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
        style={{ animation: "float 2s ease-in-out infinite" }}
      >
        <ArrowDown size={24} />
      </a>
    </section>
  );
};

export default HeroSection;
