import { Link } from "react-router-dom";
import { setScholarshipSaved } from "../api";
import { useNotification } from "../context/NotificationContext";
import { useEffect, useState } from "react";
import { fetchFavorites } from "../api";
import { useAppDispatch } from "../store/hooks";
import {
  setScholarshipFavorite,
  setSavedIds,
} from "../store/savedScholarshipsSlice";
import type { Scholarship } from "../types";
import Icon from "./Icon";
import ScholarshipList from "./ScholarshipList";
import EmptyState from "./EmptyState";
import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";
import PathyGuidance from "./PathyGuidance";
function FavoritesSection() {
  const [savingId, setSavingId] = useState<number | null>(null);
  const { notify, showToast } = useNotification();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  async function loadFavorites(signal?: AbortSignal) {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchFavorites(signal);
      if (signal?.aborted) return;
      setScholarships(data.items);
      dispatch(setSavedIds(data.items.map((scholarship) => scholarship.id)));
      setHasLoaded(true);
    } catch (error) {
      if (!signal?.aborted)
        setError(
          error instanceof Error ? error.message : "Could not load favorites.",
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
      await loadFavorites();
      setSavingId(null);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    loadFavorites(controller.signal);
    return () => controller.abort();
  }, []);
  return (
    <>
      <PathyGuidance
        mood="welcome"
        text={
          scholarships.length
            ? "Your favourites are right here. Ready to take a closer look?"
            : "Your shortlist is a fresh start. Save a scholarship and we’ll keep it here."
        }
        loading={isLoading}
        error={error}
      />
      {error && <ErrorMessage message={error} onRetry={loadFavorites} />}
      {!hasLoaded && isLoading && <LoadingMessage />}
      {hasLoaded && (
        <>
          <div className="page-heading">
            <div>
              <p className="eyebrow">KEEP YOUR POSSIBILITIES CLOSE</p>
              <h1>A little closer to your future.</h1>
              <p>
                Your saved scholarships, all in one place. Pick up where you
                left off.
              </p>
            </div>
            <span className="saved-total">
              <Icon name="bookmark" size={18} />
              {scholarships.length} saved
            </span>
          </div>
          {scholarships.length > 0 ? (
            <ScholarshipList
              scholarships={scholarships}
              loading={isLoading}
              onSave={handleSave}
              busy={savingId !== null || isLoading}
            />
          ) : (
            <EmptyState icon="bookmark" title="Your shortlist is waiting.">
              <p>
                Save an opportunity that catches your eye. It’ll be right here
                when you’re ready.
              </p>
              <Link to="/scholarships" className="button primary">
                Explore scholarships <Icon name="arrow" size={18} />
              </Link>
            </EmptyState>
          )}
        </>
      )}
    </>
  );
}
export default FavoritesSection;
