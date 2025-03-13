import { FunctionComponent, useEffect, useState } from 'react';

import { Input } from '@nextui-org/input';
import { Button, Chip } from '@nextui-org/react';
import toast from 'react-hot-toast';
import useMediaQuery from '../../hooks/useMedia';
import useRazorpayPG from '../../hooks/useRazorpayPG';
import { useAppDispatch, useAppSelector } from '../../redux';
import { useAddAmountMutation } from '../../redux/api/wallet.slice';
import { setCurrentUserWalletBalance } from '../../redux/reducers/auth.reducer';
import { setNavbarHeaderTitle } from '../../redux/reducers/route.reducer';

// const tabs = [
//   // {
//   //   key: 'wallet-add-amount',
//   //   title: 'Add Amount',
//   //   icon: <IoAddCircleOutline size={25} />,
//   // },
//   // {
//   //   key: 'wallet-transfer-amount',
//   //   title: 'Transfer Amount',
//   //   icon: <IoShareOutline size={25} />,
//   // },
//   // {
//   //   key: 'wallet-withdrawal-amount',
//   //   title: 'Withdraw Amount',
//   //   icon: <IoDownloadOutline size={25} />,
//   // },
//   // {
//   //   key: 'wallet-redeem-amount',
//   //   title: 'Redeem Code',
//   //   icon: <IoGiftOutline size={25} />,
//   // },
// ];

const Wallet: FunctionComponent = () => {
  const { walletBalance } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // const [activeTab, setActiveTab] = useState(tabs[0].key);

  // const renderTabs = useCallback(
  //   (tab: (typeof tabs)[number]) => {
  //     return (
  //       <div
  //         key={tab.key}
  //         className={`flex min-w-[150px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-8 xl:max-w-[300px] ${activeTab === tab.key ? 'bg-default-200' : 'bg-default-50 text-default-500'}`}
  //         onClick={() => setActiveTab(tab.key)}
  //       >
  //         <p>{tab.icon}</p>
  //         <p className="text-center">{tab.title}</p>
  //       </div>
  //     );
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   },
  //   [activeTab],
  // );

  // const renderActiveTab = useCallback(() => {
  //   switch (activeTab) {
  //     case 'wallet-add-amount':
  //       return <AddAmountTab />;
  //     case 'wallet-transfer-amount':
  //       return <div>Transfer Amount</div>;
  //     case 'wallet-withdrawal-amount':
  //       return (
  //         <div>
  //           <Alrert title="Not supported" message="We currently don't support this feature" type="warning" />
  //         </div>
  //       );
  //     case 'wallet-redeem-amount':
  //       return (
  //         <div>
  //           <Alrert title="Not supported" message="We currently don't support this feature" type="warning" />
  //         </div>
  //       );
  //     default:
  //       return <div>Default</div>;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeTab]);

  useEffect(() => {
    dispatch(setNavbarHeaderTitle(isMobile ? 'Wallet' : null));
  }, [isMobile, dispatch]);

  return (
    <section>
      <section className="h-full flex-col space-y-4 px-4 pb-6">
        {!isMobile ? <h1 className="text-2xl">My Wallet</h1> : null}
        <div className="w-full space-y-2 rounded-xl bg-primary p-4 xs:max-w-[300px] !mb-10">
          <h2 className="text-sm">Wallet Balance</h2>
          <p className="text-4xl">₹{walletBalance}</p>
          {/* <p className="text-sm">View transactions</p> */}
        </div>
        {/* <div className="flex w-full flex-wrap gap-4 overflow-hidden rounded-xl">{tabs.map((tab) => renderTabs(tab))}</div> */}
        <AddAmountTab />
        {/* <div>{renderActiveTab()}</div> */}
      </section>
    </section>
  );
};

function AddAmountTab() {
  const [amount, setAmount] = useState(1);
  const { handlePaymentGatewayRender, isPaymentLoading } = useRazorpayPG();
  const [handleWalletAddAmount, { isLoading: isAddAmountLoading }] = useAddAmountMutation();
  const dispatch = useAppDispatch();

  async function handleRecharge() {
    try {
      await handlePaymentGatewayRender({
        amount,
        description: 'Wallet recharge',
        orderType: 'wallet',
        paymentSuccessCallback: async (transactionId) => {
          const response = await handleWalletAddAmount({
            amount,
            transactionId,
          });
          if (response.data?.status === 200) {
            dispatch(setCurrentUserWalletBalance(response.data.data.amount));
            toast.success('Wallet recharged successfully');
            setAmount(0);
          }
        },
      });
    } catch (error) {
      setAmount(0);
      toast.error('Wallet recharge failed');
      return;
    }
  }
  return (
    <div className="space-y-6 pt-2">
      <Input
        isRequired
        min={1}
        type="number"
        label="Amount ( ₹ )"
        labelPlacement="outside"
        placeholder="Enter recharge amount"
        required
        size="lg"
        className="w-full xl:max-w-[300px]"
        value={String(amount)}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className="space-x-2">
        {[50, 100, 200].map((amount) => (
          <Chip variant="bordered" radius="lg" size="lg" className="cursor-pointer px-4 py-4" onClick={() => setAmount(amount)}>
            + {amount}
          </Chip>
        ))}
      </div>

      <Button
        isLoading={isAddAmountLoading || isPaymentLoading}
        color="primary"
        className="w-full flex-1 text-center font-semibold xl:max-w-[300px]"
        onClick={handleRecharge}
      >
        Recharge
      </Button>
    </div>
  );
}

export default Wallet;
