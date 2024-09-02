import MeiliSearch from 'meilisearch';

const useMeilisearch = () => {
  const meiliClient = new MeiliSearch({
    host: `${import.meta.env.VITE_MEILI_URL}`,
    apiKey: `${import.meta.env.VITE_MEILI_KEY}`,
  });
  return meiliClient;
};

export default useMeilisearch;
