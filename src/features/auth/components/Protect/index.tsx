import { Spinner } from '@/components/ui/Spinner';
import type { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../providers/AuthProvider';

const Protect = ({ children }: PropsWithChildren) => {
  const { status } = useAuth();
  if (status === 'authenticating')
    return (
      <div className="h-dvh flex items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
  else if (status === 'unauthenticated') return <Navigate to="/sign-in" />;

  if (children) return children;

  return <Outlet />;
};

export default Protect;
