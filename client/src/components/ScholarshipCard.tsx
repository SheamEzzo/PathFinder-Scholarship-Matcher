import Icon from './Icon';
import {dateLabel, educationLabels, fundingLabels, type Scholarship} from '../types';

const codes: Record<string, string> = {Germany:'DE', Canada:'CA', France:'FR', Italy:'IT', Türkiye:'TR', Japan:'JP', 'United Kingdom':'UK'};
export function SaveButton({scholarship, onSave, busy}: {scholarship: Scholarship; onSave: (s: Scholarship) => void; busy: boolean}) {
  return <button className={`save-button ${scholarship.isFavorite ? 'saved' : ''}`} type="button" disabled={busy}
    aria-label={`${scholarship.isFavorite ? 'Remove' : 'Save'} ${scholarship.title}${scholarship.isFavorite ? ' from favorites' : ' to favorites'}`}
    aria-pressed={scholarship.isFavorite} onClick={() => onSave(scholarship)} title={scholarship.isFavorite ? 'Remove from favorites' : 'Save scholarship'}><Icon name="bookmark"/></button>;
}
export default function ScholarshipCard({scholarship: s, onSave, busy}: {scholarship: Scholarship; onSave: (s: Scholarship) => void; busy: boolean}) {
  return <article className="scholarship-card">
    <div className="card-top"><span className={`country-icon country-${codes[s.country]}`}>{codes[s.country] || s.country.slice(0,2)}</span><span className="country-name">{s.country}</span><SaveButton scholarship={s} onSave={onSave} busy={busy}/></div>
    <div className="card-badges"><span className={`badge funding-${s.fundingLevel}`}>{fundingLabels[s.fundingLevel]}</span>{s.deadlineStatus === 'closed' && <span className="badge closed">Closed</span>}{s.rank && <span className="rank-label">#{s.rank}</span>}</div>
    <h3><a href={`#/scholarships/${s.id}`}>{s.title}</a></h3>
    <p className="institution">{s.institution}</p>
    <div className="card-facts"><span><Icon name="graduate" size={17}/>{educationLabels[s.studyLevel]} degree</span><span><Icon name="calendar" size={17}/>{dateLabel(s.applicationDeadline)}</span></div>
    <div className="tags">{s.eligibleFieldsOfStudy.slice(0,2).map(field => <span key={field}>{field}</span>)}{s.eligibleFieldsOfStudy.length > 2 && <span>+{s.eligibleFieldsOfStudy.length - 2}</span>}</div>
    {s.match && <div className={`card-match ${s.match.eligible ? '' : 'not-eligible'}`}>
      <div><span><Icon name="spark" size={15}/> {s.match.matchPercentage}% match</span><small>{s.match.eligibilityStatus}</small></div>
      <div className="progress-track"><span style={{width: `${s.match.matchPercentage}%`}}/></div>
      <p>{s.match.missingRequirements[0] || s.match.unmetPreferences[0] || 'All requirements and preferences met.'}</p>
    </div>}
    <a className="card-link" href={`#/scholarships/${s.id}`}>Explore scholarship <Icon name="arrow" size={17}/></a>
  </article>;
}
