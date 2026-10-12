import { Link } from "react-router-dom";
import type { RefObject } from "react";
import Icon from "./Icon";
import type { Profile, Scholarship } from "../types";
function ScholarshipsHero({
  scholarships,
  profile,
  onHelpChoose,
  helpButtonRef,
}: {
  scholarships: Scholarship[];
  profile: Profile | null;
  onHelpChoose: () => void;
  helpButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const countriesCount = new Set(
    scholarships.map((scholarship) => scholarship.country),
  ).size;
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">YOUR COMPASS TO WHAT’S NEXT</span>
          <h1>
            Your next chapter
            <br />
            starts <em>here.</em>
          </h1>
          <p>
            Discover scholarships that fit your ambitions.
            <br className="desktop-break" /> A world of opportunity, made a
            little simpler.
          </p>
          <div className="hero-actions">
          <Link to="/profile" className="button primary">
            {profile ? "Refine my matches" : "Find my matches"}
            <Icon name="arrow" size={18} />
          </Link>
          <button ref={helpButtonRef} type="button" className="button secondary" onClick={onHelpChoose}>
            <Icon name="spark" size={18} /> Help me choose
          </button>
          </div>
        </div>
        <div className="pathy-hero-art">
          <img
            src="/pathy.jpeg"
            alt="Pathy wearing a graduation cap and holding a diploma"
          />
          <span>Meet Pathy. Your next chapter starts with a hello.</span>
        </div>
      </section>
      <div className="overview-stats">
        <div>
          <span className="stat-icon">
            <Icon name="graduate" />
          </span>
          <strong>{scholarships.length}</strong>
          <span>scholarships to explore</span>
        </div>
        <div>
          <span className="stat-icon">
            <Icon name="globe" />
          </span>
          <strong>{countriesCount}</strong>
          <span>countries, endless potential</span>
        </div>
        <div>
          <span className="stat-icon peach">
            <Icon name="spark" />
          </span>
          <strong>Your fit.</strong>
          <span>Clearly explained.</span>
        </div>
      </div>
    </>
  );
}
export default ScholarshipsHero;
