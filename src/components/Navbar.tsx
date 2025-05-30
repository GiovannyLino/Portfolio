import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 80;
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

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: '#0a192f',
        padding: '1rem 2rem',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        // Centralizar conteúdo horizontalmente
        display: 'flex',
        justifyContent: 'center',  // centro horizontal
      }}
    >
      <ul
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          margin: 0,
          padding: 0,
          listStyle: 'none',
          color: '#fff',
          fontWeight: 'bold',
        }}
      >
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={activeId === id ? 'active' : ''}
              style={{
                color: activeId === id ? '#64ffda' : '#fff',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
