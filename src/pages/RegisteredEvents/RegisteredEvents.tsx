import { Button } from '@nextui-org/button';
import { ScrollShadow } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoFilter } from 'react-icons/io5';
import SearchBar from '../../components/SearchBar';
import Sheet from '../../components/Sheet';
import Spinner from '../../components/Spinner';
import { useAppSelector } from '../../redux';
import { IEvent } from '../../types/response.type';
import EventCard from '../Events/components/EventCard';
import FilterForm from '../Events/components/FilterForm';

const RegisteredEvents: FunctionComponent = () => {
  const { user, authToken } = useAppSelector((state) => state.auth);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
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
        query.append('page', page.toString());
        query.append('limit', limit.toString());
      }

      const resp = await axios.get<{
        data: {
          events: IEvent[];
          totalCount: number;
          nextPage: number | null;
          currentPage: number;
          hasMore: boolean;
        };
      }>(`${import.meta.env.VITE_API_URL}/events/registered?${query.toString()}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      return resp.data.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Error fetching events');
        return null;
      }
      toast.error('Error fetching events');
      return null;
    }
  };

  const loadMoreEvents = async () => {
    setFetchingMoreEvents(true);
    const data = await fetchEvents({ page, limit: 10 });
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

  return (
    <div ref={eventPageRef} className="flex h-full flex-1 flex-grow-0 flex-col gap-4">
      <div className="space-y-4 px-4">
        <h1 className="text-2xl">Registered events</h1>
        <div className="flex gap-4">
          <SearchBar placeholder={`Search your registered event...`} />
          <Button isIconOnly color="default" aria-label="Like" onClick={() => setIsFilterOpened(!isFilterOpened)}>
            <IoFilter size={24} />
          </Button>
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
    </div>
  );
};

export default RegisteredEvents;
