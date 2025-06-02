import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const [activeId, setActiveId] = useState('hero');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = -80; // altura da navbar
      const y = el.getBoundingClientRect().top + window.scrollY + offset;

      const maxScroll = document.body.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: Math.min(y, maxScroll),
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      let current = 'hero';

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPos) {
          current = section.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLabel = sections.find(s => s.id === activeId)?.label || '';

  return (
    <>
      {/* Mobile navbar - apenas nome da seção ativa */}
      <div className="mobile-nav">
        <span>{currentLabel}</span>
      </div>

      {/* Desktop navbar */}
      <nav className="desktop-nav">
        <ul>
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={activeId === id ? 'active' : ''}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeId === id ? '#64ffda' : '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
