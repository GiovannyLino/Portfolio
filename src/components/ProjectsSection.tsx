import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const projectMeta = [
  {
    tags: ["React", "Vite", "Tailwind CSS", "Vercel"],
    github: "https://github.com/GiovannyLino/FURIA-KnowYourFan",
  },
  {
    tags: ["AI", "Chatbot", "Fan Engagement"],
    github: "https://github.com/GiovannyLino/FURIA-ChatBot",
  },
  {
    tags: ["Node.js", "Express", "MySQL", "REST API"],
    github: "https://github.com/GiovannyLino",
  },
  {
    tags: ["Angular", "TypeScript", "API Integration"],
    github: "https://github.com/GiovannyLino/spa-rick-and-morty",
  },
];

const Code2Icon = ({ className, size }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </svg>
);

const ProjectsSection = () => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        {t.projects.items.map((project, i) => (
          <div
            key={project.title}
            className="glass-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code2Icon className="text-primary" size={24} />
              </div>
              <div className="flex items-center gap-3">
                <a href={projectMeta[i].github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={`${project.title} on GitHub`}>
                  <Github size={20} />
                </a>
                <a href={projectMeta[i].github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={`View ${project.title}`}>
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              {projectMeta[i].tags.map((tag) => (
                <span key={tag} className="font-mono text-xs text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
