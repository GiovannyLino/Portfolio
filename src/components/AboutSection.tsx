import { Briefcase, GraduationCap } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <span className="font-mono text-primary text-xl">01.</span>
          About Me
          <span className="hidden sm:block h-px flex-1 bg-border ml-4" />
        </h2>

        <div className="mt-10 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I'm a <span className="text-foreground font-medium">Computer Science student</span> at
              Universidade de São Caetano do Sul (USCS), currently interning at{" "}
              <span className="text-foreground font-medium">Telco Engineering</span> where I work with
              APIs, virtual machines, relational databases, and system integrations.
            </p>
            <p>
              With a solid foundation in both frontend and backend development using
              Node.js, React, and database modeling, I'm focused on building my career in{" "}
              <span className="text-primary font-medium">DevOps</span> — automation, CI/CD,
              infrastructure, and cloud computing.
            </p>
            <p>
              I also hold a <span className="text-foreground font-medium">Mechatronics Technician</span> degree
              from SENAI, which gave me a strong problem-solving mindset and hands-on engineering experience.
            </p>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Experience card */}
            <div className="glass-card rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Telco Engineering</p>
                  <p className="text-xs text-muted-foreground">Intern • 2025 – Present</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                APIs, databases, VMs, system integrations & troubleshooting
              </p>
            </div>

            {/* Education card */}
            <div className="glass-card rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">B.Sc. Computer Science</p>
                  <p className="text-xs text-muted-foreground">USCS • 2024 – 2027</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Mechatronics Technician</p>
                  <p className="text-xs text-muted-foreground">SENAI • 2019 – 2021</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
