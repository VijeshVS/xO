import { useState, useCallback, useRef, useEffect } from 'react';

export function useWebSocket(url: string) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setConnected(true);
      };

      ws.onclose = () => {
        setConnected(false);
      };

      ws.onerror = () => {
        setConnected(false);
      };

      socketRef.current = ws;
    }
  }, [url]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    connected,
    connect
  };
}