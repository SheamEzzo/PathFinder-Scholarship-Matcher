import {useEffect, useMemo, useRef, useState} from 'react';
import EmptyState from './components/EmptyState';
import Icon, {type IconName} from './components/Icon.tsx';
import FilterWizard from './components/FilterWizard';
import GraduationHat from './components/GraduationHat';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {useNotification} from './context/NotificationContext.tsx';
import ScholarshipCard from './components/ScholarshipCard';
import FilterPanel from './components/Filters';
import ProfilePage from './pages/ProfilePage';
import DetailsPage from './pages/DetailsPage';
import {emptyFilters, type Condition, type Filters, type Match, type MatchList, type Profile, type Scholarship, type ScholarshipList} from './types';

type Screen = 'scholarships' | 'profile' | 'matches' | 'favorites' | 'detail' | 'not-found';
const navigation: {id: Screen; label: string; icon: IconName}[] = [
  {id:'scholarships',label:'Discover scholarships',icon:'grid'}, {id:'profile',label:'My profile',icon:'user'},
  {id:'matches',label:'My matches',icon:'spark'}, {id:'favorites',label:'Saved scholarships',icon:'bookmark'},
];
interface Snapshot {all: Scholarship[]; catalog: ScholarshipList; profile: Profile | null; favorites: ScholarshipList; matches: MatchList | null; detail: Scholarship | null; detailError: string | null}
function currentRoute() {return window.location.hash.replace(/^#/, '') || '/scholarships';}

const demoScholarships: Scholarship[] = [
  {id:1,title:'Global Scholars Award',country:'Germany',institution:'Berlin Institute of Technology',eligibleFieldsOfStudy:['Engineering','Computer Science','Mathematics'],studyLevel:'master',requiredEducationLevel:'bachelor',languageRequirements:['English'],ageRestriction:{max:35},fundingLevel:'fully_funded',estimatedAnnualCost:0,applicationDeadline:'2026-12-01',description:'Support for curious minds pursuing advanced study in science, technology and engineering. The award includes tuition and a living stipend.',deadlineStatus:'open',isFavorite:false,match:null},
  {id:2,title:'Maple Leaf International Scholarship',country:'Canada',institution:'University of Toronto',eligibleFieldsOfStudy:['Computer Science','Business','Engineering'],studyLevel:'bachelor',requiredEducationLevel:'high_school',languageRequirements:['English'],ageRestriction:null,fundingLevel:'partially_funded',estimatedAnnualCost:12000,applicationDeadline:'2027-02-15',description:'An entrance award recognizing international students with a strong academic record and a clear sense of purpose.',deadlineStatus:'open',isFavorite:false,match:null},
  {id:3,title:'Étoile Graduate Fellowship',country:'France',institution:'Université de Lyon',eligibleFieldsOfStudy:['Arts','History','Social Sciences'],studyLevel:'master',requiredEducationLevel:'bachelor',languageRequirements:['French'],ageRestriction:null,fundingLevel:'tuition_only',estimatedAnnualCost:4500,applicationDeadline:'2027-01-20',description:'A tuition fellowship for graduate students bringing fresh perspectives to the humanities and social sciences.',deadlineStatus:'open',isFavorite:false,match:null},
  {id:4,title:'Future Leaders Scholarship',country:'United Kingdom',institution:'University of Edinburgh',eligibleFieldsOfStudy:['Business','Law','Social Sciences'],studyLevel:'master',requiredEducationLevel:'bachelor',languageRequirements:['English'],ageRestriction:{min:18,max:30},fundingLevel:'partially_funded',estimatedAnnualCost:9000,applicationDeadline:'2026-11-30',description:'Helping emerging leaders build practical skills and make a positive impact in their communities.',deadlineStatus:'open',isFavorite:false,match:null},
  {id:5,title:'Rising Researchers Grant',country:'Japan',institution:'Kyoto International University',eligibleFieldsOfStudy:['Biology','Engineering','Mathematics'],studyLevel:'phd',requiredEducationLevel:'master',languageRequirements:['English'],ageRestriction:null,fundingLevel:'fully_funded',estimatedAnnualCost:0,applicationDeadline:'2027-03-10',description:'Research funding for doctoral candidates working across disciplines to tackle global challenges.',deadlineStatus:'open',isFavorite:false,match:null},
  {id:6,title:'Mediterranean Exchange Bursary',country:'Italy',institution:'University of Bologna',eligibleFieldsOfStudy:['Arts','History','Business'],studyLevel:'bachelor',requiredEducationLevel:'high_school',languageRequirements:['English'],ageRestriction:null,fundingLevel:'tuition_only',estimatedAnnualCost:3500,applicationDeadline:'2026-04-30',description:'A teaching example of a student exchange bursary. This opportunity has closed for the current cycle.',deadlineStatus:'closed',isFavorite:false,match:null},
];

const educationOrder = ['high_school','bachelor','master','phd'];
const profileStorageKey = 'pathy-demo-profile';
const favoritesStorageKey = 'pathy-demo-favorites';

function readStored<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch (error) {
    console.warn(`Could not read local demo data (${key}).`, error);
    return fallback;
  }
}

function getMatch(scholarship: Scholarship, profile: Profile): Match {
  const requirements: Condition[] = [
    {key:'education',met:educationOrder.indexOf(profile.currentEducationLevel) >= educationOrder.indexOf(scholarship.requiredEducationLevel),message:`Completed ${scholarship.requiredEducationLevel.replace('_',' ')} qualification`},
    {key:'field',met:scholarship.eligibleFieldsOfStudy.includes(profile.currentFieldOfStudy),message:`Field of study: ${scholarship.eligibleFieldsOfStudy.join(', ')}`},
    {key:'language',met:scholarship.languageRequirements.every(language => profile.languages.includes(language)),message:`Language: ${scholarship.languageRequirements.join(', ')}`},
    {key:'age',met:!scholarship.ageRestriction || (scholarship.ageRestriction.min === undefined || profile.age >= scholarship.ageRestriction.min) && (scholarship.ageRestriction.max === undefined || profile.age <= scholarship.ageRestriction.max),message:scholarship.ageRestriction ? `Age ${scholarship.ageRestriction.min ? `at least ${scholarship.ageRestriction.min}` : ''}${scholarship.ageRestriction.min && scholarship.ageRestriction.max ? ' and ' : ''}${scholarship.ageRestriction.max ? `up to ${scholarship.ageRestriction.max}` : ''}` : 'No age restriction'},
  ];
  const preferences: Condition[] = [
    {key:'country',met:profile.preferredCountries.includes(scholarship.country),message:`Preferred destination: ${scholarship.country}`},
    {key:'study-area',met:profile.preferredStudyAreas.some(area => scholarship.eligibleFieldsOfStudy.includes(area)),message:`Preferred study area: ${scholarship.eligibleFieldsOfStudy.join(', ')}`},
    {key:'budget',met:profile.budget >= scholarship.estimatedAnnualCost || scholarship.fundingLevel === 'fully_funded',message:`Annual cost within your $${profile.budget.toLocaleString()} budget`},
  ];
  const eligible = requirements.every(condition => condition.met);
  const eligibilityPoints = Math.round(requirements.filter(condition => condition.met).length / requirements.length * 60);
  const preferencePoints = Math.round(preferences.filter(condition => condition.met).length / preferences.length * 40);
  const percentage = eligibilityPoints + preferencePoints;
  const missingRequirements = requirements.filter(condition => !condition.met).map(condition => condition.message);
  const unmetPreferences = preferences.filter(condition => !condition.met).map(condition => condition.message);
  return {
    matchPercentage:eligible ? percentage : Math.min(49,percentage),
    eligible,
    eligibilityStatus:eligible ? 'Eligible' : 'Not eligible',
    matchingReasons:[...requirements,...preferences].filter(condition => condition.met).map(condition => condition.message),
    missingRequirements,
    unmetPreferences,
    requirements,
    preferences,
    scoreBreakdown:{eligibilityPoints,preferencePoints,ineligibleCap:eligible ? null : 49},
  };
}

function matchesFilters(scholarship: Scholarship, filters: Filters) {
  return (!filters.country || scholarship.country === filters.country)
    && (!filters.fieldOfStudy || scholarship.eligibleFieldsOfStudy.includes(filters.fieldOfStudy))
    && (!filters.educationLevel || scholarship.requiredEducationLevel === filters.educationLevel)
    && (!filters.fundingLevel || scholarship.fundingLevel === filters.fundingLevel);
}

export default function App() {
  const [route,setRoute] = useState(currentRoute);
  const [filters,setFilters] = useState<Filters>({...emptyFilters});
  const [search,setSearch] = useState('');
  const [wizardOpen,setWizardOpen] = useState(false);
  const [graduationHatVisible,setGraduationHatVisible] = useState(true);
  const [profile,setProfile] = useState<Profile | null>(() => readStored<Profile | null>(profileStorageKey,null));
  const [savedIds,setSavedIds] = useState<number[]>(() => readStored<number[]>(favoritesStorageKey,[]));
  const [notification,setNotification] = useState<{message: string; error?: boolean} | null>(null);
  const [savingId,setSavingId] = useState<number | null>(null);
  const mutationPending = useRef(false);
  const wizardTriggerRef = useRef<HTMLButtonElement>(null);
  const {notify, clear} = useNotification();
  const headingRef = useRef<HTMLElement>(null);
  const detailId = /^\/scholarships\/([^/]+)$/.exec(route)?.[1];
  const screen: Screen = detailId ? 'detail' : navigation.some(n => route === `/${n.id}`) ? route.slice(1) as Screen : 'not-found';
  const data = useMemo<Snapshot>(() => {
    const all = demoScholarships.map(scholarship => ({
      ...scholarship,
      isFavorite:savedIds.includes(scholarship.id),
      match:profile ? getMatch(scholarship,profile) : null,
    }));
    const catalogItems = all.filter(scholarship => matchesFilters(scholarship,filters));
    const favoriteItems = all.filter(scholarship => scholarship.isFavorite);
    const rankedMatches = profile ? all
      .filter(scholarship => scholarship.deadlineStatus === 'open')
      .sort((a,b) => Number(b.match?.eligible) - Number(a.match?.eligible)
        || (b.match?.matchPercentage ?? 0) - (a.match?.matchPercentage ?? 0)
        || a.applicationDeadline.localeCompare(b.applicationDeadline))
      .map((scholarship,index) => ({...scholarship,rank:index + 1})) : [];
    const matchItems = rankedMatches.filter(scholarship => matchesFilters(scholarship,filters));
    const eligibleCount = rankedMatches.filter(scholarship => scholarship.match?.eligible).length;
    const toList = (items: Scholarship[]): ScholarshipList => ({items,total:items.length,message:null});
    return {
      all,
      catalog:toList(catalogItems),
      profile,
      favorites:toList(favoriteItems),
      matches:profile ? {
        ...toList(matchItems),
        totalOpen:rankedMatches.length,
        eligibleCount,
        filteredEligibleCount:matchItems.filter(scholarship => scholarship.match?.eligible).length,
        filterMessage:null,
        message:eligibleCount ? null : 'No scholarships fully match yet.',
      } : null,
      detail:detailId ? all.find(scholarship => String(scholarship.id) === detailId) || null : null,
      detailError:detailId && !all.some(scholarship => String(scholarship.id) === detailId) ? 'This scholarship is not available in the demo catalogue.' : null,
    };
  },[profile,savedIds,filters,detailId]);

  useEffect(() => {
    const onHash = () => {setRoute(currentRoute()); clear(); setNotification(null); setSearch(''); setFilters({...emptyFilters}); window.scrollTo({top: 0});};
    window.addEventListener('hashchange',onHash);
    return () => window.removeEventListener('hashchange',onHash);
  },[]);
  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => setNotification(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  useEffect(() => {document.title = `${screen === 'detail' ? 'Scholarship details' : navigation.find(n => n.id === screen)?.label || 'Page not found'} · Pathy`; headingRef.current?.focus({preventScroll:true});},[route, screen]);

  async function toggleFavorite(scholarship: Scholarship) {
    if (mutationPending.current) return;
    mutationPending.current = true; setSavingId(scholarship.id);
    try {
      const next = scholarship.isFavorite ? savedIds.filter(id => id !== scholarship.id) : [...savedIds,scholarship.id];
      localStorage.setItem(favoritesStorageKey,JSON.stringify(next));
      setSavedIds(next);
      setNotification({message:scholarship.isFavorite ? 'Removed from your shortlist.' : 'Scholarship saved to your shortlist.'});
      notify(scholarship.isFavorite ? 'Removed from your shortlist. Let’s keep exploring!' : 'Nice find! I’ve saved this scholarship to your shortlist.', 'success');
    } catch (error) {setNotification({message:error instanceof Error ? `Could not save favorites locally: ${error.message}` : 'Could not update favorites.', error:true}); notify('That didn’t go through. Try again; your saved choices are still safe.', 'encourage');}
    finally {mutationPending.current = false; setSavingId(null);}
  }
  async function saveProfile(profile: Profile) {
    localStorage.setItem(profileStorageKey,JSON.stringify(profile));
    setProfile(profile);
    setNotification({message:'Your profile is saved in this browser. Your matches are up to date.'});
    setFilters({...emptyFilters}); setSearch(''); window.location.hash = '/matches';
  }
  let items: Scholarship[] = screen === 'favorites' ? data.favorites.items : screen === 'matches' ? data.matches?.items || [] : data.catalog.items;
  if (search.trim()) {const q = search.trim().toLowerCase(); items = items.filter(s => `${s.title} ${s.institution} ${s.country} ${s.eligibleFieldsOfStudy.join(' ')}`.toLowerCase().includes(q));}
  const countriesCount = new Set(data.all.map(s => s.country)).size;
  function openFilterWizard() {
    setWizardOpen(true);
  }

  function closeFilterWizard() {
    setWizardOpen(false);
    window.setTimeout(() => wizardTriggerRef.current?.focus(),0);
  }

  function finishFilterWizard(nextFilters: Filters) {
    setFilters(nextFilters);
    setSearch('');
    setWizardOpen(false);
    window.setTimeout(() => {
      const filtersPanel = document.querySelector('.filters-panel');
      filtersPanel?.querySelector<HTMLSelectElement>('select')?.focus({preventScroll:true});
      filtersPanel?.scrollIntoView({behavior:'smooth',block:'center'});
    },0);
  }

  return <div className="app-shell">
    <a href="#main-content" className="skip-link" onClick={e => {e.preventDefault(); headingRef.current?.focus();}}>Skip to content</a>
    <Navbar screen={screen} savedCount={data.favorites.total} onNavigate={clear}/>
    <div className="workspace">
      <main id="main-content" tabIndex={-1} ref={headingRef}>
        {graduationHatVisible && <GraduationHat/>}
        {notification && <div className={`toast ${notification.error ? 'error' : ''}`} role={notification.error ? 'alert' : 'status'}><Icon name={notification.error ? 'close' : 'check'} size={19}/><span>{notification.message}</span><button className="icon-button" aria-label="Dismiss notification" onClick={() => setNotification(null)}><Icon name="close" size={17}/></button></div>}
        <>
          {screen === 'scholarships' && <><section className="hero">          <div className="hero-copy"><span className="eyebrow">YOUR COMPASS TO WHAT’S NEXT</span><h1>Your next chapter<br/>starts <em>here.</em></h1><p>Discover scholarships that fit your ambitions.<br className="desktop-break"/> A world of opportunity, made a little simpler.</p><div className="hero-actions"><a href="#/profile" className="button primary">{data.profile ? 'Refine my matches' : 'Find my matches'}<Icon name="arrow" size={18}/></a><button ref={wizardTriggerRef} type="button" className="button secondary" onClick={openFilterWizard}><Icon name="spark" size={18}/>Help me choose</button></div></div><div className="pathy-hero-art"><img src="/pathy.jpeg" alt="Pathy wearing a graduation cap and holding a diploma"/><span>Meet Pathy. Your next chapter starts with a hello.</span></div></section><div className="overview-stats"><div><span className="stat-icon"><Icon name="graduate"/></span><strong>{data.all.length}</strong><span>scholarships to explore</span></div><div><span className="stat-icon"><Icon name="globe"/></span><strong>{countriesCount}</strong><span>countries, endless potential</span></div><div><span className="stat-icon peach"><Icon name="spark"/></span><strong>Your fit.</strong><span>Clearly explained.</span></div></div></>}
          {screen === 'matches' && <><div className="page-heading"><div><p className="eyebrow">OPPORTUNITIES, WITH YOU IN MIND</p><h1>Your possibilities, ranked.</h1><p>More than a percentage. See what fits, and understand why.</p></div><a className="button secondary" href="#/profile"><Icon name="user" size={17}/>Edit my profile</a></div>{data.matches && <div className="match-stats"><div><strong>{data.matches.totalOpen}</strong><span>open opportunities</span></div><div><strong>{data.matches.eligibleCount}</strong><span>eligible scholarships</span></div><div><strong>{data.matches.items[0]?.match?.matchPercentage ?? 0}%</strong><span>best match in this view</span></div><p><Icon name="check" size={19}/> Eligibility first.<br/>Your preferences next.</p></div>}</>}
          {screen === 'favorites' && <div className="page-heading"><div><p className="eyebrow">KEEP YOUR POSSIBILITIES CLOSE</p><h1>A little closer to your future.</h1><p>Your saved scholarships, all in one place. Pick up where you left off.</p></div><span className="saved-total"><Icon name="bookmark" size={18}/>{data.favorites.total} saved</span></div>}
          {(screen === 'scholarships' || screen === 'matches' && data.profile) && <><div className="list-heading"><h2>{screen === 'matches' ? 'Your scholarship matches' : 'Explore opportunities'}</h2><span>{items.length} {items.length === 1 ? 'scholarship' : 'scholarships'}</span></div><FilterPanel value={filters} onChange={setFilters} scholarships={data.all} search={search} onSearch={setSearch}/>{screen === 'matches' && <p className="ranking-note">Ranked by eligibility, then match percentage. Earlier deadlines break ties. Filters keep the original ranks.</p>}</>}
          {screen === 'matches' && !data.profile && <EmptyState icon="spark" title="Your best matches start with you."><p>Add your qualifications, interests and budget to discover which scholarships fit.</p><a href="#/profile" className="button primary">Create my profile <Icon name="arrow" size={18}/></a></EmptyState>}
          {screen === 'matches' && data.matches?.eligibleCount === 0 && <div className="alert warning">{data.matches.message} You can still explore each result to see what’s missing.</div>}
          {(screen === 'scholarships' || screen === 'favorites' || screen === 'matches' && data.profile) && <div className="results">{items.length ? <div className="scholarship-grid">{items.map(s => <ScholarshipCard key={s.id} scholarship={s} onSave={toggleFavorite} busy={savingId !== null}/>)}</div> : <EmptyState icon={screen === 'favorites' ? 'bookmark' : 'search'} title={screen === 'favorites' ? 'Your shortlist is waiting.' : 'No scholarships match these filters.'}><p>{screen === 'favorites' ? 'Save an opportunity that catches your eye. It’ll be right here when you’re ready.' : 'Try a different destination, study area or funding type to explore more possibilities.'}</p>{screen === 'favorites' ? <a href="#/scholarships" className="button primary">Explore scholarships <Icon name="arrow" size={18}/></a> : <button className="button secondary" onClick={() => {setFilters({...emptyFilters}); setSearch('');}}>Clear all filters</button>}</EmptyState>}</div>}
          {screen === 'profile' && <ProfilePage key={JSON.stringify(data.profile)} profile={data.profile} scholarships={data.all} onSubmit={saveProfile}/>}
          {screen === 'detail' && (data.detail ? <DetailsPage scholarship={data.detail} onSave={toggleFavorite} busy={savingId !== null}/> : <EmptyState title="Scholarship not found"><p>{data.detailError || 'This scholarship is not available.'}</p><a className="button primary" href="#/scholarships">Back to scholarships</a></EmptyState>)}
          {screen === 'not-found' && <EmptyState title="This path doesn’t lead anywhere."><p>The page you’re looking for doesn’t exist.</p><a href="#/scholarships" className="button primary">Back to scholarships</a></EmptyState>}
        </>
        <Footer/>
      </main>
    </div>
    {wizardOpen && <FilterWizard
      scholarships={data.all}
      initialFilters={filters}
      onClose={closeFilterWizard}
      onComplete={finishFilterWizard}
    />}
    <button
      className="hat-visibility-toggle"
      type="button"
      aria-pressed={graduationHatVisible}
      onClick={() => setGraduationHatVisible(visible => !visible)}
      aria-label={graduationHatVisible ? 'Hide graduation hat' : 'Show graduation hat'}
      title={graduationHatVisible ? 'Hide graduation hat' : 'Show graduation hat'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c4 3 8 3 12 0v-5M22 9v8"/></svg>
      <span>{graduationHatVisible ? 'Hide hat' : 'Show hat'}</span>
    </button>
  </div>;
}
