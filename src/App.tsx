import BackgroundEffect from "./components/BackgroundEffect";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import { useLanguage } from "./context/LanguageContext";
import Navbar from './components/Navbar';

function App() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="App">
       <Navbar />
      <button 
        onClick={toggleLanguage} 
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: '8px 16px',
          cursor: 'pointer',
          zIndex: 1100,
        }}
      >
        {language === 'en' ? 'Português' : 'English'}
      </button>

      <BackgroundEffect />
      <main style={{ paddingTop: '60px' }}> {/* <-- Adicione padding top para não esconder conteúdo */}
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}

export default App;
