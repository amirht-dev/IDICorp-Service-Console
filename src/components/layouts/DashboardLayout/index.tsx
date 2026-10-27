import Sidebar from '@/components/shared/Sidebar';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-dvh items-start">
      <aside className="basis-sm grow-0 shrink-0 sticky top-0 max-lg:hidden">
        <Sidebar />
      </aside>

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
