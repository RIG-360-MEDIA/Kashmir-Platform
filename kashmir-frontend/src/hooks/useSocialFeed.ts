import useSWR from 'swr';
import { api } from '@/lib/api';
import { MOCK_SOCIAL } from '@/lib/mockData';
import type { SocialPost } from '@/types/api';

const fetcher = () => api.social().then(r => r?.posts ?? null);

export function useSocialFeed() {
  const { data, error, isLoading } = useSWR<SocialPost[] | null>(
    'social',
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 300_000, dedupingInterval: 120_000 }
  );

  return {
    posts:     data ?? MOCK_SOCIAL,
    isLoading,
    isError:   !!error,
    isMock:    !data && !isLoading,
  };
}
