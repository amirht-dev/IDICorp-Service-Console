import { useAuth } from '@/features/auth/providers/AuthProvider';
import useWebSocket, { ReadyState } from '@/hooks/useWebSocket';
import { env } from '@/lib/env';
import { useCallback, useEffect, useState } from 'react';
import type { z } from 'zod/v4';
import {
  calculatorClientAuthenticateSchema,
  calculatorClientRequestSchema,
  calculatorServerMessageSchema,
} from '../schemas';

function useCalculateWS() {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { accessToken } = useAuth();
  const [result, setResult] = useState<number | null>(null);
  const { readyState, sendMessage } = useWebSocket(env.VITE_CALCULATOR_WS_URL, {
    reconnectAttempts: (closeEvent) => {
      if (closeEvent.code === 1008) return false;
      return 10;
    },
    onMessage(event) {
      const message = calculatorServerMessageSchema.parse(
        JSON.parse(event.data),
      );

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
    sendMessage(
      JSON.stringify({
        token: accessToken,
      } satisfies z.infer<typeof calculatorClientAuthenticateSchema>),
    );
  }, [sendMessage, accessToken, isReady, readyState, error]);

  const calculate = useCallback(
    (input: z.infer<typeof calculatorClientRequestSchema>) => {
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
