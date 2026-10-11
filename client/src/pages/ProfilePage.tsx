import {useState, type FormEvent} from 'react';
import Icon from '../components/Icon';
import {useNotification} from '../context/NotificationContext';
import {unique} from '../components/Filters';
import {educationLabels, type EducationLevel, type Profile, type Scholarship} from '../types';

function MultiSelect({label, options, value, onChange, hint}: {label: string; options: string[]; value: string[]; onChange: (value: string[]) => void; hint?: string}) {
  return <fieldset className="choice-field"><legend>{label} <span className="required">*</span></legend>{hint && <p className="field-hint">{hint}</p>}<div className="choices">{options.map(option => <label className={`choice ${value.includes(option) ? 'selected' : ''}`} key={option}><input type="checkbox" checked={value.includes(option)} onChange={() => onChange(value.includes(option) ? value.filter(v => v !== option) : [...value,option])}/>{option}</label>)}</div></fieldset>;
}
export default function ProfilePage({profile, scholarships, onSubmit}: {profile: Profile | null; scholarships: Scholarship[]; onSubmit: (profile: Profile) => Promise<void>}) {
  const {notify} = useNotification();
  const [age,setAge] = useState(profile ? String(profile.age) : '');
  const [field,setField] = useState(profile?.currentFieldOfStudy || '');
  const [education,setEducation] = useState<EducationLevel | ''>(profile?.currentEducationLevel || '');
  const [budget,setBudget] = useState(profile ? String(profile.budget) : '');
  const [languages,setLanguages] = useState<string[]>(profile?.languages || []);
  const [countries,setCountries] = useState<string[]>(profile?.preferredCountries || []);
  const [areas,setAreas] = useState<string[]>(profile?.preferredStudyAreas || []);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const fields = unique([...scholarships.flatMap(s => s.eligibleFieldsOfStudy), ...(profile ? [profile.currentFieldOfStudy,...profile.preferredStudyAreas] : []), 'History', 'Law', 'Other']);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    if (!languages.length || !countries.length || !areas.length) {
      setError('Choose at least one language, preferred country and preferred study area.'); notify('A few choices are missing. Pick a language, a country and a study area, then try again.', 'encourage'); return;
    }
    if (!education || !field || age === '' || budget === '') {setError('Please complete all required fields.'); notify('Let’s fill in the required fields together.', 'encourage'); return;}
    setBusy(true);
    notify('Saving your profile. Your next possibilities are on their way!', 'thinking');
    try { await onSubmit({age: Number(age), currentFieldOfStudy: field, currentEducationLevel: education, budget: Number(budget), languages, preferredCountries: countries, preferredStudyAreas: areas}); }
    catch (error) { notify('Your profile could not be saved. Check the message below and try again.', 'encourage'); setError(error instanceof Error ? error.message : 'Could not save your profile. Please try again.'); }
    finally { setBusy(false); }
  }
  return <>
    <div className="page-heading"><div><p className="eyebrow">A LITTLE ABOUT YOU</p><h1>Your story. Your possibilities.</h1><p>Tell us where you are now, and where you’d love to go.</p></div></div>
    <div className="profile-layout"><form onInvalid={() => notify("Check the highlighted field. We’ll get this right together.", 'encourage')} onSubmit={submit} className="profile-form">
      <section className="form-section"><div className="section-heading"><span className="step">01</span><div><h2>The essentials</h2><p>Your current qualifications help us check eligibility.</p></div></div>
        <div className="form-grid">
          <label>Age <span className="required">*</span><input type="number" min="16" max="100" step="1" required value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 22"/><small>Between 16 and 100 years.</small></label>
          <label>Highest completed qualification <span className="required">*</span><select required value={education} onChange={e => setEducation(e.target.value as EducationLevel)}><option value="">Select your qualification</option>{Object.entries(educationLabels).map(([key,label]) => <option value={key} key={key}>{label}</option>)}</select><small>The degree you have already finished.</small></label>
          <label className="full-width">Current field of study <span className="required">*</span><select required value={field} onChange={e => setField(e.target.value)}><option value="">Select your field</option>{fields.map(item => <option key={item}>{item}</option>)}</select></label>
        </div>
        <MultiSelect label="Languages you can use" hint="Select all that apply. Every language required by a scholarship must be met." options={unique(['Arabic', ...scholarships.flatMap(s => s.languageRequirements), ...languages])} value={languages} onChange={setLanguages}/>
      </section>
      <section className="form-section"><div className="section-heading"><span className="step">02</span><div><h2>What feels right for you?</h2><p>Your preferences make the results more personal.</p></div></div>
        <MultiSelect label="Preferred countries" options={unique([...scholarships.map(s => s.country), ...countries])} value={countries} onChange={setCountries}/>
        <MultiSelect label="Preferred study areas" options={fields} value={areas} onChange={setAreas}/>
        <label className="budget-label">Annual study budget (USD) <span className="required">*</span><div className="input-with-prefix"><span>$</span><input type="number" min="0" step="any" required value={budget} onChange={e => setBudget(e.target.value)} placeholder="0"/></div><small>What you can afford each year after scholarship support. Enter 0 if you need full funding.</small></label>
      </section>
      {error && <div className="alert error" role="alert">{error}</div>}
      <div className="form-footer"><p><Icon name="check" size={16}/> You can update your profile anytime.</p><button className="button primary" disabled={busy} type="submit">{busy ? 'Saving your profile…' : profile ? 'Update & see my matches' : 'Save & find my matches'}<Icon name="arrow" size={18}/></button></div>
    </form><aside className="profile-aside"><div className="aside-symbol"><Icon name="spark" size={30}/></div><h2>Not just a list.<br/>A better fit.</h2><p>We look at your qualifications, interests and budget to find opportunities that make sense for you.</p><ol><li><strong>Eligibility first</strong><span>Age, education, field and languages.</span></li><li><strong>Your preferences matter</strong><span>Destination, study area and funding fit.</span></li><li><strong>Every match explained</strong><span>See what fits and what’s still missing.</span></li></ol><div className="aside-note">No account needed. Your profile stays available while this server is running.</div></aside></div>
  </>;
}
