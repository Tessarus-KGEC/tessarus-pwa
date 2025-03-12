import { Button } from '@nextui-org/button';
import { Badge, ScrollShadow } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { IoAdd, IoFilter } from 'react-icons/io5';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'react-router-dom';
import LoadingLottie from '../../components/Loading';
import NoResults from '../../components/NoResults';
import SearchBar from '../../components/SearchBar';
import { PERMISSIONS } from '../../constants';
import useDebounceSearch from '../../hooks/useDebounce';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const [searchParams] = useSearchParams();

  const [isCreateEventFormOpen, setIsCreateEventFormOpen] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [page, setPage] = useState(1);
  const [, setFetchingMoreEvents] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const debouncedSearch = useDebounceSearch({
    query: searchQuery,
    callback: () => searchQuery !== '' && setPage(1),
  });

  const fetchEvents = async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
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
        `${import.meta.env.VITE_API_URL}/events?${search ? `search=${search}&` : ''}page=${page}&limit=${limit}&isFromKGEC=${user?.isFromKGEC ?? false}&${new URLSearchParams(query).toString()}`,
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

  useEffect(() => {
    const fetchNewEvents = async () => {
      setFetchingMoreEvents(true);

      const data = await fetchEvents({ page, limit: 10, search: debouncedSearch });

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
  }, [searchParams, page, user?.isFromKGEC, debouncedSearch]);

  useEffect(() => {
    dispatch(setNavbarHeaderTitle(isMobile ? 'Events' : null));
  }, [isMobile, dispatch]);

  const isFilterApplied = useMemo(() => {
    return !!searchParams.size;
  }, [searchParams]);

  return (
    <div className="flex h-full flex-1 flex-grow-0 flex-col gap-4">
      <div className="space-y-4 px-4">
        {!isMobile ? <h1 className={`text-2xl`}>Events</h1> : null}
        <div className="flex gap-4">
          <SearchBar
            placeholder={`Search your favorite event...`}
            className="max-w-[450px]"
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
          <Badge color="danger" content={isFilterApplied ? searchParams.size : undefined} size="lg">
            <Button color={'default'} variant={'flat'} aria-label="Filter" onClick={() => setIsFilterOpened(!isFilterOpened)}>
              <IoFilter size={20} />
              Filters
            </Button>
          </Badge>
          {!user || !user.isFromKGEC || !user.permissions.includes(PERMISSIONS.CREATE_EVENT) ? null : (
            <Button
              isIconOnly={isMobile}
              color="primary"
              className={`space-x-2 ${!isMobile ? '!px-6' : ''} ml-auto`}
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
      <div id="eventsInfiniteScroller" className="h-full overflow-auto">
        <ScrollShadow size={20}>
          <InfiniteScroll
            dataLength={events.length}
            next={() => setPage((prev) => prev + 1)}
            hasMore={hasMore}
            loader={
              <div>
                <LoadingLottie size={100} />
              </div>
            }
            endMessage={
              <div>
                <NoResults size={220} />
              </div>
            }
            scrollableTarget="eventsInfiniteScroller"
          >
            <ul className="relative grid flex-1 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 overflow-y-auto !px-4">
              {events.map((event) => (
                <li key={event._id} className="">
                  <EventCard event={event} isFromKGEC={user?.isFromKGEC} />
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        </ScrollShadow>
      </div>

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
