import {useEffect, useMemo, useRef, useState, type MouseEvent} from 'react';
import Icon from './Icon';
import {educationLabels, fundingLabels, type Filters, type Scholarship} from '../types';

interface FilterWizardProps {
  scholarships: Scholarship[];
  initialFilters: Filters;
  onClose: () => void;
  onComplete: (filters: Filters) => void;
}

interface Question {
  key: keyof Filters;
  title: string;
  prompt: string;
  image: string;
  options: {label: string; value: string}[];
}

export default function FilterWizard({scholarships,initialFilters,onClose,onComplete}: FilterWizardProps) {
  const [step,setStep] = useState(0);
  const [answers,setAnswers] = useState<Filters>(initialFilters);
  const [answered,setAnswered] = useState<boolean[]>([false,false,false,false]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const questions = useMemo<Question[]>(() => [
    {key:'country',title:'Pick a place to begin',prompt:'Where would you like to study?',image:'/images/ali.jpeg',options:[{label:'Anywhere',value:''},...Array.from(new Set(scholarships.map(s => s.country))).sort().map(country => ({label:country,value:country}))]},
    {key:'fieldOfStudy',title:'Follow your curiosity',prompt:'What would you like to study?',image:'/images/fadi.jpeg',options:[{label:'Any field',value:''},...Array.from(new Set(scholarships.flatMap(s => s.eligibleFieldsOfStudy))).sort().map(field => ({label:field,value:field}))]},
    {key:'educationLevel',title:'Choose your next step',prompt:'What qualification are you looking for?',image:'/images/rami.jpeg',options:[{label:'Any qualification',value:''},...Object.entries(educationLabels).map(([value,label]) => ({label,value}))]},
    {key:'fundingLevel',title:'Find the right support',prompt:'What kind of funding would help most?',image:'/images/laith.jpeg',options:[{label:'Any funding type',value:''},...Object.entries(fundingLabels).map(([value,label]) => ({label,value}))]},
  ],[scholarships]);
  const isComplete = step === questions.length;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    window.addEventListener('keydown',handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown',handleKeyDown);
    };
  },[]);

  function chooseAnswer(value: string) {
    const question = questions[step];
    setAnswers(current => ({...current,[question.key]:value}));
    setAnswered(current => current.map((wasAnswered,index) => index === step ? true : wasAnswered));
  }

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onCloseRef.current();
  }

  return <div className="filter-wizard-backdrop" role="presentation" onMouseDown={handleBackdropMouseDown}>
    <section className="filter-wizard" role="dialog" aria-modal="true" aria-labelledby="wizard-title">
      <header className="wizard-header">
        <span className="wizard-brand"><img src="/pathy.jpeg" alt=""/>Pathy</span>
        <span className="wizard-progress-label">{isComplete ? 'READY TO EXPLORE' : `QUESTION ${step + 1} OF ${questions.length}`}</span>
        <button ref={closeButtonRef} className="wizard-close" type="button" aria-label="Close scholarship finder" onClick={onClose}><Icon name="close" size={22}/></button>
      </header>
      <div className="wizard-progress" aria-hidden="true"><span style={{width:`${isComplete ? 100 : (step + 1) / questions.length * 100}%`}}/></div>
      {isComplete
        ? <div className="wizard-content wizard-complete" key="complete">
          <div className="wizard-question wizard-summary">
            <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
            <h1 id="wizard-title">Results are ready!</h1>
          </div>
          <div className="wizard-complete-layout" role="group" aria-label="Your scholarship results are ready">
            <img className="wizard-complete-photo" src="/images/sheam.jpeg" alt="Pathy ready to show your scholarship results"/>
            <div className="wizard-complete-center">
              <p>Your answers are all set. Let’s find scholarships that fit.</p>
              <button type="button" className="button primary wizard-result-button" onClick={() => onComplete(answers)}>See results<Icon name="arrow" size={16}/></button>
            </div>
            <img className="wizard-complete-photo" src="/images/mostafa.jpeg" alt="Pathy celebrating your next opportunity"/>
          </div>
        </div>
        : <div className="wizard-content" key={step}>
          <div className="wizard-photo"><img src={questions[step].image} alt="A Pathy graduation illustration"/><p>A little step toward your next chapter.</p></div>
          <div className="wizard-question">
            <p className="eyebrow">{questions[step].title}</p>
            <h1 id="wizard-title">{questions[step].prompt}</h1>
            <p className="wizard-hint">Choose one answer to keep going. You can change these filters any time.</p>
            <div className="wizard-options" role="group" aria-label={questions[step].prompt}>
              {questions[step].options.map(option => <button type="button" className={`wizard-option ${answers[questions[step].key] === option.value && answered[step] ? 'selected' : ''}`} key={`${option.label}-${option.value}`} aria-pressed={answers[questions[step].key] === option.value && answered[step]} onClick={() => chooseAnswer(option.value)}>{option.label}<Icon name="chevron" size={18}/></button>)}
            </div>
            <div className="wizard-controls">
              <button type="button" className="wizard-back" onClick={() => setStep(current => current - 1)} disabled={step === 0}>Back</button>
              <button type="button" className="button primary" disabled={!answered[step]} onClick={() => setStep(current => current + 1)}>{step < questions.length - 1 ? 'Next question' : 'Finish questions'}<Icon name="arrow" size={18}/></button>
            </div>
          </div>
        </div>}
    </section>
  </div>;
}
