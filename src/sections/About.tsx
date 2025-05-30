import { useLanguage } from '../context/LanguageContext';
import LottieAnimation from '../sections/LottieAnimation'; // ajuste o caminho conforme sua estrutura

const About = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'About Me',
      paragraphs: [
        "I’m a software developer based in Brazil, passionate about building scalable and efficient web applications.",
        "With a background in computer science and experience in React, TypeScript, and backend technologies, I strive to create clean and maintainable code.",
      ],
      skillsTitle: 'Skills',
      skills: {
        frontEnd: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Next', 'C', 'Java'],
        backEnd: ['Node.js', 'Express', 'MySQL', 'MongoDB', 'PostgreSQL', 'Oracle SQL', 'Oracle APEX'],
        tools: ['Git', 'GitHub', 'Postman', 'Metodologias Ágeis'],
      },
      sections: {
        frontEnd: 'Front-end',
        backEnd: 'Back-end & DataBase',
        tools: 'Tools & Versioning',
      }
    },
    pt: {
      title: 'Sobre Mim',
      paragraphs: [
        "Sou um desenvolvedor de software baseado no Brasil, apaixonado por construir aplicações web escaláveis e eficientes.",
        "Em formação na área de ciência da computação e experiência em React, TypeScript e tecnologias backend, me esforço para criar código limpo e sustentável.",
      ],
      skillsTitle: 'Habilidades',
      skills: {
        frontEnd: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Next', 'C', 'Java'],
        backEnd: ['Node.js', 'Express', 'MySQL', 'MongoDB', 'PostgreSQL', 'Oracle SQL', 'Oracle APEX'],
        tools: ['Git', 'GitHub', 'Postman', 'Metodologias Ágeis'],
      },
      sections: {
        frontEnd: 'Front-end',
        backEnd: 'Back-end & Banco de Dados',
        tools: 'Ferramentas & Versionamento',
      }
    }
  };

  const t = content[language];

  return (
    <section id="about">
      <h2 data-number="01.">{t.title}</h2>
      {t.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      <h3>{t.skillsTitle}</h3>
      <div className="skills-columns">
        <div>
          <h4>{t.sections.frontEnd}</h4>
          <ul className="skills-list">
            {t.skills.frontEnd.map(skill => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{t.sections.backEnd}</h4>
          <ul className="skills-list">
            {t.skills.backEnd.map(skill => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{t.sections.tools}</h4>
          <ul className="skills-list">
            {t.skills.tools.map(skill => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Aqui a animação Lottie logo abaixo das skills */}
      <LottieAnimation />
    </section>
  );
};

export default About;
