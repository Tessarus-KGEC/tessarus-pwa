import { Button } from '@nextui-org/button';
import { ScrollShadow } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoAdd, IoFilter } from 'react-icons/io5';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import Spinner from '../../components/Spinner';
import { PERMISSIONS } from '../../constants';
import useMediaQuery from '../../hooks/useMedia';
import { useAppDispatch, useAppSelector } from '../../redux';
import { setNavbarHeaderTitle } from '../../redux/reducers/route.reducer';
import { IEvent } from '../../types/response.type';
import CreateEventForm from './components/CreateEventForm';
import EventCard from './components/EventCard';
import FilterForm from './components/FilterForm';

const Events: FunctionComponent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const [searchParams] = useSearchParams();

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
      const query = Object.fromEntries(searchParams.entries());

      const resp = await axios.get<{
        data: {
          events: IEvent[];
          totalCount: number;
          nextPage: number | null;
          currentPage: number;
          hasMore: boolean;
        };
      }>(
        `${import.meta.env.VITE_API_URL}/events?page=${page}&limit=${limit}&isFromKGEC=${user?.isFromKGEC ?? false}&${new URLSearchParams(query).toString()}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
          },
        },
      );

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

  // const loadMoreEvents = async () => {
  //   setFetchingMoreEvents(true);
  //   const data = await fetchEvents({ page, limit: 10 });
  //   if (data) {
  //     const newEventsSet = new Set([...events, ...data.events]);
  //     setEvents(Array.from(newEventsSet));
  //     setHasMore(data.hasMore);
  //   }
  //   setFetchingMoreEvents(false);
  // };

  // useEffect(() => {
  //   console.log('fetching');
  //   loadMoreEvents();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [page, searchParams]);

  useEffect(() => {
    const fetchNewEvents = async () => {
      setFetchingMoreEvents(true);

      const data = await fetchEvents({ page, limit: 10 });

      if (data) {
        if (page === 1) {
          setEvents(data.events);
        } else {
          setEvents((prevEvents) => [...prevEvents, ...data.events]);
        }
        setHasMore(data.hasMore);
      } else {
        setEvents([]);
      }

      setFetchingMoreEvents(false);
    };

    fetchNewEvents();
  }, [searchParams, page, user?.isFromKGEC]);

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
          rootMargin: '50px',
        },
      );

      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFetchingMoreEvents, hasMore],
  );

  useEffect(() => {
    dispatch(setNavbarHeaderTitle(isMobile ? 'Events' : null));
  }, [isMobile, dispatch]);

  return (
    <div ref={eventPageRef} className="flex h-full flex-1 flex-grow-0 flex-col gap-4">
      <div className="space-y-4 px-4">
        {!isMobile ? <h1 className={`text-2xl`}>Events</h1> : null}
        <div className="flex gap-4">
          <SearchBar placeholder={`Search your favorite event...`} />
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
        <ul ref={eventListRef} className="relative grid flex-1 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 overflow-y-auto !px-4 !pb-12">
          {events.length > 0 &&
            events.map((event) => (
              <li ref={events.length === events.indexOf(event) + 1 ? lastEventCardRef : null} key={event._id} className="">
                <EventCard event={event} isFromKGEC={user?.isFromKGEC} />
              </li>
            ))}
          <li className="absolute bottom-0 left-0 right-0 flex justify-center py-2 text-center text-default-500">
            <p className="flex items-center space-x-4 px-2">
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

      <FilterForm
        isFilterOpened={isFilterOpened}
        setIsFilterOpened={(value) => {
          setPage(1);
          setIsFilterOpened(value);
        }}
      />

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
