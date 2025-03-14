import { ScrollShadow } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingLottie from '../../components/Loading';
import NoResults from '../../components/NoResults';
import useMediaQuery from '../../hooks/useMedia';
import { useAppDispatch, useAppSelector } from '../../redux';
import { setNavbarHeaderTitle } from '../../redux/reducers/route.reducer';
import { IEvent } from '../../types/response.type';
import EventCard from '../Events/components/EventCard';

const RegisteredEvents: FunctionComponent = () => {
  const { user, authToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [page, setPage] = useState(1);
  const [, setFetchingMoreEvents] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const eventPageRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async ({ page, limit }: { page: number; limit: number }) => {
    try {
      const query = new URLSearchParams();
      if (page && limit) {
        query.append('page', page.toString());
        query.append('limit', limit.toString());
      }

      if (!authToken) return null;

      
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

  useEffect(() => {
    dispatch(setNavbarHeaderTitle(isMobile ? 'Registered events' : null));
  }, [isMobile, dispatch]);

  return (
    <div ref={eventPageRef} className="flex h-full flex-1 flex-grow-0 flex-col gap-4">
      <div className="space-y-4 px-4">{!isMobile ? <h1 className="text-2xl">Registered events</h1> : null}</div>
      <div id="registeredEventsInfiniteScoller" className="h-full overflow-auto">
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
            scrollableTarget="registeredEventsInfiniteScoller"
          >
            <ul className="relative grid flex-1 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 overflow-y-auto !px-4">
              {events.map((event) => (
                <li key={event._id} className="">
                  <EventCard event={event} isFromKGEC={user?.isFromKGEC} />
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default RegisteredEvents;
