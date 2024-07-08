import ProviderWrapper from '@/redux/ProviderWrapper';
import { NextUIProvider } from '@nextui-org/system';
import { FunctionComponent } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

// TODO: Implement ProviderWrapper for Redux
const RootLayout: FunctionComponent = () => {
  return (
    <NextUIProvider>
      <ProviderWrapper>
        <body className="h-screen bg-background text-foreground dark">
          <Outlet />
        </body>
        <Toaster
          toastOptions={{
            style: {
              borderRadius: '30px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </ProviderWrapper>
    </NextUIProvider>
  );
};

export default RootLayout;
