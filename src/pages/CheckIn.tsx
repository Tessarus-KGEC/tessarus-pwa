import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/react';
import { BarcodeDetector } from 'barcode-detector/pure';
import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoRefresh, IoTicketOutline } from 'react-icons/io5';
import QRCorner from '../assets/qr.svg';
import Alrert from '../components/Alrert';
import useMediaQuery from '../hooks/useMedia';
import { useAppDispatch } from '../redux';
import { useCheckInTicketMutation } from '../redux/api/ticket.slice';
import { setNavbarHeaderTitle } from '../redux/reducers/route.reducer';
import { getAPIErrorMessage } from '../utils/api.helper';
import { ITeamMember } from './Event/Event';

const Checkin: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const isVisibleForScreen = useMediaQuery('(max-width: 480px)');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [ticketCheckin, { isLoading: isTicketCheckingLoading }] = useCheckInTicketMutation();

  const [ticketDetails, setTicketDetails] = useState<{
    ticketId: string;
    teamName: string;
    teamMembers: ITeamMember[];
  } | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const [autoResumeScan, setAutoResumeScan] = useState(true);

  const [autoPauseScan, setAutoPauseScan] = useState(true);

  const animationFrameIdRef = useRef<number | null>(null); // for clearing out animation frames once detected

  const isDetectingQRRef = useRef(false); // for checking if already detecting QR code

  const isQRDetectedRef = useRef(false); // for checking if QR code is detected

  const autoPauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const autoPauseDuration = 10000;

  const stopScanning = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      // console.log('Stopping scanning');
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());

      videoRef.current.srcObject = null; // to stop the video stream, release resources
    }

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    isDetectingQRRef.current = false;

    setIsScanning(false);
  }, []);

  const handleAutoPause = useCallback(() => {
    if (!autoPauseScan) return;
    if (autoPauseTimeoutRef.current) {
      clearTimeout(autoPauseTimeoutRef.current);
    }

    autoPauseTimeoutRef.current = setTimeout(() => {
      // console.log('Auto pausing scanning');
      stopScanning();
    }, autoPauseDuration);
  }, [stopScanning, autoPauseScan]);

  const startScanning = useCallback(
    async (node: HTMLVideoElement) => {
      if (node) {
        videoRef.current = node;
      }

      // if already detecting QR code then return
      if (isDetectingQRRef.current) return;

      isDetectingQRRef.current = true;

      // if already detected QR code then return
      if (isQRDetectedRef.current) return;

      setIsScanning(true);

      let isFacingModeSupported = false;
      const defaultFacingMode = 'environment';

      const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
      if ('facingMode' in supportedConstraints && 'deviceId' in supportedConstraints && supportedConstraints.facingMode) {
        isFacingModeSupported = true;
      }
      if (!isFacingModeSupported) return;
      // const devices = await navigator.mediaDevices.enumerateDevices();
      // const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      // const hasRearCamera = videoDevices.some((device) => device.label.toLowerCase().includes('back'));

      // defaultFacingMode = hasRearCamera ? 'environment' : 'user';

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: defaultFacingMode,
          width: 640, // atleast it will require less resources for scanning
          height: 480,
        },
      });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      // console.log('Scanning started');

      if (!('BarcodeDetector' in window) || !('BarcodeDetector' in globalThis)) {
        window.alert('BarcodeDetector is not supported');
        return;
      }

      const detectBarcodes = async () => {
        // console.log('Detecting barcodes', isQRDetectedRef.current);

        if (!videoRef.current) return;

        if (isQRDetectedRef.current) {
          return;
        }

        const barcodeDetector = new BarcodeDetector({
          formats: ['qr_code'],
        });
        try {
          barcodeDetector.detect(videoRef.current).then((barCodes) => {
            if (barCodes.length > 0) {
              const barcode = barCodes[0];
              setTicketDetails(JSON.parse(barcode.rawValue));

              isQRDetectedRef.current = true;

              stopScanning();

              // immediately stopping scanning before another requestAnimationFrame is called
              return;
            }
          });

          animationFrameIdRef.current = requestAnimationFrame(detectBarcodes);
        } catch (error) {
          toast.error('Error while scanning barcode');
        }
      };

      animationFrameIdRef.current = requestAnimationFrame(detectBarcodes);

      handleAutoPause();
    },
    [stopScanning, handleAutoPause],
  );

  const handleScanningResume = () => {
    setTicketDetails(null);

    setIsScanning(true);

    isDetectingQRRef.current = false;

    isQRDetectedRef.current = false;

    if (videoRef.current) {
      startScanning(videoRef.current);
    }
  };

  async function handlerTicketCheckin() {
    if (!ticketDetails) return;
    try {
      const response = await ticketCheckin({
        ticketId: ticketDetails.ticketId,
      });
      if (response.data && response.data.status === 200 && response.data.data.isCheckedIn) {
        toast.success('Ticket checked in successfully');
        if (autoResumeScan) {
          handleScanningResume();
        }
      } else {
        toast.error(getAPIErrorMessage(response.error));
      }
      return;
    } catch (error) {
      toast.error(getAPIErrorMessage(error));
    }
  }

  // initial start scanning
  useEffect(() => {
    if (videoRef.current) {
      // console.log('this causing restart');
      startScanning(videoRef.current);
    }

    return () => {
      stopScanning();

      if (autoPauseTimeoutRef.current) {
        clearTimeout(autoPauseTimeoutRef.current);
      }
    };
  }, [startScanning, stopScanning]);

  useEffect(() => {
    dispatch(setNavbarHeaderTitle(isMobile ? 'Check In' : null));
  }, [isMobile, dispatch]);

  if (!isVisibleForScreen) {
    return (
      <div className="px-4">
        <Alrert type="warning" title="Not Supported" message="Please use in mobile device, not supported for larger screens" />
      </div>
    );
  }

  return (
    <section className="h-full w-full space-y-1 p-4">
      <div className="p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-primary">
          {/* tl */}
          <div className="absolute left-0 top-0 z-10 aspect-square w-[55px]">
            <img src={QRCorner} alt="QR Corner" className="h-full w-full" />
          </div>
          {/* br */}
          <div className="absolute bottom-0 right-0 z-10 aspect-square w-[55px] rotate-180">
            <img src={QRCorner} alt="QR Corner" className="h-full w-full" />
          </div>
          {/* bl */}
          <div className="absolute bottom-0 left-0 z-10 aspect-square w-[55px] -scale-y-100">
            <img src={QRCorner} alt="QR Corner" className="h-full w-full" />
          </div>
          {/* bl */}
          <div className="absolute right-0 top-0 z-10 aspect-square w-[55px] -scale-x-100">
            <img src={QRCorner} alt="QR Corner" className="h-full w-full" />
          </div>
          {!isScanning ? (
            <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-y-6 bg-foreground-50">
              <p className="text-center text-sm text-foreground-500">
                Scanning paused. <br /> Please resume to scan.
              </p>
              <Button onPress={handleScanningResume}>
                <IoRefresh size={20} />
                Resume Scan
              </Button>
            </div>
          ) : null}
          <video
            ref={(node) => {
              if (node) {
                if (autoPauseScan && autoPauseTimeoutRef.current) return;
                startScanning(node);
              }
            }}
            autoPlay
            loop
            muted
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <Checkbox defaultSelected={autoResumeScan} onChange={(e) => setAutoResumeScan(e.target.checked)}>
        Auto resume scanning after checkin
      </Checkbox>
      <Checkbox defaultSelected={autoPauseScan} onChange={(e) => setAutoPauseScan(e.target.checked)}>
        Auto pause on inactivity ({autoPauseDuration / 1000} sec)
      </Checkbox>

      {ticketDetails ? (
        <div className="space-y-4 rounded-xl border-red-600 bg-foreground-50 p-4">
          <div className="flex items-center space-x-4">
            <div>
              <IoTicketOutline size={27} />
            </div>
            <div>
              <p className="text-xs text-foreground-500">id: {ticketDetails.ticketId}</p>
              <p>
                {ticketDetails.teamName} ({ticketDetails.teamMembers.length} members)
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button color="default" radius="sm" className="w-full" onPress={handleScanningResume}>
              Dismiss
            </Button>
            <Button color="primary" radius="sm" className="w-full" isLoading={isTicketCheckingLoading} onPress={handlerTicketCheckin}>
              Check In
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-center text-foreground-500">Scanning {isScanning ? 'activated' : 'paused'} ...</p>
        </div>
      )}
    </section>
  );
};

export default Checkin;
