import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t border-border/50 relative z-10">
      <div className="container flex flex-col items-center gap-4">
        <div className="flex items-center gap-5">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href={`mailto:${profile.links.email}`} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
            <Mail size={18} />
          </a>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{t.footer.built}</p>
      </div>
    </footer>
  );
};

export default Footer;
