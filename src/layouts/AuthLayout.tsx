import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: FunctionComponent = () => {
  return (
    <main className="gradient-background flex h-screen flex-col">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
