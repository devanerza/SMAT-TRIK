import { useState, useEffect, useRef } from 'react';

const REFRESH_INTERVAL_MS = 60000;

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function useQuota() {
  const [quota, setQuota] = useState({ usedUnits: 0, remainingUnits: 20, maxUnits: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function fetchQuota() {
      try {
        const today = getTodayString();
        const res = await fetch(`/api/quota?date=${today}`);
        if (!res.ok) {
          throw new Error('Gagal memuat kuota');
        }
        const data = await res.json();
        setQuota({
          usedUnits: data.usedUnits,
          remainingUnits: data.remainingUnits,
          maxUnits: data.maxUnits,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuota();

    intervalRef.current = setInterval(fetchQuota, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { ...quota, loading, error };
}
