import { NextUIProvider } from '@nextui-org/system';
import { RouterProvider } from 'react-router-dom';
import ProviderWrapper from './redux/ProviderWrapper';
import { appRouter } from './Route';

const App = () => {
  return (
    <NextUIProvider>
      <ProviderWrapper>
        <RouterProvider router={appRouter} />
      </ProviderWrapper>
    </NextUIProvider>
  );
};

export default App;
