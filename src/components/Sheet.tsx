import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import useMediaQuery from '../hooks/useMedia';

const Sheet: React.FC<{
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const sheetAnimationRef = useRef<gsap.core.Timeline>();
  const handleSheetClose = () => {
    sheetAnimationRef.current?.reverse();
  };
  useGSAP(
    () => {
      if (!open) return;
      const sheet = document.getElementById('tessarus-app-sheet');
      const backdrop = document.getElementById('tessarus-app-sheet-backdrop');
      if (!sheet || !backdrop) return;

      const sheetTransition = isMobile
        ? {
            y: '100%',
          }
        : {
            x: '100%',
          };

      sheetAnimationRef.current = gsap
        .timeline({
          defaults: {
            duration: 0.3,
            ease: 'power2.inOut',
          },
          onReverseComplete: () => {
            onClose && onClose();
          },
        })
        .from(
          backdrop,
          {
            background: 'rgba(0, 0, 0, 0)',
          },
          '<',
        )
        .from(sheet, sheetTransition, '<');
    },
    {
      dependencies: [open, isMobile],
    },
  );
  return (
    <>
      {open
        ? createPortal(
            <div
              id="tessarus-app-sheet-backdrop"
              className={`fixed inset-0 z-[100] h-screen w-screen bg-[rgba(0,0,0,0.5)] ${isMobile ? 'pt-32' : ''}`}
              onClick={handleSheetClose}
            >
              <div
                id="tessarus-app-sheet"
                className={`h-full ${isMobile ? 'w-full' : 'w-[400px]'} ${isMobile ? 'rounded-t-3xl' : 'rounded-l-3xl'} ${isMobile ? '' : 'ml-auto'} dark:bg-default-50`}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </div>
            </div>,
            document.getElementById('app-body')!,
          )
        : null}
    </>
  );
};

export default Sheet;
