import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { profile } from "@/data/knowledge";
import { onContactPrefill, type ContactPrefill } from "@/features/chat/chat-bus";
import { useLanguage } from "@/i18n/LanguageContext";
import { contactHref } from "@/lib/contact";
import { cn } from "@/lib/utils";
import Magnetic from "@/motion/Magnetic";
import Marquee from "@/motion/Marquee";
import { Reveal } from "@/motion/Reveal";
import { Arrow, RollText } from "./Controls";
import Section from "./Section";
import ui from "./ui.module.css";
import styles from "./ContactSection.module.css";

const ContactSection = () => {
  const { t, language } = useLanguage();
  // Subject and draft handed over by the assistant when it sends the visitor here.
  const [prefill, setPrefill] = useState<ContactPrefill | null>(null);

  useEffect(() => onContactPrefill(setPrefill), []);

  return (
    <Section id="contact" surface="ink" className={styles.contact} aside={<p className="label">{t.contact.subtitle}</p>}>
      <div className={styles.body}>
        <Reveal as="p" className={styles.availability}>
          {profile.availability[language]}
        </Reveal>

        <Reveal variant="scale" className={styles.cta}>
          <Magnetic strength={0.22}>
            <a id="contact-email" href={contactHref(profile.links.email, prefill)} className={styles.hello}>
              <Mail size={22} strokeWidth={1.6} aria-hidden="true" />
              <RollText>{t.contact.button}</RollText>
            </a>
          </Magnetic>
        </Reveal>
      </div>

      <Reveal as="ul" className={styles.links}>
        <li className={styles.email}>
          <span className="label">Email</span>
          {profile.links.email}
        </li>
        <li>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={cn("label", ui.textLink)}>
            LinkedIn <Arrow />
          </a>
        </li>
        <li>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={cn("label", ui.textLink)}>
            GitHub <Arrow />
          </a>
        </li>
        <li>
          <a href={profile.links.resume[language]} target="_blank" rel="noopener noreferrer" className={cn("label", ui.textLink)}>
            {t.nav.resume} <Arrow />
          </a>
        </li>
      </Reveal>

      {/* Decoration: the call to action above is the real one. */}
      <Marquee className={styles.marquee} speed={110} reverse>
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={cn("display", styles.marqueeItem)} data-outline={index % 2 === 1 || undefined}>
            {t.contact.button}
            <span className={styles.marqueeMark} />
          </span>
        ))}
      </Marquee>
    </Section>
  );
};

export default ContactSection;
