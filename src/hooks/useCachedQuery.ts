import { useCallback, useEffect, useState } from 'react';
import { getWithExpiry, setWithExpiry } from '../utils/storage';

type CachedQueryOptions<T> = {
  queryKey: string;
  queryFn: () => Promise<T>;
  cacheTime?: number;
  enabled?: boolean;
};

type QueryState<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
};

export const useCachedQuery = <T>({
  queryKey,
  queryFn,
  cacheTime = 60 * 60 * 1000, // 1 hora por padrão
  enabled = true,
}: CachedQueryOptions<T>) => {
  const [state, setState] = useState<QueryState<T>>({
    data: undefined,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setState((prev: QueryState<T>) => ({ ...prev, isLoading: true, error: null }));
      
      // Verificar cache se não estiver pulando
      if (!skipCache) {
        const cachedData = getWithExpiry<T>(queryKey);
        
        if (cachedData) {
          setState({
            data: cachedData,
            isLoading: false,
            error: null,
          });
          return;
        }
      }
      
      // Buscar dados e armazenar em cache
      const data = await queryFn();
      setWithExpiry(queryKey, data, cacheTime);
      
      setState({
        data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: undefined,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [queryKey, queryFn, cacheTime]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    } else {
      setState((prev: QueryState<T>) => ({ ...prev, isLoading: false }));
    }
  }, [enabled, fetchData, queryKey]);

  return {
    ...state,
    refetch,
  };
};

export default useCachedQuery; 