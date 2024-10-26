import { FunctionComponent, useEffect } from 'react';
import useMediaQuery from '../hooks/useMedia';
import { useAppDispatch } from '../redux';
import { setNavbarHeaderTitle } from '../redux/reducers/route.reducer';

const Analytics: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    dispatch(setNavbarHeaderTitle(isMobile ? 'Analytics' : null));
  }, [isMobile, dispatch]);
  return <>{!isMobile ? <div>Analytics</div> : null}</>;
};

export default Analytics;
