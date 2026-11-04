import logo_image_dark from '@/assets/images/logo_text_row_dark.webp';
import logo_image_light from '@/assets/images/logo_text_row_light.webp';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { useTheme } from '@/providers/ThemeProvider';
import NavigationDrawer from '../NavigationDrawer';

const Header = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex items-center justify-between mb-4 lg:hidden">
      <img
        src={resolvedTheme === 'light' ? logo_image_light : logo_image_dark}
        alt=""
        className="w-28"
      />

      <div className="flex items-center gap-1">
        <ThemeSwitcher />
        <NavigationDrawer />
      </div>
    </div>
  );
};

export default Header;
