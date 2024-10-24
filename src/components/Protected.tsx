import { PublicPath, RoutePath } from '@/constants/route';
import { useAppDispatch, useAppSelector } from '@/redux';
import { useCurrentUserQuery } from '@/redux/api/user.slice';
import { logout, setCurrentUser, setCurrentUserWalletBalance, setIsLoggedIn, setToken } from '@/redux/reducers/auth.reducer';
import { getAPIErrorMessage } from '@/utils/api.helper';
import { getLocalStorageItem } from '@/utils/localStorage.helper';

import { Routes } from '@/types/route';
import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { authToken, user } = useAppSelector((state) => state.auth);

  const {
    data: response,
    isLoading,
    error,
    isError,
  } = useCurrentUserQuery(undefined, {
    refetchOnReconnect: true,
    skip: !authToken,
  });

  useEffect(() => {
    const token = getLocalStorageItem('accessToken');

    const isProtectedRoute = PublicPath.every((path) => !location.pathname.includes(path));

    if (!token && isProtectedRoute) {
      navigate(RoutePath.login());
      return;
    }

    dispatch(setToken(token));
    dispatch(setIsLoggedIn(!!token));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // permissions check
  useEffect(() => {
    if (!user) return;
    const matchedRoute = Object.entries(Routes).find(([, val]) => location.pathname.includes(val.slug));
    if (!matchedRoute) return;
    const routePermissions = matchedRoute[1].permissions;
    if (routePermissions.length === 0) return;
    const hasPermission = routePermissions.every((perm) => user.permissions.includes(perm));
    if (!hasPermission) {
      navigate(RoutePath.events());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, user]);

  useEffect(() => {
    if (isError) {
      toast.error(getAPIErrorMessage(error));
      dispatch(logout());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  useEffect(() => {
    if (!response) return;

    if (response.status === 200) {
      dispatch(setCurrentUser(response.data));
      dispatch(setCurrentUserWalletBalance(response.data.wallet));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, authToken]);

  if (isLoading) {
    return (
      <div className="fixed flex h-screen w-screen items-center justify-center gap-2">
        <Spinner width="25" />
        <p>Fetching user details ...</p>
      </div>
    );
  }
  if (error) {
    return <div>something went wrong</div>;
  }
  return children;
};

export default ProtectedLayout;
