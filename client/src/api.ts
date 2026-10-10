import type {
  MatchList,
  Profile,
  Scholarship,
  ScholarshipList,
} from "./types";
const API_URL = import.meta.env.VITE_API_URL || "/api";
const SCHOLARSHIPS_URL = `${API_URL}/scholarships`;
const PROFILE_URL = `${API_URL}/profile`;
const MATCHES_URL = `${API_URL}/matches`;
const FAVORITES_URL = `${API_URL}/favorites`;
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
async function readErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await response.json();
    if (Array.isArray(data.message)) return data.message.join(" ");
    if (typeof data.message === "string") return data.message;
  } catch {
   
  }
  return fallback;
}
function handleNetworkError(error: unknown): never {
  if (error instanceof Error && error.name === "AbortError") throw error;
  throw new Error(
    "We couldn’t connect. Check your connection and make sure the server is running, then try again.",
  );
}
export async function fetchScholarships(
  query = "",
  signal?: AbortSignal,
): Promise<ScholarshipList> {
  const response = await fetch(
    SCHOLARSHIPS_URL + (query ? `?${query}` : ""),
    {
      signal,
    },
  ).catch(handleNetworkError);
  if (!response.ok)
    throw new ApiError(
      response.status,
      await readErrorMessage(response, "Could not load scholarships."),
    );
  return (await response.json()) as ScholarshipList;
}
export async function fetchScholarshipById(
  id: string,
  signal?: AbortSignal,
): Promise<Scholarship> {
  const response = await fetch(
       `${SCHOLARSHIPS_URL}/${encodeURIComponent(id)}`,
    { signal },
  ).catch(handleNetworkError);
  if (!response.ok)
    throw new ApiError(
      response.status,
      await readErrorMessage(response, "Could not load this scholarship."),
    );
  return (await response.json()) as Scholarship;
}
export async function fetchProfile(
  signal?: AbortSignal,
): Promise<{ profile: Profile | null }> {
  const response = await fetch(PROFILE_URL, { signal }).catch(
    handleNetworkError,
  );
  if (!response.ok)
    throw new ApiError(
      response.status,
      await readErrorMessage(response, "Could not load your profile."),
    );
  return (await response.json()) as { profile: Profile | null };
}
export async function fetchFavorites(
  signal?: AbortSignal,
): Promise<ScholarshipList> {
  const response = await fetch(FAVORITES_URL, { signal }).catch(
    handleNetworkError,
  );
   if (!response.ok)
    throw new ApiError(
      response.status,
      await readErrorMessage(response, "Could not load favorites."),
    );
  return (await response.json()) as ScholarshipList;
}
export async function fetchMatches(
  query = "",
  signal?: AbortSignal,
): Promise<MatchList> {
  const response = await fetch(MATCHES_URL + (query ? `?${query}` : ""), {
    signal,
  }).catch(handleNetworkError);
  if (!response.ok)
    throw new ApiError(
      response.status,
      await readErrorMessage(response, "Could not load matches."),
    );
  return (await response.json()) as MatchList;
}
export async function saveStudentProfile(
  profile: Profile,
  exists: boolean,
): Promise<Profile> {
  const response = await fetch(PROFILE_URL, {
    method: exists ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
      }).catch(handleNetworkError);
  if (!response.ok)
    throw new ApiError(
      response.status,
      await readErrorMessage(response, "Could not save your profile."),
    );
  return (await response.json()) as Profile;
}
export async function setScholarshipSaved(
  scholarship: Scholarship,
): Promise<{
  scholarshipId: number;
  isFavorite: boolean;
  message: string;
}> {
  const response = await fetch(`${FAVORITES_URL}/${scholarship.id}`, {
    method: scholarship.isFavorite ? "DELETE" : "POST",
  }).catch(handleNetworkError);
  if (!response.ok)
    throw new ApiError(
      response.status,
      await readErrorMessage(response, "Could not update favorites."),
    );
  return (await response.json()) as {
    scholarshipId: number;
    isFavorite: boolean;
    message: string;
  };
}