import Coin from '@/assets/coin.png';
import EspektroLogo from '@/assets/logo/Espektro logo fill.svg';
import ProtectedLayout from '@/components/Protected';
import { RoutePath } from '@/constants/route';
import { useAppDispatch, useAppSelector } from '@/redux';
import { logout } from '@/redux/reducers/auth.reducer';
import RouteWrapper from '@/redux/RouteWrapper';
import { Route, Routes } from '@/types/route';
import { useGSAP } from '@gsap/react';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Chip, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import gsap from 'gsap';
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IoCloseOutline,
  IoDocumentTextOutline,
  IoInformationCircle,
  IoMenuOutline,
  IoScanOutline,
  IoTicketOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { MdInstallMobile, MdLeaderboard, MdOutlineAdminPanelSettings, MdOutlineEvent } from 'react-icons/md';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PointsDescriptionMap } from '../constants';
import useMediaQuery from '../hooks/useMedia';

gsap.registerPlugin(useGSAP);

const ProfileDropdown = () => {
  const dispatch = useAppDispatch();

  return (
    <Dropdown className="text-foreground dark">
      <DropdownTrigger>
        <Avatar isBordered radius="full" color="secondary" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="h-9 w-9 cursor-pointer" />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {/* <DropdownItem key="profile">Profile</DropdownItem>
        <DropdownItem key="event">Events</DropdownItem>
        <DropdownItem key="ticket">Tickets</DropdownItem> */}
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
  const navigate = useNavigate();
  const { activeRoute } = useAppSelector((state) => state.route);
  const { user } = useAppSelector((state) => state.auth);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isActiveRoute = useCallback((slug: string) => activeRoute === slug, [activeRoute]);

  const navlinks = useMemo(
    () => [
      {
        title: 'Events',
        route: Route.EVENTS,
        status: 'active',
        slug: Routes[Route.EVENTS].slug,
        icon: <MdOutlineEvent size={20} />,
        permissions: Routes[Route.EVENTS].permissions,
        protected: false,
      },
      {
        title: 'Check in',
        route: Route.CHECKIN,
        status: isMobile ? 'active' : 'inactive',
        slug: Routes[Route.CHECKIN].slug,
        icon: <IoScanOutline size={20} />,
        permissions: Routes[Route.CHECKIN].permissions,
        protected: true,
      },
      {
        title: 'Registered events',
        route: `${Route.EVENTS}/${Route.REGISTERED_EVENTS}`,
        status: 'active',
        slug: Routes[Route.REGISTERED_EVENTS].slug,
        icon: <IoTicketOutline size={20} />,
        permissions: Routes[Route.REGISTERED_EVENTS].permissions,
        protected: true,
      },
      {
        title: 'Wallet',
        route: Route.WALLET,
        status: isMobile ? 'active' : 'inactive',
        slug: Routes[Route.WALLET].slug,
        icon: <IoWalletOutline size={20} />,
        permissions: Routes[Route.WALLET].permissions,
        protected: true,
      },
      // {
      //   title: 'Analytics',
      //   route: Route.ANALYTICS,
      //   status: isMobile ? 'inactive' : 'active',
      //   slug: Routes[Route.ANALYTICS].slug,
      //   icon: <IoAnalyticsOutline size={20} />,
      //   permissions: Routes[Route.ANALYTICS].permissions,
      //   protected: true,
      // },
      {
        title: 'Leaderboard',
        route: Route.LEADERBOARD,
        status: isMobile ? 'inactive' : 'active',
        slug: Routes[Route.LEADERBOARD].slug,
        icon: <MdLeaderboard size={20} />,
        permissions: Routes[Route.LEADERBOARD].permissions,
        protected: true,
      },
      {
        title: 'Transactions',
        route: Route.TRANSACTIONS,
        status: isMobile ? 'inactive' : 'active',
        slug: Routes[Route.TRANSACTIONS].slug,
        icon: <IoDocumentTextOutline size={20} />,
        permissions: Routes[Route.TRANSACTIONS].permissions,
        protected: true,
      },
      {
        title: 'User management',
        route: Route.USER_MANAGEMENT,
        status: isMobile ? 'inactive' : 'active',
        slug: Routes[Route.USER_MANAGEMENT].slug,
        icon: <MdOutlineAdminPanelSettings size={20} />,
        permissions: Routes[Route.USER_MANAGEMENT].permissions,
        protected: true,
      },
    ],
    [isMobile],
  );

  return (
    <nav
      id="tessarus-sidebar"
      className={`flex h-full w-[280px] flex-col gap-4 rounded-br-lg rounded-tr-lg border-red-400 text-default-600 backdrop-blur-sm dark:bg-default-50 xs:w-[300px] ${classname}`}
    >
      <div className="flex justify-between gap-4 px-4 py-5 md:px-6">
        <div className="flex items-center gap-2 hover:cursor-pointer" onClick={() => navigate('/dashboard/events')}>
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
            if (link.protected && !user) return null;
            if (link.status === 'inactive') return null;
            if (user && !link.permissions.every((permission) => user.permissions.includes(permission))) return null;
            return (
              <Link key={link.route} to={`/dashboard/${link.route}`}>
                <div
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 ${isActiveRoute(link.slug) ? 'bg-default-200 text-default-600' : 'text-default-500'} hover:bg-default-200 hover:text-default-600`}
                >
                  <span>{link.icon}</span>
                  {link.title}
                </div>
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="mb-2 mt-auto px-4">
        {user ? (
          <div className="flex gap-2 rounded-2xl border-default bg-foreground-100 p-3 hover:cursor-pointer">
            <Avatar radius="sm" color="secondary" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="lg" />
            <div className="space-y-1">
              <p>{user.name}</p>
              <div className="flex gap-2">
                <Chip
                  startContent={<img src={Coin} className="mr-1 aspect-square h-[20px] w-[20px] !blur-none" />}
                  variant="flat"
                  size="sm"
                  className="h-6"
                >
                  {user.score} XP
                </Chip>
                <PointsInfoModal />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {renderCustomPWAInstallPrompt ? (
        <Button
          className="mx-4 mb-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg"
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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const { navHeaderTitle } = useAppSelector((state) => state.route);
  const [renderCustomPWAInstallPrompt, setRenderCustomPWAInstallPrompt] = useState<Event | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');

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

  useEffect(() => {
    if (containerRef.current) {
      console.log('scrolling to top');
      containerRef.current.scroll(0, 0);
    }
  }, [pathname]);

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

          <main className="flex max-h-full flex-1 flex-col overflow-y-hidden">
            <header className="flex items-center justify-between border-default-300 px-4 py-5 text-default-600 md:px-6">
              <div className="flex gap-4 lg:hidden">
                <div className="flex cursor-pointer items-center justify-center transition-all hover:text-default-500">
                  <IoMenuOutline size={30} onClick={handleSideBarOpen} />
                </div>
                <div className="flex items-center gap-2">
                  {!isMobile ? <Image src={EspektroLogo} alt="Espektro Logo" width={30} height={30} className="rounded-full" /> : null}

                  <p className="text-xl xs:text-2xl">{navHeaderTitle}</p>
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
            <section ref={containerRef} className="flex-1 overflow-auto scroll-smooth">
              <Outlet />
            </section>
            {/* footer */}
          </main>
        </div>
      </ProtectedLayout>
    </RouteWrapper>
  );
};

const PointsInfoModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IoInformationCircle size={22} onClick={() => setOpen(true)} />
      <Modal isOpen={open} onOpenChange={setOpen} backdrop={'opaque'} className="bg-default-50 text-default-foreground dark">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Types of points</ModalHeader>
              <ModalBody>
                <ul className="!ml-2 !list-disc">
                  {Object.entries(PointsDescriptionMap).map(([_, info]) => (
                    <li className="text-md mt-2 text-default-600">{info}</li>
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DashboardLayout;
