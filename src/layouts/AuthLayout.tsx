import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: FunctionComponent = () => {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
