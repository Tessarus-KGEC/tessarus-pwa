import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout: FunctionComponent = () => {
  return (
    <main className="gradient-background flex h-screen flex-col">
      {/* header  */}
      <Outlet />
      {/* footer */}
    </main>
  );
};

export default DashboardLayout;
