import { useEffect, useRef, useState } from 'react';
import { textStreaming } from '../services/streaming.service';

function useStreamingText({
  onStream,
  onFailed,
}: {
  onStream?: (chunk: string) => void;
  onFailed?: (error: unknown) => void;
}) {
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onStreamRef = useRef(onStream);

  const progress = responseMessage
    ? responseMessage.length / message.length
    : 0;

  useEffect(() => {
    onStreamRef.current = onStream;
  }, [onStream]);

  const onFailedRef = useRef(onFailed);

  useEffect(() => {
    onFailedRef.current = onFailed;
  }, [onFailed]);

  const startStream = async (message: string) => {
    setResponseMessage('');
    setError(null);
    setMessage(message);

    try {
      setLoading(true);

      await textStreaming(message, (chunk) => {
        setResponseMessage((prev) => (prev ? prev.concat(chunk) : chunk));
        onStreamRef.current?.(chunk);
      });
    } catch (error) {
      onFailedRef.current?.(error);
      setError(
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'something wrong happened when streaming message',
      );
    } finally {
      setLoading(false);
    }
  };

  return { startStream, loading, responseMessage, progress, error };
}

export default useStreamingText;
