import {useState} from 'react';
import Icon from './Icon';

const links = [
  {id: 'scholarships', label: 'Discover scholarships'},
  {id: 'profile', label: 'My profile'},
  {id: 'matches', label: 'My matches'},
  {id: 'favorites', label: 'Saved scholarships'},
];

export default function Navbar({screen, savedCount, onNavigate}: {
  screen: string;
  savedCount: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  function navigate() {
    setOpen(false);
    onNavigate();
  }

  return <header className="navbar">
    <a className="navbar-brand" href="#/scholarships" onClick={navigate} aria-label="Pathy home">
      <span className="navbar-logo"><img src="/pathy.jpeg" alt=""/></span>
      <span>Pathy<span className="brand-dot">.</span></span>
    </a>
    <span className="navbar-tagline">A little guidance. A world of possibility.</span>
    <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'}/></button>
    <nav id="main-nav" className={`navbar-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
      {links.map(link => <a key={link.id} href={`#/${link.id}`} onClick={navigate}
        className={`nav-link ${screen === link.id || screen === 'detail' && link.id === 'scholarships' ? 'nav-link-active' : ''}`}
        aria-current={screen === link.id ? 'page' : undefined}>
        {link.label}{link.id === 'favorites' && <span className="saved-count-badge">{savedCount}</span>}
      </a>)}
    </nav>
  </header>;
}
