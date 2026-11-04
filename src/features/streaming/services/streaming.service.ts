import { readAccessToken } from '@/features/auth/helpers';
import { AuthenticationError, HTTPError, NetworkError } from '../errors';

export async function textStreaming(
  content: string,
  onChunk: (chunk: string) => void,
) {
  const accessToken = readAccessToken();
  if (!accessToken) throw new AuthenticationError();

  const headers = new Headers();

  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Content-Type', 'text/plain; charset=utf-8');
  headers.set('Accept', 'text/plain');

  let res;

  try {
    res = await fetch('/api/echo/stream', {
      credentials: 'include',
      method: 'POST',
      headers,
      body: content,
    });
  } catch (error) {
    throw new NetworkError('', { cause: error });
  }

  if (!res.ok) throw HTTPError.fromResponse(res);

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
  } catch (error) {
    throw new Error('Failed to read stream.', { cause: error });
  } finally {
    reader.releaseLock();
  }
}
