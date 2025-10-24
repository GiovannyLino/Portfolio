import { useLanguage } from '../context/LanguageContext';
import { FaGithub, FaLinkedin, FaEnvelope, FaFilePdf } from 'react-icons/fa';

const Contact = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      heading: "Contact",
      message:
        "I’m currently open to new opportunities. Whether you have a question or just want to say hi, my inbox is always open!",
      button: "Say Hello",
      mailto: "mailto:giovannylino9@gmail.com",
      resumeLabel: "Download Resume",
      resumeLink: "https://drive.google.com/file/d/1U8B835obNvB6Lu35Te9BOWw-spRbo03K/view?usp=sharing",
    },
    pt: {
      heading: "Contato",
      message:
        "Estou aberto a novas oportunidades. Seja para tirar uma dúvida ou apenas dizer oi, minha caixa de entrada está sempre aberta!",
      button: "Diga Olá",
      mailto: "mailto:giovannylino9@gmail.com",
      resumeLabel: "Baixar Currículo",
      resumeLink: "https://drive.google.com/file/d/1U8B835obNvB6Lu35Te9BOWw-spRbo03K/view?usp=sharing",
    },
  };

  const t = language === 'pt' ? texts.pt : texts.en;

  return (
    <section id="contact" style={{ paddingBottom: '450px' }}>
      <h2 data-number="03.">{t.heading}</h2>
      <p>{t.message}</p>
      <a href={t.mailto} className="button">{t.button}</a>

      <div
        className="social-icons"
        style={{ marginTop: '1rem', fontSize: '1.5rem', display: 'flex', gap: '1.5rem' }}
      >
        <a
          href="https://github.com/GiovannyLino"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/giovanny-lino/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a href="mailto:giovannylino9@gmail.com" aria-label="Email">
          <FaEnvelope />
        </a>

        {/* Ícone de currículo padrão */}
        <a
          href={t.resumeLink}
          download="GiovannyLino_Resume.pdf"
          aria-label={t.resumeLabel}
          title={t.resumeLabel}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit' }}
        >
          <FaFilePdf />
        </a>
      </div>
    </section>
  );
};

export default Contact;
