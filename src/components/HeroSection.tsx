import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { FurnitureItem, SiteMediaConfig } from '../types/furniture';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  media: SiteMediaConfig;
  spotlightItems: FurnitureItem[];
  onShopCollection: () => void;
  onWatchFilm: () => void;
  onSelectPiece: (id: string) => void;
}

const FINISH_SWATCHES = [
  { id: 'forest', label: 'Forest Velvet', hex: '#1B3B2B', filter: 'saturate(1.04) contrast(1.02)' },
  { id: 'rust', label: 'Sunburnt Rust', hex: '#9E3B1C', filter: 'sepia(0.18) saturate(1.15)' },
  { id: 'walnut', label: 'Oiled Walnut', hex: '#5C4033', filter: 'contrast(1.05) brightness(0.97)' },
  { id: 'oatmeal', label: 'Belgian Oatmeal', hex: '#D9D0C1', filter: 'brightness(1.04) saturate(0.88)' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  media,
  spotlightItems,
  onShopCollection,
  onWatchFilm,
  onSelectPiece,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeSwatch, setActiveSwatch] = useState(FINISH_SWATCHES[0]);
  const [ambientMotion, setAmbientMotion] = useState(true);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const pointerMq = window.matchMedia('(pointer: fine)');
    const desktopMq = window.matchMedia('(min-width: 768px)');
    setIsFinePointer(pointerMq.matches);
    setIsDesktop(desktopMq.matches);
    const onPointerChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    const onDesktopChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    pointerMq.addEventListener('change', onPointerChange);
    desktopMq.addEventListener('change', onDesktopChange);
    return () => {
      pointerMq.removeEventListener('change', onPointerChange);
      desktopMq.removeEventListener('change', onDesktopChange);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 22,
    mass: 0.4,
  });

  // Scroll-linked choreography: desktop uses 3D tilt + lateral shift; mobile (<768px) stays strictly in-place (y + scale)
  const sofaRotateZ = useTransform(smoothProgress, [0, 1], [0, -4.5]);
  const sofaRotateY = useTransform(smoothProgress, [0, 1], [0, 8]);
  const sofaY = useTransform(smoothProgress, [0, 1], [0, 48]);
  const sofaScale = useTransform(smoothProgress, [0, 1], [1, 0.94]);

  const leftPieceX = useTransform(smoothProgress, [0, 1], [0, -34]);
  const leftPieceY = useTransform(smoothProgress, [0, 1], [0, -28]);
  const rightPieceX = useTransform(smoothProgress, [0, 1], [0, 34]);
  const rightPieceY = useTransform(smoothProgress, [0, 1], [0, 26]);
  const wordmarkY = useTransform(smoothProgress, [0, 1], [0, -36]);

  const leftSidePiece = spotlightItems[1];
  const rightSidePiece = spotlightItems[3] || spotlightItems[2];

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer || !isDesktop || shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 5).toFixed(2)),
      ry: Number((nx * 7).toFixed(2)),
    });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full max-w-full overflow-x-clip bg-[#F7F3EB] text-[#141615] pt-6 sm:pt-10 pb-10 sm:pb-14 border-b border-[#141615]/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 w-full min-w-0">
        {/* Top subtle atelier line */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#141615]/65 mb-4 sm:mb-6 min-w-0">
          <span className="truncate">01 / Nairobi &amp; Ruiru Craft Atelier</span>
          <span className="hidden sm:inline shrink-0">Four Showrooms · Custom Built in 14 Days</span>
        </div>

        {/* #hero-container: Full eslis wordmark at higher z-index above seamless sofa centerpiece */}
        <div
          id="hero-container"
          onMouseMove={handleStageMouseMove}
          onMouseLeave={resetTilt}
          className="relative w-full max-w-full overflow-x-clip overflow-y-visible flex flex-col items-center justify-start pt-2 sm:pt-4 pb-4 md:perspective-[1200px]"
        >
          {/* Giant display wordmark — z-30 (above sofa z-10), fits cleanly inside mobile padding */}
          <motion.div
            style={shouldReduceMotion ? undefined : { y: wordmarkY }}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none select-none relative z-30 w-full max-w-full flex justify-center overflow-x-clip overflow-y-visible pb-2"
          >
            <h1 className="text-[clamp(4.5rem,20vw,17.5rem)] font-extrabold leading-none tracking-[-0.06em] text-[#141615] lowercase max-w-full text-center">
              eslis
            </h1>
          </motion.div>

          {/* Left flanking accent piece (desktop only) */}
          {isDesktop && leftSidePiece && (
            <motion.button
              type="button"
              onClick={() => onSelectPiece(leftSidePiece.id)}
              style={shouldReduceMotion ? undefined : { x: leftPieceX, y: leftPieceY }}
              initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex flex-col text-left w-44 xl:w-52 absolute left-0 bottom-10 z-20 rounded-2xl bg-[#F7F3EB]/70 backdrop-blur-md p-2.5 shadow-sm border border-[#141615]/10 hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <div className="aspect-[1.618/1] w-full rounded-xl overflow-hidden bg-[#E5DDD0] mb-2">
                <ResilientImage
                  src={leftSidePiece.imageUrl}
                  alt={leftSidePiece.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-semibold text-[#141615] truncate">
                {leftSidePiece.title}
              </span>
              <span className="text-[11px] text-[#141615]/70 tabular-nums">
                KES {leftSidePiece.priceKes.toLocaleString('en-KE')}
              </span>
            </motion.button>
          )}

          {/* Right flanking accent piece (desktop only) */}
          {isDesktop && rightSidePiece && (
            <motion.button
              type="button"
              onClick={() => onSelectPiece(rightSidePiece.id)}
              style={shouldReduceMotion ? undefined : { x: rightPieceX, y: rightPieceY }}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex flex-col text-left w-44 xl:w-52 absolute right-0 top-[44%] z-20 rounded-2xl bg-[#F7F3EB]/70 backdrop-blur-md p-2.5 shadow-sm border border-[#141615]/10 hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <div className="aspect-[1.618/1] w-full rounded-xl overflow-hidden bg-[#E5DDD0] mb-2">
                <ResilientImage
                  src={rightSidePiece.imageUrl}
                  alt={rightSidePiece.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-semibold text-[#141615] truncate">
                {rightSidePiece.title}
              </span>
              <span className="text-[11px] text-[#141615]/70 tabular-nums">
                KES {rightSidePiece.priceKes.toLocaleString('en-KE')}
              </span>
            </motion.button>
          )}

          {/* Seamless Sofa Centerpiece — z-10 below wordmark, zero background/border/shadow */}
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : isDesktop
                ? {
                    rotateZ: sofaRotateZ,
                    rotateY: sofaRotateY,
                    y: sofaY,
                    scale: sofaScale,
                  }
                : {
                    y: sofaY,
                    scale: sofaScale,
                  }
            }
            initial={
              shouldReduceMotion
                ? false
                : isDesktop
                ? { opacity: 0, scale: 0.95, y: 18, rotateZ: 1 }
                : { opacity: 0, scale: 0.97, y: 12 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : ambientMotion
                ? isDesktop
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: [0, -6, 0],
                      rotateZ: [0, 0.55, 0],
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: [0, -5, 0],
                    }
                : { opacity: 1, scale: 1, y: 0, rotateZ: 0 }
            }
            transition={
              ambientMotion && !shouldReduceMotion
                ? isDesktop
                  ? {
                      opacity: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                      scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                      y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
                      rotateZ: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                    }
                  : {
                      opacity: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                      scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                      y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
                    }
                : { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
            }
            className="relative z-10 w-full max-w-[740px] mt-4 sm:mt-6 lg:mt-8 overflow-x-clip overflow-y-visible"
          >
            <div
              className="hover-tilt-fine-only relative transition-transform duration-300 ease-out overflow-x-clip overflow-y-visible"
              style={{
                transform:
                  isFinePointer && isDesktop && !shouldReduceMotion
                    ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
                    : undefined,
              }}
            >
              <div className="aspect-[1.618/1] w-full relative overflow-x-clip overflow-y-visible">
                <ResilientImage
                  src={media.heroImageUrl}
                  alt="Eslis curved forest green velvet and walnut sofa centerpiece"
                  priority
                  className="w-full h-full object-cover object-[56%_center] mix-blend-multiply brightness-[1.08] contrast-[1.05] transition-[filter] duration-300"
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-3 text-[11px] sm:text-xs font-medium text-[#141615]/65">
                <span>{activeSwatch.label} Edition</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Handcrafted in Ruiru</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Hero Action & Metadata Bar */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-[#141615]/12 grid grid-cols-1 md:grid-cols-3 items-center gap-6 min-w-0">
          {/* Left: Primary CTA + Watch the film / motion toggle */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onShopCollection}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#141615] text-[#F7F3EB] text-xs sm:text-sm font-semibold hover:bg-[#1B3B2B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Shop the collection</span>
              <span className="w-5 h-5 rounded-full bg-[#9E3B1C] flex items-center justify-center text-[#F7F3EB]">
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>

            <button
              type="button"
              onClick={onWatchFilm}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-[#141615]/20 text-xs sm:text-sm font-medium text-[#141615] hover:bg-[#141615]/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#9E3B1C]" />
              <span>Watch the film</span>
            </button>

            <button
              type="button"
              onClick={() => setAmbientMotion((prev) => !prev)}
              aria-pressed={ambientMotion}
              title="Toggle subtle hero motion"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-medium text-[#141615]/70 hover:text-[#141615] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9E3B1C]" />
              <span>{ambientMotion ? 'Motion On' : 'Static'}</span>
            </button>
          </div>

          {/* Center: Tagline */}
          <div className="text-left md:text-center min-w-0">
            <p className="text-sm sm:text-base font-semibold tracking-tight text-[#141615]">
              {media.heroTagline}
            </p>
            <p className="text-xs text-[#141615]/65 mt-0.5">{media.heroSubTagline}</p>
          </div>

          {/* Right: Swatch selector + +5,000 handcrafted stat */}
          <div className="flex items-center md:justify-end gap-4 min-w-0">
            <div className="flex items-center gap-2" role="group" aria-label="Upholstery finishes">
              {FINISH_SWATCHES.map((swatch) => {
                const isSelected = swatch.id === activeSwatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setActiveSwatch(swatch)}
                    aria-label={`Select ${swatch.label} finish`}
                    aria-pressed={isSelected}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-[#F7F3EB] ring-[#141615] scale-110'
                        : 'hover:scale-110 opacity-85'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                );
              })}
            </div>

            <div className="h-6 w-px bg-[#141615]/15" aria-hidden="true" />

            <div className="text-right">
              <div className="text-sm font-bold text-[#141615] tabular-nums">+5,000</div>
              <div className="text-[11px] text-[#141615]/65">Homes furnished</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
