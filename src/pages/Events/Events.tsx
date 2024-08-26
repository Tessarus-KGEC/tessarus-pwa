import { Button } from '@nextui-org/button';
import { ScrollShadow } from '@nextui-org/react';
import axios from 'axios';
import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoAdd, IoFilter } from 'react-icons/io5';
import SearchBar from '../../components/SearchBar';
import Sheet from '../../components/Sheet';
import Spinner from '../../components/Spinner';
import { PERMISSIONS } from '../../constants';
import useMediaQuery from '../../hooks/useMedia';
import { useAppSelector } from '../../redux';
import { IEvent } from '../../types/response.type';
import CreateEventForm from './components/CreateEventForm';
import EventCard from './components/EventCard';
import FilterForm from './components/FilterForm';

const Events: FunctionComponent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [isCreateEventFormOpen, setIsCreateEventFormOpen] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [page, setPage] = useState(1);
  const [isFetchingMoreEvents, setFetchingMoreEvents] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const eventPageRef = useRef<HTMLDivElement>(null);
  const eventListRef = useRef<HTMLUListElement>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchEvents = async ({ page, limit }: { page: number; limit: number }) => {
    try {
      const query = new URLSearchParams();
      if (page && limit) {
        query.set('page', page.toString());
        query.set('limit', limit.toString());
      }
      const resp = await axios.get<{
        data: {
          events: IEvent[];
          totalCount: number;
          nextPage: number | null;
          currentPage: number;
          hasMore: boolean;
        };
      }>(`${import.meta.env.VITE_API_URL}/events?${query.toString()}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      });

      return resp.data.data;
    } catch (error) {
      toast.error('Error fetching events');
      return null;
    }
  };

  const loadMoreEvents = async () => {
    setFetchingMoreEvents(true);
    const data = await fetchEvents({ page, limit: 5 });
    if (data) {
      const newEventsSet = new Set([...events, ...data.events]);
      setEvents(Array.from(newEventsSet));
      setHasMore(data.hasMore);
    }
    setFetchingMoreEvents(false);
  };

  useEffect(() => {
    loadMoreEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const lastEventCardRef = useCallback(
    (node: HTMLLIElement) => {
      if (isFetchingMoreEvents) return;
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        {
          root: eventPageRef.current,
          threshold: 1,
          rootMargin: '0px',
        },
      );

      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFetchingMoreEvents, hasMore],
  );

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
      {/* {loading && <p>Loading...</p>} */}
      <ScrollShadow size={20}>
        <ul ref={eventListRef} className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 overflow-y-auto !px-4 !pb-4">
          {events.length > 0 &&
            events.map((event) => (
              <li ref={events.length === events.indexOf(event) + 1 ? lastEventCardRef : null} key={event._id} className="">
                <EventCard event={event} isFromKGEC={user?.isFromKGEC} />
              </li>
            ))}
          <li className="flex justify-center py-3 text-center text-default-500">
            <p className="flex items-center space-x-4 px-2 py-4">
              {isFetchingMoreEvents ? (
                <>
                  <Spinner width="25" />
                  <span>Loading more events...</span>
                </>
              ) : hasMore ? (
                <>Scroll to load more events</>
              ) : (
                <>No more events</>
              )}
            </p>
          </li>
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
