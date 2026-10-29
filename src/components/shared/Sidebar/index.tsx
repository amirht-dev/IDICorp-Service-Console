import calc_image from '@/assets/images/calculator.webp';
import echo_image from '@/assets/images/echo.webp';
import logo_image from '@/assets/images/logo_text_row_dark.webp';
import streaming_image from '@/assets/images/streaming.webp';
import tasks_image from '@/assets/images/tasks.webp';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { cn } from 'cn';
import { LogOutIcon } from 'lucide-react';
import { NavLink } from 'react-router';

const navLinks = [
  { label: 'Tasks', to: '/tasks', image: tasks_image },
  { label: 'Calculator', to: '/calculator', image: calc_image },
  { label: 'Echo', to: '/echo', image: echo_image },
  { label: 'Streaming', to: '/streaming', image: streaming_image },
];

const Sidebar = ({ onNavigation }: { onNavigation?: () => void }) => {
  const { updateAuth } = useAuth();

  return (
    <div className="h-dvh bg-sidebar text-sidebar-foreground px-4 py-8 flex flex-col">
      <img src={logo_image} alt="" className="w-50" />

      <ul className="flex flex-col mt-14 gap-3">
        {navLinks.map((item, idx) => (
          <li key={idx}>
            <NavLink
              to={item.to}
              onClick={() => onNavigation?.()}
              className={({ isActive }) =>
                cn(
                  'flex gap-2 items-center text-lg p-2.5 rounded-md transition-all',
                  isActive ? 'bg-sidebar-foreground/10' : '',
                )
              }
            >
              <img src={item.image} alt={item.label} className="w-10" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <Button
        variant="secondary"
        size="xl"
        className="mt-auto"
        onClick={() => updateAuth({ status: 'unauthenticated' })}
      >
        Sign out
        <LogOutIcon />
      </Button>
    </div>
  );
};

export default Sidebar;
