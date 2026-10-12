import {useEffect, useRef, useState} from 'react';

export default function GraduationHat() {
  const [position,setPosition] = useState({left:18,top:18});
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    const handleSectionEvent = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest('section, article, .overview-stats, .list-heading, .page-heading');
      if (!section || section === targetRef.current || !main.contains(section)) return;
      targetRef.current = section;
      const sectionRect = section.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();
      setPosition({
        left:sectionRect.left - mainRect.left + main.scrollLeft - 32,
        top:sectionRect.top - mainRect.top + main.scrollTop - 28,
      });
    };
    main.addEventListener('mouseover',handleSectionEvent);
    main.addEventListener('focusin',handleSectionEvent);
    return () => {
      main.removeEventListener('mouseover',handleSectionEvent);
      main.removeEventListener('focusin',handleSectionEvent);
    };
  },[]);

  return <div className="moving-grad-hat" style={{left:position.left,top:position.top}} aria-hidden="true">
    <svg viewBox="0 0 100 72" focusable="false">
      <path className="hat-top" d="M50 4 96 26 50 48 4 26 50 4Z"/>
      <path className="hat-base" d="M20 34v18c18 13 42 13 60 0V34L50 48 20 34Z"/>
      <path className="hat-tassel" d="M96 26v28"/>
      <circle className="hat-tassel-end" cx="96" cy="58" r="4"/>
    </svg>
  </div>;
}
