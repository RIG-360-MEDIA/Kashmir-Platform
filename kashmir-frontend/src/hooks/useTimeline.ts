import useSWR from 'swr';
import { api } from '@/lib/api';
import { MOCK_TIMELINE } from '@/lib/mockData';
import type { TimelineEvent } from '@/types/api';

const fetcher = () => api.timeline().then(r => r?.events ?? null);

export function useTimeline() {
  const { data, error, isLoading } = useSWR<TimelineEvent[] | null>(
    'timeline',
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 900_000 }
  );

  return {
    events:    data ?? MOCK_TIMELINE,
    isLoading,
    isError:   !!error,
    isMock:    !data && !isLoading,
  };
}
