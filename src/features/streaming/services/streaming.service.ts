import { readAccessToken } from '@/features/auth/helpers';
import { UnauthenticatedError } from '@/lib/exceptions';

export async function textStreaming(
  content: string,
  onChunk: (chunk: string) => void,
) {
  const accessToken = readAccessToken();
  if (!accessToken) throw new UnauthenticatedError();

  const headers = new Headers();

  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Content-Type', 'text/plain; charset=utf-8');
  headers.set('Accept', 'text/plain');

  const res = await fetch('/api/echo/stream', {
    credentials: 'include',
    method: 'POST',
    headers,
    body: content,
  });

  if (res.status === 401) throw new UnauthenticatedError();

  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

  if (!res.body) throw new Error('Streaming is not supported by this response');

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);

      const remaining = decoder.decode();

      if (remaining) onChunk(remaining);
    }
  } finally {
    reader.releaseLock();
  }
}
