import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/knowledge";
import { onContactPrefill, type ContactPrefill } from "@/features/chat/chat-bus";
import { useLanguage } from "@/i18n/LanguageContext";
import { contactHref } from "@/lib/contact";
import Section from "./Section";

const ContactSection = () => {
  const { t, language } = useLanguage();
  const [prefill, setPrefill] = useState<ContactPrefill | null>(null);

  useEffect(() => onContactPrefill(setPrefill), []);

  return (
    <Section id="contact">
      <div className="text-center max-w-2xl mx-auto">
        <p className="font-mono text-primary text-sm mb-4">{t.contact.subtitle}</p>
        <p className="text-muted-foreground leading-relaxed mb-10">{profile.availability[language]}</p>
        <Button variant="hero" size="lg" asChild>
          <a id="contact-email" href={contactHref(profile.links.email, prefill)}>
            <Mail size={18} aria-hidden="true" />
            {t.contact.button}
          </a>
        </Button>
      </div>
    </Section>
  );
};

export default ContactSection;
