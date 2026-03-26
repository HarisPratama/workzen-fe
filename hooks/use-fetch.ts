import { useState, useEffect, useCallback, useRef } from "react";

interface UseFetchOptions {
    enabled?: boolean;
    debounceMs?: number;
}

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFetch<T>(
    fetcher: () => Promise<T>,
    deps: unknown[] = [],
    options: UseFetchOptions = {}
): UseFetchResult<T> {
    const { enabled = true, debounceMs = 0 } = options;
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef(false);

    const fetchData = useCallback(async () => {
        if (!enabled) {
            setLoading(false);
            return;
        }
        abortRef.current = false;
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            if (!abortRef.current) {
                setData(result);
            }
        } catch (err) {
            if (!abortRef.current) {
                setError(err instanceof Error ? err.message : "An error occurred");
            }
        } finally {
            if (!abortRef.current) {
                setLoading(false);
            }
        }
    }, deps);

    useEffect(() => {
        if (!enabled) return;

        if (debounceMs > 0) {
            const timeout = setTimeout(fetchData, debounceMs);
            return () => {
                clearTimeout(timeout);
                abortRef.current = true;
            };
        }

        fetchData();
        return () => {
            abortRef.current = true;
        };
    }, [fetchData, enabled, debounceMs]);

    return { data, loading, error, refetch: fetchData };
}
