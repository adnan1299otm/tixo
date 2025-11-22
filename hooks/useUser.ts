
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/profile', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    user: data,
    isLoading,
    isError: error,
    mutate, // Call this to force a data refresh after update
  };
}
