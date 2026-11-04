import { useCallback, useEffect, useRef, useState } from 'react';
import type { ValueOf } from 'type-fest';

export const ReadyState = {
  IDLE: -1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

type Options = {
  onOpen?: (e: Event) => void;
  onMessage?: (e: MessageEvent) => void;
  onError?: (e: Event) => void;
  onClose?: (e: CloseEvent) => void;
  reconnectInterval?: number | ((attempts: number) => number);
  reconnectAttempts?:
    | number
    | false
    | ((closeEvent: CloseEvent) => number | false);
};

function useWebSocket(url: string, options?: Options) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const [readyState, setReadyState] = useState<ValueOf<typeof ReadyState>>(
    ReadyState.CONNECTING,
  );
  const optionsRef = useRef(options);
  const closeEventRef = useRef<CloseEvent | null>(null);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const connect = useCallback(() => {
    const ws = (wsRef.current = new WebSocket(url));

    setReadyState(ReadyState.CONNECTING);

    ws.onopen = (e) => {
      if (ws !== wsRef.current) return;
      setReadyState(ReadyState.OPEN);
      reconnectAttemptsRef.current = 0;
      optionsRef.current?.onOpen?.(e);
    };
    ws.onmessage = (e) => {
      if (ws !== wsRef.current) return;
      optionsRef.current?.onMessage?.(e);
    };
    ws.onerror = (e) => {
      if (ws !== wsRef.current) return;
      setReadyState(ReadyState.CLOSING);
      optionsRef.current?.onError?.(e);
    };
    ws.onclose = (e) => {
      if (ws !== wsRef.current) return;
      setReadyState(ReadyState.CLOSED);
      wsRef.current = null;
      optionsRef.current?.onClose?.(e);
      closeEventRef.current = e;
    };

    return ws;
  }, [url]);

  useEffect(() => {
    const { reconnectAttempts = 10, reconnectInterval = 2000 } =
      optionsRef.current ?? {};
    const resolveReconnectAttempts =
      reconnectAttempts instanceof Function
        ? closeEventRef.current
          ? reconnectAttempts(closeEventRef.current)
          : false
        : reconnectAttempts;
    if (
      !resolveReconnectAttempts ||
      reconnectAttemptsRef.current >= resolveReconnectAttempts ||
      readyState !== ReadyState.CLOSED ||
      closeEventRef.current?.code === 1000
    )
      return;

    const delay =
      typeof reconnectInterval === 'number'
        ? reconnectInterval
        : reconnectInterval(reconnectAttemptsRef.current);

    const timeout = setTimeout(() => {
      reconnectAttemptsRef.current++;
      connect();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [readyState, connect]);

  useEffect(() => {
    if (!url || wsRef.current) return;

    const ws = connect();

    return () => {
      ws.close(1000);
      wsRef.current = null;
    };
  }, [url, connect]);

  const sendMessage = useCallback((data: BufferSource | Blob | string) => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== ws.OPEN) return;

    ws.send(data);
  }, []);

  return { readyState, sendMessage };
}

export default useWebSocket;
