import { Briefcase, GraduationCap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const RichText = ({ html }: { html: string }) => {
  const processed = html
    .replace(/<strong>/g, '<span class="text-foreground font-medium">')
    .replace(/<\/strong>/g, "</span>")
    .replace(/<accent>/g, '<span class="text-primary font-medium">')
    .replace(/<\/accent>/g, "</span>");
  return <p dangerouslySetInnerHTML={{ __html: processed }} />;
};

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3 space-y-4 text-muted-foreground leading-relaxed">
          <RichText html={t.about.p1} />
          <RichText html={t.about.p2} />
          <RichText html={t.about.p3} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.about.expTitle}</p>
                <p className="text-xs text-muted-foreground">{t.about.expRole}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{t.about.expDesc}</p>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.about.edu1Title}</p>
                <p className="text-xs text-muted-foreground">{t.about.edu1Sub}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.about.edu2Title}</p>
                <p className="text-xs text-muted-foreground">{t.about.edu2Sub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
