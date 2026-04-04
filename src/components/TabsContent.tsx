import { useState } from "react";
import { User, Wrench, FolderOpen, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";

const tabs = [
  { key: "about", icon: User },
  { key: "skills", icon: Wrench },
  { key: "projects", icon: FolderOpen },
  { key: "contact", icon: Mail },
] as const;

type TabKey = typeof tabs[number]["key"];

const TabsNavigation = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const { t } = useLanguage();

  const tabLabels: Record<TabKey, string> = {
    about: t.tabs.about,
    skills: t.tabs.skills,
    projects: t.tabs.projects,
    contact: t.tabs.contact,
  };

  return (
    <section id="content" className="py-20 md:py-28 relative z-10">
      <div className="container max-w-5xl">
        {/* Tab buttons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl glass-card border border-border/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tabLabels[tab.key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content with animation */}
        <div className="animate-fade-up" key={activeTab}>
          {activeTab === "about" && <AboutSection />}
          {activeTab === "skills" && <SkillsSection />}
          {activeTab === "projects" && <ProjectsSection />}
          {activeTab === "contact" && <ContactSection />}
        </div>
      </div>
    </section>
  );
};

export default TabsNavigation;
