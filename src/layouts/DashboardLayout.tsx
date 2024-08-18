import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { IoAnalyticsOutline, IoCloseOutline, IoDocumentTextOutline, IoMenuOutline, IoScanOutline, IoWalletOutline } from 'react-icons/io5';
import { MdOutlineAdminPanelSettings, MdOutlineEvent } from 'react-icons/md';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import EspektroLogo from '@/assets/logo/Espektro logo fill.svg';
import ProtectedLayout from '@/components/Protected';
import { RoutePath } from '@/constants/route';
import { useAppDispatch, useAppSelector } from '@/redux';
import { logout } from '@/redux/reducers/auth.reducer';
import RouteWrapper from '@/redux/RouteWrapper';
import { Route } from '@/types/route';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Image } from '@nextui-org/react';
import { MdInstallMobile } from 'react-icons/md';

gsap.registerPlugin(useGSAP);

const navlinks: {
  title: string;
  route: string;
  status: 'active' | 'inactive';
  icon: JSX.Element;
}[] = [
  {
    title: 'Events',
    route: Route.EVENTS,
    status: 'active',
    icon: <MdOutlineEvent size={20} />,
  },
  {
    title: 'Check in',
    route: Route.CHECKIN,
    status: 'active',
    icon: <IoScanOutline size={20} />,
  },
  {
    title: 'Analytics',
    route: Route.ANALYTICS,
    status: 'active',
    icon: <IoAnalyticsOutline size={20} />,
  },
  {
    title: 'Wallet',
    route: Route.WALLET,
    status: 'active',
    icon: <IoWalletOutline size={20} />,
  },
  {
    title: 'Payment logs',
    route: Route.PAYMENT_LOGS,
    status: 'active',
    icon: <IoDocumentTextOutline size={20} />,
  },
  {
    title: 'User management',
    route: Route.USER_MANAGEMENT,
    status: 'active',
    icon: <MdOutlineAdminPanelSettings size={20} />,
  },
];

const ProfileDropdown = () => {
  const dispatch = useAppDispatch();

  return (
    <Dropdown className="text-foreground dark">
      <DropdownTrigger>
        <Avatar isBordered radius="full" color="secondary" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="h-9 w-9 cursor-pointer" />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="profile">Profile</DropdownItem>
        <DropdownItem key="event">Events</DropdownItem>
        <DropdownItem key="ticket">Tickets</DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onClick={async () => {
            await new Promise((resolve) => {
              dispatch(logout());
              resolve(0);
            });
            window.location.href = RoutePath.login();
          }}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const Sidebar: FunctionComponent<{
  classname?: string;
  hideClose?: boolean;
  handleClose?: () => void;
  renderCustomPWAInstallPrompt?: Event | null;
}> = ({ handleClose, classname, hideClose, renderCustomPWAInstallPrompt }) => {
  const { activeRoute } = useAppSelector((state) => state.route);

  const isActiveRoute = useCallback((title: string) => activeRoute.includes(title), [activeRoute]);

  return (
    <nav
      id="tessarus-sidebar"
      className={`flex h-full w-[280px] flex-col gap-4 rounded-br-lg rounded-tr-lg border-red-400 text-default-600 backdrop-blur-sm dark:bg-default-50 xs:w-[300px] ${classname}`}
    >
      <div className="flex justify-between gap-4 px-4 py-5 md:px-6">
        <div className="flex items-center gap-2">
          <Image src={EspektroLogo} alt="Espektro Logo" width={30} height={30} className="rounded-full" />
          <p className="text-xl xs:text-2xl">Tessarus</p>
        </div>
        <div className={`flex cursor-pointer items-center justify-center transition-all hover:text-default-500 ${hideClose ? 'hidden' : 'block'}`}>
          <IoCloseOutline size={30} onClick={handleClose} />
        </div>
      </div>
      <div className="px-4">
        <ul className="flex flex-col gap-2">
          {navlinks.map((link) => {
            if (link.status === 'inactive') return null;
            return (
              <Link key={link.route} to={`/dashboard/${link.route}`}>
                <div
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 ${isActiveRoute(link.route) ? 'bg-default-200 text-default-600' : 'text-default-500'} hover:bg-default-200 hover:text-default-600`}
                >
                  <span>{link.icon}</span>
                  {link.title}
                </div>
              </Link>
            );
          })}
        </ul>
      </div>
      {renderCustomPWAInstallPrompt ? (
        <Button
          className="mx-4 mb-5 mt-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg"
          onClick={() => {
            if ('prompt' in renderCustomPWAInstallPrompt) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (renderCustomPWAInstallPrompt as any).prompt();
            }
          }}
        >
          <MdInstallMobile size={18} />
          Install App
        </Button>
      ) : null}
    </nav>
  );
};

const DashboardLayout: FunctionComponent = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const [renderCustomPWAInstallPrompt, setRenderCustomPWAInstallPrompt] = useState<Event | null>(null);
  const { contextSafe } = useGSAP();
  const handleSideBarOpen = contextSafe(() => {
    gsap
      .timeline()
      .to('#tessarus-sidebar', { x: '0%', duration: 0.3, ease: 'power2.inOut' })
      .to('#tessarus-sidebar-backdrop', { pointerEvents: 'all', duration: 0.3 }, '<');
  });
  const handleSideBarClose = contextSafe(() => {
    gsap
      .timeline()
      .to('#tessarus-sidebar', { x: '-100%', duration: 0.3, ease: 'power2.inOut' })
      .to('#tessarus-sidebar-backdrop', { pointerEvents: 'none', duration: 0.3 }, '<');
  });

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log(`'beforeinstallprompt' event was fired.`, e);
      // Prevents the default mini-infobar or install dialog from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setRenderCustomPWAInstallPrompt(e);
    });
  }, []);

  return (
    <RouteWrapper>
      <ProtectedLayout>
        <div className="gradient-background flex h-[100dvh] flex-col lg:flex-row">
          {/* header  */}
          <aside
            id="tessarus-sidebar-backdrop"
            aria-label="backdrop"
            className="pointer-events-none fixed z-[100] h-[100dvh] w-screen lg:hidden"
            onClick={handleSideBarClose}
          >
            <Sidebar classname="translate-x-[-100%]" handleClose={handleSideBarClose} renderCustomPWAInstallPrompt={renderCustomPWAInstallPrompt} />
          </aside>

          <aside className="hidden lg:flex lg:flex-col">
            <Sidebar hideClose renderCustomPWAInstallPrompt={renderCustomPWAInstallPrompt} />
          </aside>

          <main className="flex flex-1 flex-col">
            <header className="flex items-center justify-between border-default-300 px-4 py-5 text-default-600 md:px-6">
              <div className="flex gap-4 lg:hidden">
                <div className="flex cursor-pointer items-center justify-center transition-all hover:text-default-500">
                  <IoMenuOutline size={30} onClick={handleSideBarOpen} />
                </div>
                <div className="flex items-center gap-2">
                  <Image src={EspektroLogo} alt="Espektro Logo" width={30} height={30} className="rounded-full" />
                  <p className="text-xl xs:text-2xl">Tessarus</p>
                </div>
              </div>
              <div className="lg:ml-auto">
                {isLoggedIn && user ? (
                  <div className="flex items-center gap-6">
                    <p className="text-md hidden text-default-600 xs:flex">Hello, {user.name}</p>
                    <ProfileDropdown />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Button variant="light" className="hidden text-default-600 sm:flex" radius="sm">
                      Sign up
                    </Button>
                    <Button
                      color="primary"
                      radius="sm"
                      onClick={() => {
                        navigate(RoutePath.login());
                      }}
                    >
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </header>
            <section className="flex-1 border-red-400 p-4">
              <Outlet />
            </section>
            {/* footer */}
          </main>
        </div>
      </ProtectedLayout>
    </RouteWrapper>
  );
};

export default DashboardLayout;
