import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Coin from '@/assets/coin.png';
import { Chip, Image, User } from '@nextui-org/react';
import toast from 'react-hot-toast';
import useMediaQuery from '../../hooks/useMedia';
import { useAppSelector } from '../../redux';
import { LeaderboardContestantsResponse } from '../../types/response.type';

import FirstPosition from '@/assets/first.png';
import SecondPosition from '@/assets/second.png';
import ThirdPosition from '@/assets/third.png';
import LoadingLottie from '../../components/Loading';
import NoResults from '../../components/NoResults';

const Leaderboard = () => {
  const auth = useAppSelector((state) => state.auth);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [page, setPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardContestantsResponse>({
    total: 0,
    list: [],
  });
  const [, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 30; // Adjust as needed

  // Initial fetch
  useEffect(() => {
    const fetchLeaderboard = async (page: number) => {
      try {
        setFetchingMore(true);
        const resp = await axios.get<{ data: LeaderboardContestantsResponse }>(
          `${import.meta.env.VITE_API_URL}/user/leaderboard?page=${page}&limit=${limit}`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json',
              Authorization: `bearer ${auth.authToken}`,
            },
          },
        );

        const newData = resp.data.data;

        setLeaderboardData((prev) => {
          const mergedList = [...prev.list, ...newData.list];
          const uniqueList = Array.from(new Map(mergedList.map((item) => [item._id, item])).values());

          return {
            total: newData.total,
            list: uniqueList,
          };
        });

        setHasMore(newData.total > page * limit);
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message || 'Error fetching leaderboard');
        } else {
          toast.error('Error fetching leaderboard');
        }
      } finally {
        setFetchingMore(false);
      }
    };

    if (!auth.authToken) return;
    fetchLeaderboard(page);
  }, [auth.authToken, page]);

  return (
    <section className="flex h-full flex-1 flex-grow-0 flex-col gap-4 px-4">
      {!isMobile ? <h1 className="text-2xl">Leaderboard</h1> : null}
      <div className="flex p-2">
        <div className="flex gap-x-6">
          <p>Rank</p>
          <p>Name</p>
        </div>
        <p className="ml-auto px-2">Score</p>
      </div>
      <div id="leaderboardScrollable" className="h-full overflow-auto">
        <InfiniteScroll
          dataLength={leaderboardData.list.length}
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
          scrollableTarget="leaderboardScrollable"
        >
          {leaderboardData.list.map((item, index) => (
            <div key={index} className={`mb-3 flex rounded-lg border-b border-default-100 px-0 py-2 md:px-2`}>
              <div className={`flex items-center gap-x-4`}>
                <div className="flex w-12 items-center justify-center">
                  {[1, 2, 3].includes(item.rank) ? (
                    <Image
                      src={item.rank === 1 ? FirstPosition : item.rank === 2 ? SecondPosition : ThirdPosition}
                      alt="first-position"
                      className={`${item.rank === 1 ? 'w-12' : item.rank === 2 ? 'w-11' : 'w-9'}`}
                    />
                  ) : (
                    <p className="flex aspect-square w-6 items-center justify-center rounded-full bg-default-100 text-sm">{item.rank}</p>
                  )}
                </div>
                <User
                  avatarProps={{
                    src: item.profileImageUrl,
                    size: 'sm',
                  }}
                  name={<p className="max-w-[110px] truncate xxs:max-w-full">{item.name}</p>}
                />
              </div>
              <Chip
                startContent={<img src={Coin} className="mr-1 aspect-square h-[20px] w-[20px] !blur-none" />}
                variant="flat"
                size="sm"
                className="ml-auto h-6"
              >
                {item.score} XP
              </Chip>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default Leaderboard;
