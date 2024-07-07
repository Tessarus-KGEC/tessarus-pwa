'use client';

import { PublicPath } from '@/constants/route';
import { RouteQuery } from '@/types/route';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { Query, setActiveRoute, setRouteQuery } from './reducers/route.reducer';

const RouteWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { routeQuery } = useAppSelector((state) => state.route);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // after refresh, setting up the states from the url again
  useEffect(() => {
    const tab = searchParams.get(RouteQuery.TAB) as Query[typeof RouteQuery.TAB];
    dispatch(setActiveRoute(pathname));
    dispatch(
      setRouteQuery(tab ? {
        tab,
      } : null),
    );
  }, [pathname, dispatch, searchParams]);

  // setting search params with change in route query
  useEffect(() => {
    const isProtectedRoute = PublicPath.every((path) => !pathname.includes(path));

    // for protected route unauthorize access should lead to login, no need for search params
    if (isProtectedRoute && !isLoggedIn) return;

    if (routeQuery) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set(RouteQuery.TAB, routeQuery.tab);

      const newUrl = `${pathname}?${params.toString()}`;

      router.push(newUrl);
    }
  }, [routeQuery, pathname, searchParams, router, isLoggedIn]);

  return children;
};

export default RouteWrapper;

// useEffect(() => {
//   const isProtectedRoute = PublicPath.every((path) => !pathname.includes(path));

//   // for protected route unauthorize access should lead to login, no need for search params
//   if (isProtectedRoute && !isLoggedIn) return;

//   const currentPath = Object.keys(DefaultTab)
//     .filter((key) => pathname.includes(key)) as Array<keyof typeof DefaultTab>;

//   if (currentPath && currentPath.length > 0) {
//     // if there is already tab in the url, then there is no need
//     // to insert the default search params
//     // skip the url update
//     const tabValue = searchParams.get(RouteQuery.TAB);
//     if (DefaultTab[currentPath[0]] === tabValue) return;

//     const params = new URLSearchParams(Array.from(searchParams.entries()));
//     params.set(RouteQuery.TAB, DefaultTab[currentPath[0]]);

//     const newUrl = `${pathname}?${params.toString()}`;

//     router.push(newUrl);
//     // console.log(newUrl);
//     dispatch(setRouteQuery({
//       [RouteQuery.TAB]: DefaultTab[currentPath[0]],
//     }));
//   }
// // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [pathname, searchParams, router, isLoggedIn]);
