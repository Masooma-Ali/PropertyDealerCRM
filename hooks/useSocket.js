'use client';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(onEvent) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => console.log('Socket connected'));

    if (onEvent) {
      const events = [
        'lead:created', 'lead:updated', 'lead:deleted',
        'lead:assigned', 'lead:assignment-changed',
      ];
      events.forEach((event) => socket.on(event, (data) => onEvent(event, data)));
    }

    return () => socket.disconnect();
  }, []);

  return socketRef;
}