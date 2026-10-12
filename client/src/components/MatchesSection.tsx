import { Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setScholarshipFavorite } from "../store/savedScholarshipsSlice";
import { setScholarshipSaved } from "../api";
import { useNotification } from "../context/NotificationContext";
import { useEffect, useState } from "react";
import { fetchProfile, fetchScholarships, fetchMatches } from "../api";
import {
  emptyFilters,
  type Filters as FilterValues,
  type Profile,
  type Scholarship,
  type MatchList,
} from "../types";
import Icon from "./Icon";
import Filters from "./Filters";
import ScholarshipList from "./ScholarshipList";
import EmptyState from "./EmptyState";
import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";
import PathyGuidance from "./PathyGuidance";

function MatchesSection() {
  const [savingId, setSavingId] = useState<number | null>(null);
  const { notify, showToast } = useNotification();
  const dispatch = useAppDispatch();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [filters, setFilters] = useState<FilterValues>({ ...emptyFilters });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<MatchList | null>(null);

  async function loadMatches(signal?: AbortSignal) {
    setIsLoading(true);
    setError("");
    try {
      const all = await fetchScholarships("", signal);
      const student = await fetchProfile(signal);

      const query = new URLSearchParams();
      if (filters.country) query.set("country", filters.country);
      if (filters.fieldOfStudy) query.set("fieldOfStudy", filters.fieldOfStudy);
      if (filters.educationLevel)
        query.set("educationLevel", filters.educationLevel);
      if (filters.fundingLevel) query.set("fundingLevel", filters.fundingLevel);

      let results: MatchList | null = null;
      if (student.profile)
        results = await fetchMatches(query.toString(), signal);

      if (signal?.aborted) return;
      setScholarships(all.items);
      setProfile(student.profile);
      setMatches(results);
      setHasLoaded(true);
    } catch (error) {
      if (!signal?.aborted)
        setError(
          error instanceof Error
            ? error.message
            : "Could not load scholarships.",
        );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }
  async function handleSave(scholarship: Scholarship) {
    if (savingId !== null) return;
    setSavingId(scholarship.id);
    try {
      const result = await setScholarshipSaved(scholarship);
      dispatch(
        setScholarshipFavorite({
          id: scholarship.id,
          saved: result.isFavorite,
        }),
      );
      showToast(result.message);
      notify(
        scholarship.isFavorite
          ? "Removed from your shortlist. Let’s keep exploring!"
          : "Nice find! I’ve saved this scholarship to your shortlist.",
        "success",
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Could not update favorites.",
        true,
      );
      notify(
        "That didn’t go through. Try again; your saved choices are still safe.",
        "encourage",
      );
    } finally {
      await loadMatches();
      setSavingId(null);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    loadMatches(controller.signal);
    return () => controller.abort();
  }, [filters]);

  function handleClearFilters() {
    setFilters({ ...emptyFilters });
    setSearch("");
  }
  const searchText = search.trim().toLowerCase();
  const visibleScholarships = (matches?.items || []).filter((scholarship) => {
    const text = `${scholarship.title} ${scholarship.institution} ${scholarship.country} ${scholarship.eligibleFieldsOfStudy.join(" ")}`;
    return text.toLowerCase().includes(searchText);
  });

  let guidance =
    "First, let’s create your profile so I can help you understand your matches.";
  if (profile) {
    guidance =
      "No full matches yet. That’s not a failure! Check the missing requirements and keep exploring.";
    if (matches?.eligibleCount)
      guidance = `Great news! You meet the requirements for ${matches.eligibleCount} scholarships. Let’s explore why they fit.`;
  }
  return (
    <>
      <PathyGuidance
        mood={matches?.eligibleCount ? "success" : "encourage"}
        text={guidance}
        loading={isLoading}
        error={error}
      />

      {error && <ErrorMessage message={error} onRetry={loadMatches} />}
      {!hasLoaded && isLoading && <LoadingMessage />}
      {hasLoaded && (
        <>
          <div className="page-heading">
            <div>
              <p className="eyebrow">OPPORTUNITIES, WITH YOU IN MIND</p>
              <h1>Your possibilities, ranked.</h1>
              <p>More than a percentage. See what fits, and understand why.</p>
            </div>
            <Link className="button secondary" to="/profile">
              <Icon name="user" size={17} />
              Edit my profile
            </Link>
          </div>
          {matches && (
            <div className="match-stats">
              <div>
                <strong>{matches.totalOpen}</strong>
                <span>open opportunities</span>
              </div>
              <div>
                <strong>{matches.eligibleCount}</strong>
                <span>eligible scholarships</span>
              </div>
              <div>
                <strong>
                  {matches.items[0]?.match?.matchPercentage ?? 0}%
                </strong>
                <span>best match in this view</span>
              </div>
              <p>
                <Icon name="check" size={19} /> Eligibility first.
                <br />
                Your preferences next.
              </p>
            </div>
          )}
          {!profile && (
            <EmptyState icon="spark" title="Your best matches start with you.">
              <p>
                Add your qualifications, interests and budget to discover which
                scholarships fit.
              </p>
              <Link to="/profile" className="button primary">
                Create my profile <Icon name="arrow" size={18} />
              </Link>
            </EmptyState>
          )}
          {profile && (
            <>
              <div className="list-heading">
                <h2>Your scholarship matches</h2>
                <span>
                  {visibleScholarships.length}{" "}
                  {visibleScholarships.length === 1
                    ? "scholarship"
                    : "scholarships"}
                  {isLoading ? " · Updating…" : ""}
                </span>
              </div>
              <Filters
                value={filters}
                onChange={setFilters}
                scholarships={scholarships}
                search={search}
                onSearch={setSearch}
              />

              <p className="ranking-note">
                Ranked by eligibility, then match percentage. Earlier deadlines
                break ties. Filters keep the original ranks.
              </p>
              {matches?.eligibleCount === 0 && (
                <div className="alert warning">
                  {matches.message} You can still explore each result to see
                  what’s missing.
                </div>
              )}

              {visibleScholarships.length > 0 ? (
                <ScholarshipList
                  scholarships={visibleScholarships}
                  loading={isLoading}
                  onSave={handleSave}
                  busy={savingId !== null || isLoading}
                />
              ) : (
                <EmptyState
                  icon="search"
                  title="No scholarships match these filters."
                >
                  <p>
                    Try a different destination, study area or funding type to
                    explore more possibilities.
                  </p>
                  <button
                    className="button secondary"
                    onClick={handleClearFilters}
                  >
                    Clear all filters
                  </button>
                </EmptyState>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
export default MatchesSection;
