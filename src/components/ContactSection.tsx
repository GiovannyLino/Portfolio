import { profile } from "@/data/knowledge";
import ContactForm from "@/features/contact/ContactForm";
import { useLanguage } from "@/i18n/LanguageContext";
import Section from "./Section";

const ContactSection = () => {
  const { t, language } = useLanguage();

  return (
    <Section id="contact">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-primary text-sm mb-4">{t.contact.subtitle}</p>
          <p className="text-muted-foreground leading-relaxed">{profile.availability[language]}</p>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
};

export default ContactSection;
