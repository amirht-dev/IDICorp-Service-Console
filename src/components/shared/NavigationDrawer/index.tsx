import { Button } from '@/components/ui/Button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/Drawer';
import { PanelRightOpenIcon } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../Sidebar';

const NavigationDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <Drawer swipeDirection="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button variant="outline" size="icon" className="lg:hidden">
            <PanelRightOpenIcon />
          </Button>
        }
      />
      <DrawerContent className="border-none">
        <Sidebar onNavigation={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};

export default NavigationDrawer;
