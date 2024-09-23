import { FunctionComponent, useCallback, useState } from 'react';

import { IoAddCircleOutline, IoDownloadOutline, IoGiftOutline, IoShareOutline } from 'react-icons/io5';

const tabs = [
  {
    key: 'wallet-add-amount',
    title: 'Add Amount',
    icon: <IoAddCircleOutline size={25} />,
  },
  {
    key: 'wallet-transfer-amount',
    title: 'Transfer Amount',
    icon: <IoShareOutline size={25} />,
  },
  {
    key: 'wallet-withdrawal-amount',
    title: 'Withdraw Amount',
    icon: <IoDownloadOutline size={25} />,
  },
  {
    key: 'wallet-redeem-amount',
    title: 'Redeem Code',
    icon: <IoGiftOutline size={25} />,
  },
];

const Wallet: FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const renderTabs = useCallback(
    (tab: (typeof tabs)[number]) => {
      return (
        <div
          key={tab.key}
          className={`flex min-w-[150px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-8 ${activeTab === tab.key ? 'bg-default-200' : 'bg-default-50 text-default-500'}`}
          onClick={() => setActiveTab(tab.key)}
        >
          <p>{tab.icon}</p>
          <p className="text-center">{tab.title}</p>
        </div>
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [activeTab],
  );

  const renderActiveTab = useCallback(() => {
    switch (activeTab) {
      case 'wallet-add-amount':
        return <div>Add Amount</div>;
      case 'wallet-transfer-amount':
        return <div>Transfer Amount</div>;
      case 'wallet-withdrawal-amount':
        return <div>Withdraw Amount</div>;
      case 'wallet-redeem-amount':
        return <div>Redeem Amount</div>;
      default:
        return <div>Default</div>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <section className="h-full flex-col space-y-4 px-4 pb-6">
      <h1 className="text-2xl">My Wallet</h1>
      <div className="w-full space-y-2 rounded-xl bg-primary p-4 xs:max-w-[300px]">
        <h2 className="text-sm">Wallet Balance</h2>
        <p className="text-4xl">₹10,000</p>
        <p className="text-sm">View transactions</p>
      </div>
      <div className="flex w-full flex-wrap gap-4 overflow-hidden rounded-xl">{tabs.map((tab) => renderTabs(tab))}</div>
      <div>{renderActiveTab()}</div>
    </section>
  );
};

export default Wallet;
