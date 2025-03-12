import NoReultsJson from '@/assets/no-results.json';
import { Player } from '@lottiefiles/react-lottie-player';

const NoResults = ({ size }: { size?: number }) => {
  return <Player autoplay loop src={NoReultsJson} style={{ maxWidth: `${size}px`, aspectRatio: '1/1' }} />;
};

export default NoResults;
