import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const headers = new Headers();

    Object.entries(req.headers).forEach(([key, value]) => {
      // Skip headers managed by the proxy/runtime
      if (
        value === undefined ||
        ['host', 'connection', 'content-length'].includes(key.toLowerCase())
      ) {
        return;
      }

      (Array.isArray(value) ? value : [value]).forEach((val) =>
        headers.append(key, val),
      );
    });

    const init: RequestInit = {
      method: req.method,
      headers,
      redirect: 'manual',
    };

    // GET and HEAD requests must not include a body
    if (
      req.method !== 'GET' &&
      req.method !== 'HEAD' &&
      req.body !== undefined
    ) {
      init.body =
        typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const upstream = await fetch('https://ts.idicorp.ir/api/auth/login', init);

    const responseBody = await upstream.text();

    // Read Set-Cookie headers separately
    const cookies = upstream.headers.getSetCookie();

    if (cookies.length > 0) {
      if (req.method === 'POST') {
        // Rewrite Domain only for sign-in
        const rewrittenCookies = cookies.map((cookie) =>
          cookie.replace(/;\s*Domain=[^;]*/i, ''),
        );

        res.setHeader('Set-Cookie', rewrittenCookies);
      } else {
        // Preserve cookies from other methods unchanged
        res.setHeader('Set-Cookie', cookies);
      }
    }

    const contentType = upstream.headers.get('content-type');

    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    return res.status(upstream.status).send(responseBody);
  } catch (error) {
    console.error('Login proxy error:', error);

    return res.status(502).json({
      message: 'Login proxy failed',
    });
  }
}
