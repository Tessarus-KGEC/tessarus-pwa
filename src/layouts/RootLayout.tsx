import { useAppSelector } from '@/redux';
import { useGetPushSubscriptionPublicKeyQuery } from '@/redux/api/user.slice';
import { arrayBufferToBase64, urlBase64ToUint8Array } from '@/utils/urlBase64ToUint8Array';
import { FunctionComponent, useCallback, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const RootLayout: FunctionComponent = () => {
  const { isLoggedIn, authToken } = useAppSelector((state) => state.auth);

  const { data: subscriptionPublicKeyResponse, isError } = useGetPushSubscriptionPublicKeyQuery(undefined, {
    skip: !isLoggedIn,
  });

  // const registerServiceWorker = useCallback(async () => {
  //   try {
  //     const registration = await navigator.serviceWorker.register('/sw.js');
  //     console.log('Service worker successfully registered.', registration);
  //     return registration;
  //   } catch (err) {
  //     console.error('Unable to register service worker.', err);
  //   }
  // }, []);

  const askNotificationPermission = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      console.log('Permission:', permission);
      return permission;
    } catch (err) {
      console.error('Unable to ask for notification permission.', err);
    }
  }, []);

  const subscribeUserToPush = useCallback(async (registration: ServiceWorkerRegistration, publicKey: string) => {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      console.log('User is subscribed:', subscription);
      return subscription;
    } catch (err) {
      console.error('Unable to subscribe user to push.', err);
    }
  }, []);

  const handleSubscription = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;

    const existedSubscription = await registration.pushManager.getSubscription();

    if (existedSubscription) {
      await existedSubscription.unsubscribe();
      console.log('Unsubscribed existing push subscription.');
    }

    if (!subscriptionPublicKeyResponse || subscriptionPublicKeyResponse.status !== 200 || isError) return;

    // if the user is not logged in then we don't need to subscribe the user to push

    const permission = await askNotificationPermission();
    if (permission !== 'granted') {
      console.log('Permission not granted.');
      return;
    }

    const subscription = await subscribeUserToPush(registration, subscriptionPublicKeyResponse.data.publicKey);
    console.log('User is subscribed:', subscription);
    if (!subscription) return;

    const auth = arrayBufferToBase64(subscription.getKey('auth'));
    const p256dh = arrayBufferToBase64(subscription.getKey('p256dh'));

    // sending the subscription to the server
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/user/notification/subscribe`, {
      method: 'POST',
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        auth,
        p256dh,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    // todo: need to removed this console.log
    console.log('Subscription sent to the server:', resp);
  }, [subscriptionPublicKeyResponse, isError, askNotificationPermission, subscribeUserToPush, authToken]);

  // first we register the service worker by ourselves
  // useEffect(() => {
  //   if (!('serviceWorker' in navigator)) {
  //     // Service Worker isn't supported on this browser, disable or hide UI.
  //     return;
  //   }

  //   if (!('PushManager' in window)) {
  //     // Push isn't supported on this browser, disable or hide UI.
  //     return;
  //   }
  //   registerServiceWorker();
  // }, []);

  // now ask for permission to send notification through the service worker
  // and if granted then subscribe the user to push notifications

  useEffect(() => {
    handleSubscription();
  }, [handleSubscription]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log(`'beforeinstallprompt' event was fired.`, e);
    });
  }, []);

  return (
    <>
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
    </>
  );
};

export default RootLayout;
