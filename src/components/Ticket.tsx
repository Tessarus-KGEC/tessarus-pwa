import React from 'react';
import Barcode from 'react-barcode';
import { IoLocationSharp } from 'react-icons/io5';
import { formateDate } from '../utils/formateDate';
const Ticket: React.FC = () => {
  return (
    <article className="relative flex w-[335px] flex-col rounded-2xl bg-default-100 font-mono">
      <div className="m-2 rounded-xl bg-primary">
        <Barcode
          value="exampleticket_____1234567890"
          displayValue={true}
          fontSize={15}
          background="transparent"
          width={1}
          height={60}
          marginBottom={20}
        />
      </div>
      <div
        className={`relative space-y-4 border-t-4 border-dotted border-default-300 p-4 before:absolute before:left-0 before:top-0 before:h-8 before:w-8 before:translate-x-[-50%] before:translate-y-[-50%] before:rounded-full before:bg-background after:absolute after:right-0 after:top-0 after:h-8 after:w-8 after:translate-x-[50%] after:translate-y-[-50%] after:rounded-full after:bg-background`}
      >
        <h2 className="mb-6 max-w-[280px] text-3xl">Creative Horizons Expo</h2>
        <div className="flex">
          <div className="flex-1 space-y-2 font-mono">
            <p className="px-2 text-sm text-default-500">FROM</p>
            <div className="border-r-[0.5px] border-t-1 border-default-300 p-2 text-xs text-default-600">
              {formateDate(new Date().toISOString(), {
                weekday: 'short',
                removeDay: true,
              })}
            </div>
          </div>
          <div className="flex-1 space-y-2 font-mono">
            <p className="px-2 text-sm text-default-500">TO</p>
            <div className="border-t-1 border-default-300 p-2 text-xs text-default-600">
              {formateDate(new Date().toISOString(), {
                weekday: 'short',
                removeDay: true,
              })}
            </div>
          </div>
        </div>
        <p className="flex items-center gap-2 rounded-xl bg-primary bg-opacity-30 p-2 font-mono text-sm text-foreground">
          <IoLocationSharp />
          <span>Admin building ground</span>
        </p>
      </div>
      <div
        className={`relative border-t-4 border-dotted border-default-300 p-4 before:absolute before:left-0 before:top-0 before:h-8 before:w-8 before:translate-x-[-50%] before:translate-y-[-50%] before:rounded-full before:bg-background after:absolute after:right-0 after:top-0 after:h-8 after:w-8 after:translate-x-[50%] after:translate-y-[-50%] after:rounded-full after:bg-background`}
      >
        <p className="absolute inset-0 z-0 flex rotate-[-45deg] items-center justify-center text-6xl text-default-600 text-opacity-20">BOOKED</p>
        <div className="mb-6 space-y-5">
          <div className="space-y-2">
            <p className="w-fit border-b-1 border-default-500 pb-2 pr-6 font-mono text-sm text-default-500">Team name</p>
            <p className="text-xl font-semibold">The Techies</p>
          </div>
          <div className="space-y-3">
            <p className="w-fit border-b-1 border-default-500 pb-2 pr-6 font-mono text-sm text-default-500">Team members</p>
            <ul>
              {['John Doe', 'Krishenndu dakshi', 'Krishna Bose', 'Sourav Dakshi'].map((data, index) => (
                <li key={index} className="font-mono text-medium text-default-600">
                  {data}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Ticket;
