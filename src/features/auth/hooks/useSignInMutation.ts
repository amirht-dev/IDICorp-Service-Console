import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { signIn } from '../services/signIn.service';
import type { SignInInput } from '../types';

export default function useSignInMutation() {
  const { updateAuth } = useAuth();
  return useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: (input: SignInInput) => signIn(input),
    onSuccess(data) {
      updateAuth({ status: 'authenticated', accessToken: data.access_token });
    },
  });
}
