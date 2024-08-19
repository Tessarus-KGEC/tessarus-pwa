import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader, Chip, ScrollShadow } from '@nextui-org/react';
import { FunctionComponent, useState } from 'react';
import { IoAdd, IoCalendar, IoFilter, IoLocationSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import Sheet from '../../components/Sheet';
import { PERMISSIONS } from '../../constants';
import { RoutePath } from '../../constants/route';
import useMediaQuery from '../../hooks/useMedia';
import { useAppSelector } from '../../redux';
import { useGetAllEventsQuery } from '../../redux/api/event.slice';
import { formateDate } from '../../utils/formateDate';
import FilterForm from './components/FilterForm';

const Events: FunctionComponent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const { data: eventsResponse, isLoading, isError } = useGetAllEventsQuery();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-1 flex-grow-0 flex-col gap-4">
      <div className="space-y-4 px-4">
        <h1 className="text-2xl">Ongoing Events</h1>
        <div className="flex gap-4">
          <SearchBar placeholder="Search your favorite event..." />
          <Button isIconOnly color="default" aria-label="Like" onClick={() => setIsFilterOpened(!isFilterOpened)}>
            <IoFilter size={24} />
          </Button>
          {!user || !user.isFromKGEC || !user.permissions.includes(PERMISSIONS.CREATE_EVENT) ? null : (
            <Button
              isIconOnly={isMobile}
              color="primary"
              className={`space-x-2 ${!isMobile ? '!px-6' : ''}`}
              onClick={() =>
                navigate(RoutePath['edit-event'](), {
                  replace: false,
                })
              }
            >
              <span>
                <IoAdd size={24} />
              </span>
              {!isMobile ? 'Add Event' : null}
            </Button>
          )}
        </div>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching events</p>}
      {eventsResponse && eventsResponse.status === 200 && (
        <ScrollShadow size={20}>
          <ul className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 overflow-y-auto !px-4 !pb-4">
            {eventsResponse.data.events.map((event) => (
              <li key={event._id} className="">
                <Card className="h-full">
                  <CardHeader>
                    <img className="aspect-video w-full rounded-lg" alt={event.title} src={event.eventThumbnailImage} />
                  </CardHeader>
                  <CardBody className="space-y-2">
                    <div className="flex gap-x-2">
                      <h2 className="text-lg font-semibold">{event.title}</h2>
                      <Chip color="default" variant="solid" className="ml-auto">
                        {event.eventPrice === 0 || event.eventPriceForKGEC === 0
                          ? 'Free'
                          : user && user.isFromKGEC
                            ? `₹ ${event.eventPriceForKGEC}`
                            : `₹ ${event.eventPrice}`}
                      </Chip>
                    </div>
                    <p className="text-sm text-default-500">
                      {event.description.length > 100 ? `${event.description.slice(0, 80)}...` : event.description}
                    </p>
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
                    <Button color="default" className="w-full">
                      View more
                    </Button>
                    <Button color="primary" className="w-full">
                      Register
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
            <li className="py-3 text-center text-default-500">No more events found</li>
          </ul>
        </ScrollShadow>
      )}
      <Sheet open={isFilterOpened} onClose={() => setIsFilterOpened(false)}>
        <FilterForm />
      </Sheet>
    </div>
  );
};

export default Events;
