import { NextUIProvider } from '@nextui-org/system';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { appRouter } from './Route';

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((swReg) => {
          console.log('Service Worker registered', swReg);

          // Requesting notification permission
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('Notification permission granted.');
              // You can now subscribe the user to push notifications
              console.log('Subscribing to push notifications...', permission);
            } else {
              console.log('Notification permission denied.');
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed', error);
        });
    }
  }, []);

  return (
    <NextUIProvider>
      <body className="h-screen bg-background text-foreground dark">
        <RouterProvider router={appRouter} />
      </body>
    </NextUIProvider>
  );
}

export default App;
