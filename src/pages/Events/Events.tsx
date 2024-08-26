import { Button } from '@nextui-org/button';
import { ScrollShadow } from '@nextui-org/react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { IoAdd, IoFilter } from 'react-icons/io5';
import SearchBar from '../../components/SearchBar';
import Sheet from '../../components/Sheet';
import { PERMISSIONS } from '../../constants';
import useMediaQuery from '../../hooks/useMedia';
import { useAppSelector } from '../../redux';
import { useGetAllEventsQuery } from '../../redux/api/event.slice';
import { IEvent } from '../../types/response.type';
import CreateEventForm from './components/CreateEventForm';
import EventCard from './components/EventCard';
import FilterForm from './components/FilterForm';

const Events: FunctionComponent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [isCreateEventFormOpen, setIsCreateEventFormOpen] = useState(false);
  const [allEvents, setallEvents] = useState<IEvent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const limit = 5;

  const eventPageRef = useRef<HTMLDivElement>(null);
  const eventListRef = useRef<HTMLUListElement>(null);

  const {
    data: eventsResponse,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useGetAllEventsQuery(
    {
      page,
      limit,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (isSuccess && eventsResponse && eventsResponse.status === 200) {
      const newEventsSet = new Set([...allEvents, ...eventsResponse.data.events]);
      setallEvents(Array.from(newEventsSet));
      setHasMoreEvents(eventsResponse.data.totalCount > limit * page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsResponse, isSuccess, page]);

  useEffect(() => {
    if (isFetching) return;
    if (!hasMoreEvents) return;
    if (!eventPageRef.current || !eventListRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMoreEvents) {
          console.log('fetching more events', page + 1);
          setPage((prev) => prev + 1);
        }
      },
      {
        root: eventPageRef.current,
        threshold: 1,
        rootMargin: '0px',
      },
    );

    const lastChild = eventListRef.current.lastElementChild;
    if (!lastChild) return;
    observer.observe(lastChild);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <div ref={eventPageRef} className="flex h-full flex-1 flex-grow-0 flex-col gap-4">
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
              onClick={() => setIsCreateEventFormOpen(true)}
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
      <ScrollShadow size={20}>
        <ul ref={eventListRef} className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 overflow-y-auto !px-4 !pb-4">
          {allEvents.length > 0 &&
            allEvents.map((event) => (
              <li key={event._id} className="">
                <EventCard event={event} isFromKGEC={user?.isFromKGEC} />
              </li>
            ))}
          <li className="py-3 text-center text-default-500">No more events found</li>
        </ul>
      </ScrollShadow>

      {/* Fillter form */}
      <Sheet open={isFilterOpened} onClose={() => setIsFilterOpened(false)}>
        <FilterForm />
      </Sheet>

      {/* Create event form */}
      <CreateEventForm
        open={isCreateEventFormOpen}
        onClose={() => {
          setIsCreateEventFormOpen(false);
        }}
      />
    </div>
  );
};

export default Events;
