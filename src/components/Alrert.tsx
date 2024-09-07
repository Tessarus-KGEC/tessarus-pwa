import React, { useMemo } from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { IoWarningOutline } from 'react-icons/io5';
import { MdErrorOutline } from 'react-icons/md';

const Alrert: React.FC<{
  title: string;
  message: string;
  type: 'success' | 'danger' | 'warning';
}> = ({ title, message, type }) => {
  const variant = useMemo(() => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success-300 bg-opacity-15 text-success-400',
          icon: <IoMdCheckmarkCircleOutline size={22} />,
        };
      case 'danger':
        return {
          bg: 'bg-danger-300 bg-opacity-15 text-danger-400',
          icon: <MdErrorOutline size={22} />,
        };
      case 'warning':
        return {
          bg: 'bg-warning-300 bg-opacity-15 text-warning-400',
          icon: <IoWarningOutline size={22} />,
        };
      default:
        return {
          bg: 'bg-success-300 bg-opacity-15 text-success-400',
          icon: <IoMdCheckmarkCircleOutline size={22} />,
        };
    }
  }, [type]);
  return (
    <article className={`${variant.bg} flex items-center gap-2 rounded-xl px-2 py-3`}>
      <div className="flex h-full w-10 items-center justify-center">{variant.icon}</div>
      <div className="mt-0">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm">{message}</p>
      </div>
    </article>
  );
};

export default Alrert;
