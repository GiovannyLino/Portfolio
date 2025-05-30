import { useLanguage } from '../context/LanguageContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // <-- import da animação

const projectsData = {
  en: [
    {
      title: 'Know Your Fan',
      description:
        'A web app to collect and analyze eSports fans data with React and Tailwind CSS.',
      link: 'https://github.com/GiovannyLino/FURIA-KnowYourFan',
    },
    {
      title: 'FURIA ChatBot',
      description:
        'Chatbot for FURIA eSports with AI integration to improve fan engagement.',
      link: 'https://github.com/GiovannyLino/FURIA-ChatBot',
    },
    {
      title: 'TaskMan',
      description:
        'Task management app built with modern web technologies.',
      link: 'https://github.com/GiovannyLino/TaskMan',
    },
    {
      title: 'Full Stack Project',
      description:
        'Fullstack frontend and backend project using modern frameworks.',
      link: 'https://github.com/GiovannyLino/Projeto-FullStack-FrontEnd-e-BackEnd-',
    },
  ],
  pt: [
    {
      title: 'Know Your Fan',
      description:
        'Um aplicativo web para coletar e analisar dados de fãs de eSports com React e Tailwind CSS.',
      link: 'https://github.com/GiovannyLino/FURIA-KnowYourFan',
    },
    {
      title: 'FURIA ChatBot',
      description:
        'Chatbot para FURIA eSports com integração de IA para melhorar o engajamento dos fãs.',
      link: 'https://github.com/GiovannyLino/FURIA-ChatBot',
    },
    {
      title: 'TaskMan',
      description:
        'Aplicativo de gerenciamento de tarefas construído com tecnologias web modernas.',
      link: 'https://github.com/GiovannyLino/TaskMan',
    },
    {
      title: 'Projeto Full Stack',
      description:
        'Projeto fullstack frontend e backend usando frameworks modernos.',
      link: 'https://github.com/GiovannyLino/Projeto-FullStack-FrontEnd-e-BackEnd-',
    },
  ]
};

const Projects = () => {
  const { language } = useLanguage();
  const projects = projectsData[language];

  return (
    <section id="projects">
      <h2 data-number="02.">{language === 'en' ? 'Projects' : 'Projetos'}</h2>
      <div className="project-list">
        {projects.map(({ title, description, link }) => (
          <div className="project-card" key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {language === 'en' ? 'View Project' : 'Ver Projeto'}
            </a>
          </div>
        ))}
      </div>

      {/* Animação abaixo dos projetos */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <DotLottieReact
          src="https://lottie.host/1bfef2aa-3d52-4079-a015-2b10a19ed52b/6dloCXLlQI.lottie"
          loop
          autoplay
          style={{ width: '500px', height: '500px' }}
        />
      </div>
    </section>
  );
};

export default Projects;
