import Loading from '@/assets/loading.json';
import { Player } from '@lottiefiles/react-lottie-player';

const LoadingLottie = ({ size = 250 }: { size?: number }) => {
  return <Player autoplay loop src={Loading} style={{ maxWidth: `${size}px`, aspectRatio: '1/1' }} />;
};

export default LoadingLottie;
