import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { signIn } from '../services/signIn.service';

export default function useSignInMutation() {
  const { updateAuth } = useAuth();
  return useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: signIn,
    onSuccess(data) {
      updateAuth({ status: 'authenticated', accessToken: data.access_token });
    },
  });
}
