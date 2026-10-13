import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiError, fetchScholarshipById, setScholarshipSaved } from "../api";
import {
  useNotification,
  type PathyMessage,
} from "../context/NotificationContext";
import { useAppDispatch } from "../store/hooks";
import { setScholarshipFavorite } from "../store/savedScholarshipsSlice";
import type { Scholarship } from "../types";
import ScholarshipDetails from "./ScholarshipDetails";
import EmptyState from "./EmptyState";
import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";
import PathyGuidance from "./PathyGuidance";
function ScholarshipDetailSection() {
  const { id = "" } = useParams();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState("");
  const { notify, showToast } = useNotification();
  const dispatch = useAppDispatch();
  async function loadScholarship(signal?: AbortSignal) {
    setIsLoading(true);
    setError("");
    setNotFound("");
    try {
      const data = await fetchScholarshipById(id, signal);
      if (!signal?.aborted) setScholarship(data);
    } catch (error) {
      if (signal?.aborted) return;
      if (
        error instanceof ApiError &&
        (error.status === 404 || error.status === 400)
      ) {
        setScholarship(null);
        setNotFound(error.message);
      } else
        setError(
          error instanceof Error
            ? error.message
            : "Could not load scholarship details.",
        );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    setScholarship(null);
    loadScholarship(controller.signal);
    return () => controller.abort();
  }, [id]);
  async function handleSave(selected: Scholarship) {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const result = await setScholarshipSaved(selected);
      setScholarship({ ...selected, isFavorite: result.isFavorite });
      dispatch(
        setScholarshipFavorite({ id: selected.id, saved: result.isFavorite }),
      );
      showToast(result.message);
      notify(
        selected.isFavorite
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
      await loadScholarship();
    } finally {
      setIsSaving(false);
    }
  }
  let guidance: PathyMessage = {
    mood: "welcome",
    text: "Let’s look at the requirements together. Add your profile to see your personal match.",
  };
  if (notFound)
    guidance = {
      mood: "encourage",
      text: "This scholarship couldn’t be found. Let’s head back to the catalogue.",
    };
  else if (scholarship?.deadlineStatus === "closed")
    guidance = {
      mood: "encourage",
      text: "This deadline has passed. There are other opportunities waiting in the catalogue.",
    };
  else if (scholarship?.match?.eligible)
    guidance = {
      mood: "success",
      text: "You meet this scholarship’s requirements! Check the explanation to see how your preferences fit.",
    };
  else if (scholarship?.match)
    guidance = {
      mood: "encourage",
      text: "Some requirements are missing here. Read the explanation; another opportunity may suit you better.",
    };
  return (
    <>
      <PathyGuidance
        mood={guidance.mood}
        text={guidance.text}
        loading={isLoading}
        error={error}
      />
      {error && <ErrorMessage message={error} onRetry={loadScholarship} />}
      {isLoading && <LoadingMessage label="Loading scholarship details…" />}
      {!isLoading && scholarship && (
        <ScholarshipDetails
          scholarship={scholarship}
          onSave={handleSave}
          busy={isSaving}
        />
      )}
      {!isLoading && notFound && (
        <EmptyState title="Scholarship not found">
          <p>{notFound}</p>
          <Link className="button primary" to="/scholarships">
            Back to scholarships
          </Link>
        </EmptyState>
      )}
    </>
  );
}
export default ScholarshipDetailSection;
