import logo_image from '@/assets/images/logo_text_row_light.webp';
import NavigationDrawer from '../NavigationDrawer';

const Header = () => {
  return (
    <div className="flex items-center justify-between mb-4 lg:hidden">
      <img src={logo_image} alt="" className="w-28" />
      <NavigationDrawer />
    </div>
  );
};

export default Header;
