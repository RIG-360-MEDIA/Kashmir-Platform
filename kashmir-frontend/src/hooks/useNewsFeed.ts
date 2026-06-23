import useSWR from 'swr';
import { api } from '@/lib/api';
import { MOCK_NEWS } from '@/lib/mockData';
import type { NewsResponse } from '@/types/api';

const fetcher = () => api.news();

export function useNewsFeed() {
  const { data, error, isLoading } = useSWR<NewsResponse | null>(
    'news',
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 900_000, dedupingInterval: 300_000 }
  );

  return {
    articles:  data?.articles ?? MOCK_NEWS,
    isLoading,
    isError:   !!error,
    isMock:    !data && !isLoading,
    fetchedAt: data?.fetched_at ? new Date(data.fetched_at) : new Date(),
  };
}
