import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader, Chip } from '@nextui-org/react';
import React from 'react';
import { IoCalendar, IoLocationSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import ImageComponent from '../../../components/Image';
import { RoutePath } from '../../../constants/route';
import { EventResponse } from '../../../types/response.type';
import { formateDate } from '../../../utils/formateDate';

interface IProps {
  isFromKGEC?: boolean;
  event: Pick<
    EventResponse,
    | '_id'
    | 'title'
    | 'description'
    | 'status'
    | 'eventPrice'
    | 'eventPriceForKGEC'
    | 'startTime'
    | 'endTime'
    | 'eventVenue'
    | 'eventThumbnailImage'
    | 'eventType'
    | 'eventOrganiserClub'
  >;
}

const EventCard: React.FC<IProps> = ({ event, isFromKGEC }) => {
  const navigate = useNavigate();
  return (
    <Card className="h-full bg-none">
      <CardHeader>
        <ImageComponent
          // className="aspect-video w-full rounded-lg object-cover group-hover:scale-105"
          alt={event.title}
          src={event.eventThumbnailImage}
        />
      </CardHeader>
      <CardBody className="space-y-2">
        <div className="flex gap-x-2">
          <h2 className="text-lg font-semibold">{event.title}</h2>
          <Chip
            color="default"
            variant="solid"
            className="ml-auto"
            size="sm"
            classNames={{
              base: event.eventPrice === 0 || event.eventPriceForKGEC === 0 ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600' : '',
            }}
          >
            {event.eventPrice === 0 || event.eventPriceForKGEC === 0 ? 'Free' : isFromKGEC ? `₹ ${event.eventPriceForKGEC}` : `₹ ${event.eventPrice}`}
          </Chip>
        </div>
        <p className="text-sm text-default-500">{event.description.length > 100 ? `${event.description.slice(0, 80)}...` : event.description}</p>
        <p className="text-sm text-default-foreground">
          <div className="flex items-center space-x-3">
            <IoCalendar size={22} className="text-default-500" />
            <div>
              <div className="text-default-500">From Date</div>
              <div className="font-semibold">{formateDate(event.startTime)}</div>
            </div>
          </div>
          <span className="pl-2 text-lg leading-3 text-default-500">|</span>
          <div className="flex items-center space-x-3">
            <IoCalendar size={22} className="text-default-500" />
            <div>
              <div className="text-default-500">To Date</div>
              <div className="font-semibold">{formateDate(event.endTime)}</div>
            </div>
          </div>
        </p>
        <p className="flex items-center gap-2 text-primary-500">
          <IoLocationSharp />
          <span>{event.eventVenue}</span>
        </p>
      </CardBody>
      <CardFooter className="space-x-3">
        <Button
          color="default"
          className="w-full"
          onClick={() => {
            console.log('View more');
            navigate(RoutePath.event(event._id));
          }}
        >
          View more
        </Button>
        <Button color="primary" className="w-full">
          Register
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
