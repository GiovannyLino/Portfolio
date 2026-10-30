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
import AnimatedBackground from "@/components/AnimatedBackground";
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
    <div className="min-h-screen relative">
      {/* First focusable element: lets keyboard users jump past the navbar. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t.nav.skip}
      </a>
      <AnimatedBackground />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroSection />
        <div className="container max-w-5xl relative z-10">
          {SECTION_IDS.map((id) => {
            const SectionComponent = SECTIONS[id];
            return <SectionComponent key={id} />;
          })}
        </div>
      </main>
      <Footer />
      <ChatLauncher />
    </div>
  );
};

export default Index;
