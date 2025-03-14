import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: FunctionComponent = () => {
  return (
    <main className="flex h-screen flex-col items-center justify-center background-pattern">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
