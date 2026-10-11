import type {MatchList, Profile, Scholarship, ScholarshipList} from './types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(API_URL + path, {
      ...options, headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new Error('We couldn’t connect. Check your connection and make sure the server is running, then try again.');
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
    throw new ApiError(response.status, message || 'Something went wrong. Please try again.');
  }
  if (body === null) throw new Error('The server returned an unexpected response. Please try again.');
  return body as T;
}

// Named API functions, following the supplied classroom example.
export function fetchScholarships(query = '', signal?: AbortSignal) {
  return api<ScholarshipList>('/scholarships' + (query ? '?' + query : ''), {signal});
}

export function fetchScholarshipById(id: string, signal?: AbortSignal) {
  return api<Scholarship>('/scholarships/' + encodeURIComponent(id), {signal});
}

export function fetchProfile(signal?: AbortSignal) {
  return api<{profile: Profile | null}>('/profile', {signal});
}

export function fetchFavorites(signal?: AbortSignal) {
  return api<ScholarshipList>('/favorites', {signal});
}

export function fetchMatches(query = '', signal?: AbortSignal) {
  return api<MatchList>('/matches' + (query ? '?' + query : ''), {signal});
}

export function saveStudentProfile(profile: Profile, exists: boolean) {
  return api<Profile>('/profile', {method: exists ? 'PATCH' : 'POST', body: JSON.stringify(profile)});
}

export function setScholarshipSaved(scholarship: Scholarship) {
  return api<{message: string}>('/favorites/' + scholarship.id, {method: scholarship.isFavorite ? 'DELETE' : 'POST'});
}
