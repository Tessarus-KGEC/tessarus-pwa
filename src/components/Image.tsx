import React, { useMemo } from 'react';

const ImageComponent: React.FC<{
  scaleRatio?: 'md' | 'lg' | 'none';
  src?: string;
  alt?: string;
}> = ({ src, alt, scaleRatio = 'lg' }) => {
  const scaleValue = useMemo(() => {
    if (scaleRatio === 'md') return 'scale-100';
    if (scaleRatio === 'lg') return 'scale-125';
    return 'scale-100';
  }, [scaleRatio]);
  return (
    <div id="tessarus-image-wrapper" className="relative w-full cursor-pointer rounded-large shadow-none shadow-black/5">
      <div className="rounded-inherit relative overflow-hidden rounded-large">
        <img
          src={src}
          data-loaded="true"
          className={`relative z-10 aspect-video w-full transform rounded-lg object-cover opacity-0 shadow-none shadow-black/5 !duration-300 transition-transform-opacity hover:${scaleValue} group-hover:scale-105 data-[loaded=true]:opacity-100 motion-reduce:transition-none`}
          alt={alt}
        />
      </div>
      <img
        src={src}
        className={`absolute inset-0 z-0 h-full w-full translate-y-1 scale-105 rounded-large object-cover opacity-30 blur-lg saturate-150 filter`}
        alt={alt}
        data-loaded="true"
        aria-hidden="true"
      />
    </div>
  );
};

export default ImageComponent;
