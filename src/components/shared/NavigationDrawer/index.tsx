import { Button } from '@/components/ui/Button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/Drawer';
import { PanelRightOpenIcon } from 'lucide-react';
import Sidebar from '../Sidebar';

const NavigationDrawer = () => {
  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger
        render={
          <Button variant="outline" size="icon" className="lg:hidden">
            <PanelRightOpenIcon />
          </Button>
        }
      />
      <DrawerContent className="border-none">
        <Sidebar />
      </DrawerContent>
    </Drawer>
  );
};

export default NavigationDrawer;
