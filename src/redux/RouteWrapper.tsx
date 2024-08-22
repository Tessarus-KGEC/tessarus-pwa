import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '.';
import { setActiveRoute } from './reducers/route.reducer';

const RouteWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setActiveRoute(location.pathname));
  }, [location.pathname, dispatch]);
  return children;
};

export default RouteWrapper;
