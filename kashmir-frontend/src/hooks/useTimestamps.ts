import useSWR from 'swr';
import { api } from '@/lib/api';
import { MOCK_TIMESTAMPS } from '@/lib/mockData';
import { FILM } from '@/content/film';
import type { TimestampMarker } from '@/types/api';

/* Backend timestamps are stale placeholders — prefer local film.ts chapters */
const toMarkers = (): TimestampMarker[] =>
  FILM.chapters.map(c => ({
    timestamp_seconds: c.timestamp_seconds,
    title:       c.subtitle,
    description: c.description,
    chapter:     c.title,
  }));

const fetcher = () => api.timestamps().then(r => r?.markers ?? null);

export function useTimestamps() {
  const { data, isLoading } = useSWR<TimestampMarker[] | null>(
    'timestamps',
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3_600_000 }
  );

  /* Always prefer local film.ts data — backend data is stale */
  return {
    markers:   toMarkers(),
    backendMarkers: data ?? MOCK_TIMESTAMPS,
    isLoading,
  };
}
