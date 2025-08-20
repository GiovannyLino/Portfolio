import { useLanguage } from '../context/LanguageContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Hero = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      greeting: "Hi, my name is",
      name: "Giovanny Lino Tavares de Oliveira.",
      tagline: "I build things for the web.",
      description:
        "I’m a web developer specializing in building exceptional digital experiences. Currently, I’m focused on building accessible, human-centered products.",
      button: "Get In Touch",
    },
    pt: {
      greeting: "Olá, meu nome é",
      name: "Giovanny Lino Tavares de Oliveira.",
      tagline: "Eu crio coisas para a web.",
      description:
        "Sou um desenvolvedor web especializado em construir experiências digitais excepcionais. Atualmente, estou focado em criar produtos acessíveis e centrados no usuário.",
      button: "Entrar em Contato",
    },
  };

  const t = language === 'pt' ? texts.pt : texts.en;

  return (
    <section id="hero">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <DotLottieReact
          src="https://drive.google.com/file/d/1Pyn5dNLZqQRXuWjM1khnQswktZrMib_l/view?usp=sharing"
          loop
          autoplay
          style={{ width: '300px', height: '300px' }}
        />
      </div>

      <h1>{t.greeting}</h1>
      <h2>{t.name}</h2>
      <h3>{t.tagline}</h3>
      <p>{t.description}</p>
      <a href="#contact" className="button">{t.button}</a>

      
      {/* Animação Lottie abaixo do conteúdo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <DotLottieReact
          src="https://lottie.host/4f32f244-3d51-4d71-8f97-6daf45359cc2/cu5PlngzpP.lottie"
          loop
          autoplay
          style={{ width: '500px', height: '500px' }}
        />
      </div>
    </section>
  );
};

export default Hero;
