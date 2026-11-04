import { useTheme, type Theme } from '@/providers/ThemeProvider';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode } from 'react';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../DropdownMenu';

const themeOptions = {
  light: {
    value: 'light',
    label: 'Light',
    icon: <SunIcon />,
  },
  dark: {
    value: 'dark',
    label: 'Dark',
    icon: <MoonIcon />,
  },
  system: {
    value: 'system',
    label: 'System',
    icon: <MonitorIcon />,
  },
} satisfies Record<Theme, { value: Theme; label: string; icon: ReactNode }>;

const ThemeSwitcher = (props: ComponentProps<typeof Button>) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" {...props}>
            {themeOptions[theme].icon}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          {Object.values(themeOptions).map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.icon}
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
