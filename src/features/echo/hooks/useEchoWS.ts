import { useAuth } from '@/features/auth/providers/AuthProvider';
import { env } from '@/lib/env';
import { useWebSocket } from '@/lib/react-use-websocket';
import { useCallback, useEffect, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import { echoMessageSchema, type EchoMessageInput } from '../schemas';
import type { MessageType } from '../types';

function useEchoWS() {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { accessToken } = useAuth();
  const [messagesHistory, setMessagesHistory] = useState<MessageType[]>([]);
  const { readyState, sendMessage } = useWebSocket(env.VITE_ECHO_WS_URL, {
    retryOnError: true,
    reconnectAttempts: 10,
    onReconnectStop() {
      setError('Websocket stop reconnecting after timeout');
    },
    onMessage(event) {
      const message = echoMessageSchema.parse(JSON.parse(event.data));

      if ('error' in message) {
        if (message.error === 'Unauthorized')
          setError('Unauthorized. Please try sign out and sign in again');
        else setError(message.error);
      }

      if ('type' in message) setIsReady(message.type === 'ready');

      if ('message' in message)
        setMessagesHistory((prev) => [
          ...prev,
          { message: message.message, sender: false },
        ]);
    },
    reconnectInterval(attemptNumber) {
      return Math.min(Math.pow(2, attemptNumber) * 1000, 30_000);
    },
  });

  useEffect(() => {
    if (!accessToken || isReady || readyState !== ReadyState.OPEN) return;

    sendMessage(JSON.stringify({ token: accessToken }), false);
  }, [sendMessage, accessToken, isReady, readyState]);

  const send = useCallback(
    (input: EchoMessageInput) => {
      sendMessage(JSON.stringify(input));
    },
    [sendMessage],
  );

  const clear = useCallback(() => {
    setMessagesHistory([]);
    setError(null);
  }, []);

  return { messagesHistory, error, readyState, send, isReady, clear };
}

export default useEchoWS;
