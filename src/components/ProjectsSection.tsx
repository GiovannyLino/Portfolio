import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Know Your Fan",
    description:
      "A web app to collect and analyze eSports fans data, built with React, Vite, and Tailwind CSS. Deployed on Vercel with GitHub CI/CD.",
    tags: ["React", "Vite", "Tailwind CSS", "Vercel"],
    github: "https://github.com/GiovannyLino/FURIA-KnowYourFan",
  },
  {
    title: "FURIA ChatBot",
    description:
      "AI-powered chatbot for FURIA eSports to improve fan engagement through intelligent conversations and data insights.",
    tags: ["AI", "Chatbot", "Fan Engagement"],
    github: "https://github.com/GiovannyLino/FURIA-ChatBot",
  },
  {
    title: "Order System API",
    description:
      "REST API built with Express and MySQL featuring layered architecture, relational modeling, and Git-based versioning.",
    tags: ["Node.js", "Express", "MySQL", "REST API"],
    github: "https://github.com/GiovannyLino",
  },
  {
    title: "Rick & Morty SPA",
    description:
      "Single Page Application built with Angular consuming a public API, with modular structure and route management.",
    tags: ["Angular", "TypeScript", "API Integration"],
    github: "https://github.com/GiovannyLino/spa-rick-and-morty",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <span className="font-mono text-primary text-xl">03.</span>
          Featured Projects
          <span className="hidden sm:block h-px flex-1 bg-border ml-4" />
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="glass-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Code2Icon className="text-primary" size={24} />
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${project.title} on GitHub`}
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`View ${project.title}`}
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simple code icon
const Code2Icon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </svg>
);

export default ProjectsSection;
