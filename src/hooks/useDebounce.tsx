import { useEffect, useRef, useState } from 'react';

const useDebounceSearch = ({ query, delay = 750, callback }: { query: string; delay?: number; callback?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const timerRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setSearchQuery(query);
      if (callback) {
        callback();
      }
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [query, delay, callback]);

  return searchQuery;
};

export default useDebounceSearch;
