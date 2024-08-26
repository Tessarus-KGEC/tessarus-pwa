import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import RootLayout from './layouts/RootLayout';
import Analytics from './pages/Analytics';
import Checkin from './pages/CheckIn';
import Event from './pages/Event/Event';
import Events from './pages/Events/Events';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Otp from './pages/Otp';
import PaymentLogs from './pages/PaymentLogs';
import Signup from './pages/Signup';
import Tickets from './pages/Tickets/Tickets';
import UserManagement from './pages/UserManagement';
import Wallet from './pages/Wallet';
import { Route } from './types/route';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // loader: <></>,
    children: [
      {
        index: true,
        element: <Navigate to={`/dashboard/${Route.EVENTS}`} />,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: Route.LOGIN,
            element: <Login />,
          },
          {
            path: `${Route.OTP}/:otp_token`,
            element: <Otp />,
          },
          {
            path: Route.SIGNUP,
            element: <Signup />,
          },
        ],
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: Route.EVENTS,
            element: <Events />,
          },
          {
            path: `${Route.EVENTS}/:eventId`,
            element: <Event />,
          },
          {
            path: Route.CHECKIN,
            element: <Checkin />,
          },
          {
            path: Route.TICKETS,
            element: <Tickets />,
          },
          {
            path: Route.WALLET,
            element: <Wallet />,
          },
          {
            path: Route.ANALYTICS,
            element: <Analytics />,
          },
          {
            path: Route.PAYMENT_LOGS,
            element: <PaymentLogs />,
          },
          {
            path: Route.USER_MANAGEMENT,
            element: <UserManagement />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export { appRouter };
