import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  darkSurface?: boolean;
  priority?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
  darkSurface = false,
  priority = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col items-center justify-center overflow-hidden p-6 text-center ${
          darkSurface
            ? 'bg-gradient-to-br from-[#1C1F1D] via-[#151816] to-[#1B3B2B]/40 text-[#F7F3EB]'
            : 'bg-gradient-to-br from-[#EFEAE0] via-[#E5DDD0] to-[#D8CEC0] text-[#141615]'
        } ${className}`}
      >
        <svg
          viewBox="0 0 120 72"
          className="w-20 h-12 opacity-40 mb-3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14 44C14 31 24 22 38 22H82C96 22 106 31 106 44V50H14V44Z"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path d="M22 50V60M98 50V60M10 50H110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span className="text-xs font-medium tracking-wide opacity-75">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
