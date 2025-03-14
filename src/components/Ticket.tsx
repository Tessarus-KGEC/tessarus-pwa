// import useMediaQuery from '@/hooks/useMedia';
import { cn } from '@nextui-org/theme';
import React from 'react';
// import Barcode from 'react-barcode';
import { Button } from '@nextui-org/button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { IoMdShare } from 'react-icons/io';
import { IoLocationSharp } from 'react-icons/io5';
import QRCode from 'react-qr-code';
import { formateDate } from '../utils/formateDate';

interface ITicketProps {
  ticketId?: string;
  eventId: string;
  eventName: string;
  eventVenue: string;
  isCheckedIn?: boolean;
  eventStartDate: string;
  eventEndDate: string;
  teamName: string;
  teamMembers: string[];
  isTicketBooked: boolean;
}
const Ticket: React.FC<ITicketProps> = ({
  ticketId = '',
  eventId,
  eventName,
  eventVenue,
  eventStartDate,
  isCheckedIn = false,
  eventEndDate,
  teamName,
  teamMembers,
  isTicketBooked = false,
}) => {
  // const isExtraSmall = useMediaQuery('(max-width: 330px)');

  const handleTicketShare = async () => {
    try {
      const ticketElement = document.querySelector(`#ticket-section-${ticketId}`) as HTMLElement;
      if (!ticketElement) return;

      ticketElement.style.borderRadius = '0px';

      const canvas = await html2canvas(ticketElement as HTMLElement, {
        scale: 4,
      });

      const pageImg = canvas.toDataURL('image/jpeg', 1.0);

      const widthMargin = 150;
      const heightMargin = 500;
      const pdfWidth = canvas.width + 2 * widthMargin;
      const pdfHeight = canvas.height + 2 * heightMargin;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [pdfWidth, pdfHeight],
        compress: true,
      }); // orientation, unit, format

      pdf.setFillColor(11, 11, 13);

      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      pdf.setFontSize(80);
      pdf.setTextColor(236, 236, 236);
      pdf.text(`Hey! I'm sharing the ticket for \n${eventName} event \n\n`, widthMargin, 200);

      pdf.setTextColor(0, 107, 236);
      pdf.textWithLink('Click here to see updated ticket on Tessarus', widthMargin, 400, {
        url: `${window.location.origin}/dashboard/events/${eventId}#ticket-${ticketId}`,
      });

      pdf.addImage(
        pageImg, // img DataUrl
        'JPEG',
        widthMargin,
        600,
        canvas.width,
        canvas.height,
        undefined,
        'FAST',
      );

      pdf.setFontSize(60);
      pdf.setTextColor(236, 236, 236);
      pdf.text(
        `* For latest updates and timings, please check on tessarus, \nthis ticket might reflect stale data`,
        widthMargin,
        600 + canvas.height + 200,
      );

      const blob = pdf.output('blob');
      const ticketFile = new File([blob], `${eventName.replace(' ', '-')}-ticket-${ticketId}.pdf`, { type: 'application/pdf' });

      const shareData: ShareData = {
        title: 'Tessarus',
        text: `Hey! I'm sharing the ticket for ${eventName} event \n\n`,
        url: `${window.location.origin}/dashboard/events/${eventId}#ticket-${ticketId}`,
        files: [ticketFile],
      };

      if (!navigator.canShare) {
        toast.error('Web Share API is not supported in your browser');
        return;
      }
      if (!navigator.canShare(shareData)) {
        toast.error('Cannot share this ticket, issue with the data');
        return;
      }

      await navigator.share(shareData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // digesting the error
      return;
    }
  };

  return (
    <article id={`ticket-section-${ticketId}`} className="relative flex w-full flex-col rounded-2xl bg-default-100 font-mono xxs:max-w-[310px]">
      <div className="space-y-4 p-4">
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
        {isCheckedIn ? (
          <p className="absolute inset-0 z-0 flex rotate-[-45deg] select-none items-center justify-center text-6xl text-default-600 text-opacity-20">
            CHECKED
          </p>
        ) : isTicketBooked ? (
          <p className="absolute inset-0 z-0 flex rotate-[-45deg] select-none items-center justify-center text-6xl text-default-600 text-opacity-20">
            BOOKED
          </p>
        ) : null}
        <div className="space-y-5">
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
      <div
        className={cn(
          `relative flex items-center justify-center space-y-4 border-t-4 border-dotted border-default-300 p-4 before:absolute before:left-0 before:top-0 before:h-8 before:w-8 before:translate-x-[-50%] before:translate-y-[-50%] before:rounded-full before:bg-background after:absolute after:right-0 after:top-0 after:h-8 after:w-8 after:translate-x-[50%] after:translate-y-[-50%] after:rounded-full after:bg-background`,
        )}
      >
        {/* <Barcode
          value={ticketId}
          displayValue={true}
          fontSize={15}
          background="transparent"
          width={1}
          height={isExtraSmall ? 50 : 60}
          marginBottom={isExtraSmall ? 15 : 20}
        /> */}
        <QRCode
          value={JSON.stringify({
            ticketId,
            teamName,
            teamMembers,
          })}
          level="L"
          fgColor="#ccc"
          bgColor="transparent"
          size={200}
          className="m-4"
          strokeWidth={0.1}
        />
      </div>
      {ticketId !== '' ? (
        <Button data-html2canvas-ignore className="m-4" color="primary" onPress={handleTicketShare}>
          <IoMdShare size={20} />
          <p>share</p>
        </Button>
      ) : null}
    </article>
  );
};

export default Ticket;
