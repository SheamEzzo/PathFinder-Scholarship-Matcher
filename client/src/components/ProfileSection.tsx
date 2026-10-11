import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile, fetchScholarships, saveStudentProfile } from "../api";
import { useNotification } from "../context/NotificationContext";
import type { Profile, Scholarship } from "../types";
import ProfileForm from "./ProfileForm";
import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";
import PathyGuidance from "./PathyGuidance";
function ProfileSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useNotification();
  const navigate = useNavigate();
  async function loadProfile(signal?: AbortSignal) {
    setIsLoading(true);
    setError("");
    try {
      const student = await fetchProfile(signal);
      const data = await fetchScholarships("", signal);
      if (signal?.aborted) return;
      setProfile(student.profile);
      setScholarships(data.items);
      setHasLoaded(true);
    } catch (error) {
      if (!signal?.aborted)
        setError(
          error instanceof Error
            ? error.message
            : "Could not load your profile.",
        );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    loadProfile(controller.signal);
    return () => controller.abort();
  }, []);
  async function handleSaveProfile(values: Profile) {
    await saveStudentProfile(values, profile !== null);
    showToast("Your profile is saved. Your matches are up to date.");
    navigate("/matches");
  }
  return (
    <>
      <PathyGuidance
        mood="welcome"
        text="Tell me a little about yourself. Your qualifications and interests will guide our next step."
        loading={isLoading}
        error={error}
      />
      {error && <ErrorMessage message={error} onRetry={loadProfile} />}
      {!hasLoaded && isLoading && <LoadingMessage />}
      {hasLoaded && (
        <ProfileForm
          key={JSON.stringify(profile)}
          profile={profile}
          scholarships={scholarships}
          onSubmit={handleSaveProfile}
        />
      )}
    </>
  );
}
export default ProfileSection;
