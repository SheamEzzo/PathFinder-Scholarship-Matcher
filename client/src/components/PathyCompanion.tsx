import {useState} from 'react';
import {useNotification, type PathyMessage} from '../context/NotificationContext';

export default function PathyCompanion({guidance}: {guidance: PathyMessage}) {
  const {message, notify, clear} = useNotification();
  const [quiet, setQuiet] = useState(false);
  const current = message || guidance;

  function greet() {
    setQuiet(false);
    clear();
  }

  return <section className={`pathy-companion mood-${current.mood} ${quiet ? 'pathy-quiet' : ''}`} aria-label="Pathy guide">
    <button className="pathy-character" onClick={greet} aria-label="Say hello to Pathy" title="Say hello to Pathy">
      <img src="/pathy.jpeg" alt="Pathy, your friendly scholarship compass"/>
      <span className="pathy-mood" aria-hidden="true">{current.mood === 'success' ? '★' : current.mood === 'thinking' ? '…' : current.mood === 'encourage' ? '♡' : '✦'}</span>
    </button>
    {!quiet && <div className="pathy-bubble">
      <div className="pathy-label">YOUR STUDY BUDDY <strong>Pathy</strong></div>
      <p aria-live="polite" aria-atomic="true">{current.text}</p>
      <div className="pathy-actions">
        <button onClick={() => notify('See you soon! Your next chapter will be here when you return.', 'goodbye')}>Say goodbye</button>
        <button onClick={() => setQuiet(true)} aria-label="Quiet Pathy">Quiet mode</button>
      </div>
    </div>}
    {quiet && <p className="pathy-quiet-label">I’m here when you need me. Tap to say hello.</p>}
  </section>;
}
