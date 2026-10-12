import { useAppDispatch } from "../store/hooks";
import { setScholarshipFavorite } from "../store/savedScholarshipsSlice";
import { setScholarshipSaved } from "../api";
import { useNotification } from "../context/NotificationContext";
import { useEffect, useRef, useState } from "react";
import { fetchProfile, fetchScholarships } from "../api";
import {
  emptyFilters,
  type Filters as FilterValues,
  type Profile,
  type Scholarship,
} from "../types";
import ScholarshipsHero from "./ScholarshipsHero";
import FilterWizard from "./FilterWizard";
import Filters from "./Filters";
import ScholarshipList from "./ScholarshipList";
import EmptyState from "./EmptyState";
import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";
import PathyGuidance from "./PathyGuidance";

function ScholarshipsSection() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  function closeWizard() {
    setWizardOpen(false);
    helpButtonRef.current?.focus();
  }
  function finishWizard(nextFilters: FilterValues) {
    setFilters(nextFilters);
    setSearch("");
    setWizardOpen(false);
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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
  const [filteredScholarships, setFilteredScholarships] = useState<
    Scholarship[]
  >([]);

  async function loadScholarships(signal?: AbortSignal) {
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
      const filtered = await fetchScholarships(query.toString(), signal);

      if (signal?.aborted) return;
      setScholarships(all.items);
      setProfile(student.profile);
      setFilteredScholarships(filtered.items);
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
      await loadScholarships();
      setSavingId(null);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    loadScholarships(controller.signal);
    return () => controller.abort();
  }, [filters]);

  function handleClearFilters() {
    setFilters({ ...emptyFilters });
    setSearch("");
  }
  const searchText = search.trim().toLowerCase();
  const visibleScholarships = filteredScholarships.filter((scholarship) => {
    const text = `${scholarship.title} ${scholarship.institution} ${scholarship.country} ${scholarship.eligibleFieldsOfStudy.join(" ")}`;
    return text.toLowerCase().includes(searchText);
  });
  return (
    <>
      <PathyGuidance
        mood="welcome"
        text="Hi, I’m Pathy! Let’s find a scholarship that feels right for you."
        loading={isLoading}
        error={error}
      />

      {error && <ErrorMessage message={error} onRetry={loadScholarships} />}
      {!hasLoaded && isLoading && <LoadingMessage />}
      {hasLoaded && (
        <>
          <ScholarshipsHero scholarships={scholarships} profile={profile} onHelpChoose={() => setWizardOpen(true)} helpButtonRef={helpButtonRef} />
          <div className="list-heading" ref={resultsRef} tabIndex={-1}>
            <h2>Explore opportunities</h2>
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
              <button className="button secondary" onClick={handleClearFilters}>
                Clear all filters
              </button>
            </EmptyState>
          )}
        </>
      )}
      {wizardOpen && <FilterWizard scholarships={scholarships} initialFilters={filters} onClose={closeWizard} onComplete={finishWizard} />}
    </>
  );
}
export default ScholarshipsSection;
