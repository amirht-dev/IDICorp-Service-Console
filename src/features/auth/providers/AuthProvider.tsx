import { createCTX } from '@/helpers';
import { useQueryClient } from '@tanstack/react-query';
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
  accessToken: string | null;
}>('AuthProvider');

type AuthStatus = 'authenticating' | 'unauthenticated' | 'authenticated';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<
    string | null
  >(ACCESS_TOKEN_STORAGE_KEY, null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    accessToken ? 'authenticated' : 'unauthenticated',
  );
  const queryClient = useQueryClient();

  const updateAuth = (
    args:
      | { status: 'authenticated'; accessToken: string }
      | { status: 'unauthenticated' | 'authenticating' },
  ) => {
    if (args.status === 'authenticated') {
      setAccessToken(args.accessToken);
    } else {
      removeAccessToken();
      queryClient.clear();
    }
    setStatus(args.status);
  };

  return (
    <AuthContext value={{ updateAuth, status, accessToken }}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
