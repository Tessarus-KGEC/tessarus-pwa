import React, { useEffect } from 'react';
import useMediaQuery from '../../hooks/useMedia';
import { useAppDispatch } from '../../redux';
import { setNavbarHeaderTitle } from '../../redux/reducers/route.reducer';

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    dispatch(setNavbarHeaderTitle(isMobile ? 'Transactions' : null));
  }, [isMobile, dispatch]);
  return <div>{!isMobile ? <div>Transactions</div> : null}</div>;
};

export default Transactions;
