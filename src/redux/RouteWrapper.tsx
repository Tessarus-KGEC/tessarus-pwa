'use client';

import { PublicPath } from '@/constants/route';
import { RouteQuery } from '@/types/route';
import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '.';
import { Query, setActiveRoute, setRouteQuery } from './reducers/route.reducer';

const RouteWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { routeQuery } = useAppSelector((state) => state.route);
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // after refresh, setting up the states from the url again
  useEffect(() => {
    const tab = searchParams.get(RouteQuery.TAB) as Query[RouteQuery.TAB];
    dispatch(setActiveRoute(location.pathname));
    dispatch(
      setRouteQuery(
        tab
          ? {
              tab,
            }
          : null,
      ),
    );
  }, [location.pathname, dispatch, searchParams]);

  // setting search params with change in route query
  useEffect(() => {
    const isProtectedRoute = PublicPath.every((path) => !location.pathname.includes(path));

    // for protected route unauthorize access should lead to login, no need for search params
    if (isProtectedRoute && !isLoggedIn) return;

    if (routeQuery) {
      setSearchParams({
        [RouteQuery.TAB]: routeQuery.tab,
      });

      // const params = new URLSearchParams(Array.from(searchParams.entries()));
      // params.set(RouteQuery.TAB, routeQuery.tab);

      // const newUrl = `${location.pathname}?${params.toString()}`;

      // // router.push(newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeQuery, location.pathname, searchParams, isLoggedIn]);

  return children;
};

export default RouteWrapper;
