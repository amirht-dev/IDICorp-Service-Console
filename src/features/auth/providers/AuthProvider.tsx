import { createCTX } from '@/helpers';
import { useState, type PropsWithChildren } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { ACCESS_TOKEN_STORAGE_KEY } from '../constants';

// eslint-disable-next-line react-refresh/only-export-components
export const { context: AuthContext, hook: useAuth } = createCTX<{
  updateAuth: (
    args:
      | {
          status: 'authenticated';
          accessToken: string;
        }
      | {
          status: 'authenticating' | 'unauthenticated';
        },
  ) => void;
  status: AuthStatus;
}>('AuthProvider');

type AuthStatus = 'authenticating' | 'unauthenticated' | 'authenticated';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    ACCESS_TOKEN_STORAGE_KEY,
    null,
  );
  const [status, setStatus] = useState<AuthStatus>(() =>
    accessToken ? 'authenticated' : 'unauthenticated',
  );

  const updateAuth = (
    args:
      | { status: 'authenticated'; accessToken: string }
      | { status: 'unauthenticated' | 'authenticating' },
  ) => {
    if (args.status === 'authenticated') {
      setAccessToken(args.accessToken);
    }

    setStatus(args.status);
  };

  return <AuthContext value={{ updateAuth, status }}>{children}</AuthContext>;
};

export default AuthProvider;
