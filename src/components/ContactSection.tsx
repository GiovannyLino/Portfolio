import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-muted-foreground leading-relaxed mb-10">
        {t.contact.description}
      </p>
      <Button variant="hero" size="lg" asChild>
        <a href="mailto:giovannylino9@gmail.com">
          <Mail size={18} />
          {t.contact.button}
        </a>
      </Button>
    </div>
  );
};

export default ContactSection;
