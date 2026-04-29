'use client';
import { useEffect, useRef } from 'react';

export function useSocket(onEvent) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!onEvent) return;

    // Poll every 10 seconds instead of WebSocket
    intervalRef.current = setInterval(() => {
      onEvent('lead:updated', {});
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onEvent]);

  return intervalRef;
}