import { useAuth } from '@/features/auth/providers/AuthProvider';
import { env } from '@/lib/env';
import { useCallback, useEffect, useState } from 'react';
import { calculatorMessageSchema, type CalculatorInput } from '../schemas';
import { useWebSocket } from '@/lib/react-use-websocket';
import { ReadyState } from 'react-use-websocket';

function useCalculateWS() {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { accessToken } = useAuth();
  const [result, setResult] = useState<number | null>(null);
  const { readyState, sendMessage } = useWebSocket(env.VITE_CALCULATOR_WS_URL, {
    retryOnError: true,
    reconnectAttempts: 10,
    onReconnectStop() {
      setError('Websocket stop reconnecting after timeout');
    },
    onMessage(event) {
      const message = calculatorMessageSchema.parse(JSON.parse(event.data));

      if ('error' in message) {
        if (message.error === 'Unauthorized')
          setError('Unauthorized. Please try sign out and sign in again');
        else setError(message.error);
      }

      if ('type' in message) setIsReady(message.type === 'ready');

      if ('result' in message) setResult(message.result);
    },
    reconnectInterval(attemptNumber) {
      return Math.min(Math.pow(2, attemptNumber) * 1000, 30_000);
    },
  });

  useEffect(() => {
    if (!accessToken || isReady || readyState !== ReadyState.OPEN) return;

    sendMessage(JSON.stringify({ token: accessToken }), false);
  }, [sendMessage, accessToken, isReady, readyState]);

  const calculate = useCallback(
    (input: CalculatorInput) => {
      sendMessage(JSON.stringify(input));
    },
    [sendMessage],
  );

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, readyState, calculate, isReady, clear };
}

export default useCalculateWS;
