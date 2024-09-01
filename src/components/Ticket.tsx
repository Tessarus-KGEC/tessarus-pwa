import useMediaQuery from '@/hooks/useMedia';
import React from 'react';
import Barcode from 'react-barcode';
import { IoLocationSharp } from 'react-icons/io5';
import { formateDate } from '../utils/formateDate';
interface ITicketProps {
  ticketId?: string;
  eventName: string;
  eventVenue: string;
  eventStartDate: string;
  eventEndDate: string;
  teamName: string;
  teamMembers: string[];
  isTicketBooked: boolean;
}
const Ticket: React.FC<ITicketProps> = ({
  ticketId = 'exampleticket_____1234567890',
  eventName,
  eventVenue,
  eventStartDate,
  eventEndDate,
  teamName,
  teamMembers,
  isTicketBooked = false,
}) => {
  const isExtraSmall = useMediaQuery('(max-width: 330px)');
  return (
    <article className="relative flex w-full flex-col rounded-2xl bg-default-100 font-mono xxs:max-w-[310px]">
      <div className="m-2 flex justify-center rounded-xl bg-primary">
        <Barcode
          value={ticketId}
          displayValue={true}
          fontSize={15}
          background="transparent"
          width={1}
          height={isExtraSmall ? 50 : 60}
          marginBottom={isExtraSmall ? 15 : 20}
        />
      </div>
      <div
        className={`relative space-y-4 border-t-4 border-dotted border-default-300 p-4 before:absolute before:left-0 before:top-0 before:h-8 before:w-8 before:translate-x-[-50%] before:translate-y-[-50%] before:rounded-full before:bg-background after:absolute after:right-0 after:top-0 after:h-8 after:w-8 after:translate-x-[50%] after:translate-y-[-50%] after:rounded-full after:bg-background`}
      >
        <h2 className="mb-6 max-w-[280px] text-2xl">{eventName}</h2>
        <div className="flex">
          <div className="flex-1 space-y-2 font-mono">
            <p className="px-2 text-sm text-default-500">FROM</p>
            <div className="border-r-[0.5px] border-t-1 border-default-300 p-2 text-xs text-default-600">
              {formateDate(eventStartDate, {
                weekday: 'short',
                removeDay: true,
              })}
            </div>
          </div>
          <div className="flex-1 space-y-2 font-mono">
            <p className="px-2 text-sm text-default-500">TO</p>
            <div className="border-t-1 border-default-300 p-2 text-xs text-default-600">
              {formateDate(eventEndDate, {
                weekday: 'short',
                removeDay: true,
              })}
            </div>
          </div>
        </div>
        <p className="flex items-center gap-2 rounded-xl bg-primary bg-opacity-30 p-2 font-mono text-sm text-foreground">
          <IoLocationSharp />
          <span>{eventVenue}</span>
        </p>
      </div>
      <div
        className={`relative border-t-4 border-dotted border-default-300 p-4 before:absolute before:left-0 before:top-0 before:h-8 before:w-8 before:translate-x-[-50%] before:translate-y-[-50%] before:rounded-full before:bg-background after:absolute after:right-0 after:top-0 after:h-8 after:w-8 after:translate-x-[50%] after:translate-y-[-50%] after:rounded-full after:bg-background`}
      >
        {isTicketBooked ? (
          <p className="absolute inset-0 z-0 flex rotate-[-45deg] items-center justify-center text-6xl text-default-600 text-opacity-20">BOOKED</p>
        ) : null}
        <div className="mb-6 space-y-5">
          <div className="space-y-2">
            <p className="w-fit border-b-1 border-default-500 pb-2 pr-6 font-mono text-sm text-default-500">Team name</p>
            <p className="text-lg font-semibold">{teamName}</p>
          </div>
          <div className="space-y-3">
            <p className="w-fit border-b-1 border-default-500 pb-2 pr-6 font-mono text-sm text-default-500">Team members</p>
            <ul>
              {teamMembers.map((member, index) => (
                <li key={index} className="font-mono text-medium text-default-600">
                  {member}
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
