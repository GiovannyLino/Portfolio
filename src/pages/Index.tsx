import type { ComponentType } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatLauncher from "@/features/chat/ChatLauncher";
import { useLanguage } from "@/i18n/LanguageContext";
import { SECTION_IDS, type SectionId } from "@/lib/sections";

// Rendered in SECTION_IDS order so the page, the nav numbering and the scrollspy agree.
const SECTIONS: Record<SectionId, ComponentType> = {
  about: AboutSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  education: EducationSection,
  contact: ContactSection,
};

const Index = () => {
  const { t } = useLanguage();

  return (
    <>
      {/* First focusable element: lets keyboard users jump past the navbar. */}
      <a href="#main" className="skip-link">
        {t.nav.skip}
      </a>
      <Navbar />
      {/* #page is the query container the sections size themselves against; everything
          fixed to the viewport (navbar, chat) stays outside of it. See styles/base.css. */}
      <div id="page">
        <main id="main" tabIndex={-1}>
          <HeroSection />
          {SECTION_IDS.map((id) => {
            const SectionComponent = SECTIONS[id];
            return <SectionComponent key={id} />;
          })}
        </main>
        <Footer />
      </div>
      <ChatLauncher />
    </>
  );
};

export default Index;
