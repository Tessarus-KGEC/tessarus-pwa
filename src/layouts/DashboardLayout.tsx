import Coin from '@/assets/coin.png';
import EspektroLogo from '@/assets/logo/Espektro logo fill.svg';
import ProtectedLayout from '@/components/Protected';
import { RoutePath } from '@/constants/route';
import { useAppDispatch, useAppSelector } from '@/redux';
import { logout, setCurrentUser } from '@/redux/reducers/auth.reducer';
import RouteWrapper from '@/redux/RouteWrapper';
import { Route, Routes } from '@/types/route';
import { useGSAP } from '@gsap/react';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Chip, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import gsap from 'gsap';
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IoClose,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoInformationCircle,
  IoMenuOutline,
  IoScanOutline,
  IoTicketOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { MdEdit, MdExitToApp, MdInstallMobile, MdLeaderboard, MdOutlineAdminPanelSettings, MdOutlineEvent } from 'react-icons/md';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import FileUploader from '../components/ImageUploader';
import { PointsDescriptionMap } from '../constants';
import useMediaQuery from '../hooks/useMedia';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { User } from '../types/app.type';
import { useUpdateUserDetailsMutation } from '../redux/api/user.slice';

gsap.registerPlugin(useGSAP);

const DetailsCard = ({ title, description }: { title: string; description: string }) => {
  const [editForm, setEditForm] = useState(false);
  return (
    <div className="flex">
      {editForm ? (
        <div className="flex w-full flex-col gap-y-4">
          <Input radius="sm" label={title} labelPlacement={'outside'} defaultValue={description} />
          <div className="flex justify-end gap-x-2">
            <Button color="danger" variant="flat" onClick={() => setEditForm(false)}>
              Cancel
            </Button>
            <Button color="primary">Save</Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full space-x-2">
          <div className="w-full space-y-1">
            <p className="text-xs">{title}</p>
            <p className="text-foreground-500">{description}</p>
          </div>
          {/* <button className="text-sm text-blue-500" onClick={() => setEditForm(true)}>
            Edit
          </button> */}
        </div>
      )}
    </div>
  );
};

const ProfileImageCard = ({ url }: { url: string }) => {
  const [editImage, setEditImage] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const { authToken, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  async function handleFileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    if (!user) return;
    try {
      setIsImageUploading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/upload-profile-image`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        toast.success('Image uploaded successfully');
        setIsImageUploading(false);
        dispatch(
          setCurrentUser({
            ...user,
            profileImageUrl: response.data.data.profileImageUrl,
          }),
        );
        setEditImage(false);
      }
    } catch (error) {
      toast.error('Error uploading image');
    }
  }

  return (
    <>
      {editImage ? (
        <div>
          {profilePic ? (
            <div className="group relative w-fit">
              <div
                className="absolute right-4 top-4 z-10 w-fit"
                onClick={() => {
                  setProfilePic(null);
                }}
              >
                <IoClose size={25} className="cursor-pointer" />
              </div>
              <img
                src={URL.createObjectURL(profilePic)}
                alt="profile image"
                className="aspect-square w-[150px] rounded-full object-cover transition-all group-hover:opacity-60"
              />
            </div>
          ) : (
            <FileUploader
              acceptedFileTypes={['Image']}
              onFileDrop={(files) => {
                setProfilePic(files[0]);
              }}
              classname="bg-default-100 w-[150px] text-sm aspect-square rounded-full flex items-center justify-center flex-col"
            />
          )}
          <div className="mt-4 flex justify-center gap-x-2">
            <Button size="sm" color="danger" variant="flat" onClick={() => setEditImage(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              isLoading={isImageUploading}
              color="primary"
              onPress={async () => {
                if (!profilePic) return;
                await handleFileUpload(profilePic);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Image alt="profile" radius="full" src={url} className="aspect-square w-[150px] object-cover" />
          <button
            className="absolute bottom-[-12px] right-[10px] z-50 flex aspect-square items-center gap-x-2 rounded-full bg-default-50 px-3"
            onClick={() => setEditImage(true)}
          >
            <MdEdit size={20} />
          </button>
        </div>
      )}
    </>
  );
};

const ViewProfileModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (value: boolean) => void }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [handleUpdateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();

  const [isEditting, setIsEditting] = useState(false);

  const editableParams: {
    title: string;
    key: keyof User;
  }[] = [
    {
      title: 'Name',
      key: 'name',
    },

    {
      title: 'Email',
      key: 'email',
    },

    {
      title: 'Phone',
      key: 'phone',
    },

    {
      title: 'College',
      key: 'college',
    },
  ];

  const { register, watch, getValues } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      college: user?.college,
    },
  });

  const formValues = watch();

  if (!user) return;


  return (
    <Modal size="sm" isOpen={isOpen} onOpenChange={(value) => {
      onOpenChange(value);
      setIsEditting(false);

    }} className="max-w-[350px] bg-default-50 text-default-foreground dark">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Profile</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-end">
                  <ProfileImageCard url={user.profileImageUrl} />
                </div>
                {isEditting ? (
                  <div className="mt-6 w-full space-y-10">
                    {editableParams.map((param) => (
                      <Input
                        radius="sm"
                        labelPlacement="outside"
                        type="text"
                        label={param.title}
                        defaultValue={user[param.key] as string}
                        {...register(param.key as keyof typeof formValues)}
                        classNames={{
                          input: 'text-[14px]',
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 w-full space-y-6">
                    {editableParams.map((param) => (
                      <DetailsCard title={param.title} description={user[param.key] as string} />
                    ))}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex flex-col gap-y-4">
              {isEditting ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="flat"
                    className="flex-1"
                    onClick={() => {
                      setIsEditting(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={isLoading}
                    color="primary"
                    className="flex-1"
                    onClick={async () => {
                      const response = await handleUpdateUserDetails(getValues());
                      if (response.data?.status === 200) {
                        dispatch(
                          setCurrentUser({
                            ...user,
                            name: response.data.data.name,
                            email: response.data.data.email,
                            phone: response.data.data.phone,
                            college: response.data.data.college,
                          }),
                        );
                        setIsEditting(false)
                      }
                    }}
                  >
                    Save changes
                  </Button>
                </div>
              ) : (
                <Button
                  color="primary"
                  className="mt-4 w-full"
                  onClick={async () => {
                    setIsEditting(true);
                  }}
                  startContent={<MdEdit size={20} />}
                >
                  Edit details
                </Button>
              )}
              <Button
                variant="flat"
                color="danger"
                className="w-full"
                onClick={async () => {
                  await new Promise((resolve) => {
                    dispatch(logout());
                    resolve(0);
                  });
                  window.location.href = RoutePath.login();
                }}
                startContent={<MdExitToApp size={18} />}
              >
                Log Out
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
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
        status: 'active',
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
        status: 'active',
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
    <>
      <nav
        id="tessarus-sidebar"
        className={`flex h-full w-[280px] flex-col gap-4 rounded-br-lg rounded-tr-lg border-red-400 text-default-600 xs:w-[300px] ${classname}
        bg-[rgba(60,52,67,0.2)] rounded-2xl shadow-lg shadow-black/10 backdrop-blur-[6.5px]
        `}
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
        <div className="mb-4 mt-auto px-4">
          {user ? (
            <div className="flex gap-2 rounded-2xl border-default bg-foreground-100 p-3 hover:cursor-pointer">
              <Avatar radius="sm" color="secondary" src={user.profileImageUrl} size="lg" />
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
            className="mx-4 mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg"
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
    </>
  );
};

const DashboardLayout: FunctionComponent = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const { navHeaderTitle } = useAppSelector((state) => state.route);
  const [renderCustomPWAInstallPrompt, setRenderCustomPWAInstallPrompt] = useState<Event | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isViewProfileModal, setIsViewProfileModel] = useState(false);

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
        <div className="flex h-[100dvh] flex-col lg:flex-row">
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
                    <Avatar
                      radius="full"
                      color="secondary"
                      src={user?.profileImageUrl}
                      className="h-9 w-9 cursor-pointer"
                      onClick={() => {
                        setIsViewProfileModel(true);
                      }}
                    />
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
              <ViewProfileModal isOpen={isViewProfileModal} onOpenChange={(value) => setIsViewProfileModel(value)} />
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
                  {Object.values(PointsDescriptionMap).map((info) => (
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
