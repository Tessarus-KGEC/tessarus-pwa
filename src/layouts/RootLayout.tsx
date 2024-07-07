import { NextUIProvider } from '@nextui-org/system';
import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

// TODO: Implement ProviderWrapper for Redux
const RootLayout: FunctionComponent = () => {
  return (
    <NextUIProvider>
      <body className="h-screen bg-background text-foreground dark">
        <Outlet />
      </body>
    </NextUIProvider>
  );
};

export default RootLayout;
