# IDICorp Service Console

A responsive web-based Service Console built with React, TypeScript, and Vite. The application provides authentication, task management, and interactive communication tools using WebSocket and HTTP streaming.

## Live Preview

The application is deployed on Vercel and available at:

**[Open Service Console Demo](https://idi-corp-service-console-livid.vercel.app/)**

## Features

- **Authentication**
  - User login.
  - CAPTCHA support.
  - Cookie-based authentication.
  - Protected application routes.

- **Task Management**
  - Create, read, update, and delete tasks.
  - Task status and information management.

- **WebSocket Calculator**
  - Real-time calculator communication through WebSocket.

- **WebSocket Echo**
  - Send messages and receive responses through WebSocket.

- **HTTP Streaming Echo**
  - Send HTTP requests and consume streamed responses incrementally.

- **User Interface**
  - Responsive layouts for desktop and mobile devices.
  - Form validation and error handling.
  - Accessible interactive components.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Routing | React Router 8 |
| HTTP Client | Axios |
| WebSocket | react-use-websocket |
| Server State | TanStack React Query |
| Form Management | React Hook Form |
| Validation | Zod |
| Styling | Tailwind CSS 4 |
| UI Components | Base UI / shadcn |
| Icons | Lucide React |
| Testing | Vitest, React Testing Library, MSW |
| Linting | ESLint |

## Requirements

The following runtime and tools are required to run the project locally:

- **Node.js:** 22.12 or later (recommended).
- **npm:** 10 or later.
- **Git:** Required to clone the repository.

The project uses ES modules and Vite 8.

## Installation

Clone the repository:

```bash
git clone https://github.com/amirht-dev/IDICorp-Service-Console
cd IDICorp-Service-Console
```

Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root with this variables or use `.env.example` in project root and adjust variables based on your needs and rename it to `.env`.:

```env
VITE_HTTP_API_BASE_URL = "https://ts.idicorp.ir"
VITE_CALCULATOR_WS_URL = "wss://ts.idicorp.ir/ws/calculator"
VITE_ECHO_WS_URL = "wss://ts.idicorp.ir/ws/echo"
```

> **Note:** Variables prefixed with `VITE_` are exposed to the client-side application after building. Do not store passwords, private API keys, or other sensitive information in these variables.

### Development Proxy

The project uses a Vite development proxy to forward API requests to the backend.

The relevant configuration in `vite.config.ts` is:

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), '');

  const VITE_HTTP_API_BASE_URL = loadedEnv.VITE_HTTP_API_BASE_URL;

  if (!VITE_HTTP_API_BASE_URL) throw new Error('no api url');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      proxy: {
        '/api': {
          target: VITE_HTTP_API_BASE_URL,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: '',
        },
      },
    },
  };
});
```

The frontend should use relative API paths:

```ts
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
```

This allows API requests to go through the Vite development server rather than directly from the browser to the backend.

## Running Locally

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal. By default, it is:

```text
http://localhost:5173
```

Open this URL in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Runs TypeScript project checks and creates a production build. |
| `npm run preview` | Serves the production build locally for preview. |
| `npm run lint` | Runs ESLint across the project. |
| `npm run test` | Runs the Vitest test suite. |
| `npm run test:node` | Runs tests configured for the Node environment. |
| `npm run test:dom` | Runs tests configured for the DOM environment. |

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The generated production files will be available in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

The preview server will provide a local URL, usually:

```text
http://localhost:4173
```

## Testing and Code Quality

Run the test suite:

```bash
npm run test
```

Run Node-specific tests:

```bash
npm run test:node
```

Run DOM-specific tests:

```bash
npm run test:dom
```

Run ESLint:

```bash
npm run lint
```

Run the production build check:

```bash
npm run build
```

## Backend Integration and Known Issues

### 1. Authentication Cookie and SameSite Behavior

The backend authentication endpoint returns a session cookie with the following attribute:

```text
SameSite=Lax
```

During the initial integration, the browser did not store the cookie when authentication requests were made directly across different origins.

To work around this behavior during local development, a Vite development proxy was configured.

The proxy forwards `/api` requests to the backend and uses:

```ts
cookieDomainRewrite: ""
```

This removes the backend cookie's Domain attribute, allowing the browser to store the cookie for the local development origin.

With this configuration, authentication works through the local Vite proxy.

This is a development-side workaround; it does not change the backend's cookie configuration.

### 2. WebSocket Echo Endpoint – HTTP 403

The backend WebSocket Echo endpoint:

```text
wss://ts.idicorp.ir/ws/echo
```

currently has an integration issue.

Even when the user is successfully authenticated, establishing a WebSocket connection to this endpoint returns:

```text
Error: Unexpected server response: 403
```

This behavior has been observed despite successful authentication.

The issue appears to be related to the server-side WebSocket connection or authorization handling. The endpoint therefore cannot currently be considered reliable for end-to-end testing.

The issue has been documented separately from frontend implementation errors.

## Notes

- The Vite proxy is intended for local development. It is not included as a runtime proxy in the production build.
- Production deployment requires an appropriate backend/API routing configuration.
- Cookie behavior in production depends on the backend's cookie attributes, browser security policies, and frontend/backend origin configuration.
- WebSocket connectivity depends on the backend endpoint being available and accepting authenticated connections.

## Project Status

The frontend integrates with the provided backend services. Known backend integration limitations, particularly the WebSocket Echo endpoint returning HTTP 403, are documented above.

