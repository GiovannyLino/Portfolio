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
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <main>
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
