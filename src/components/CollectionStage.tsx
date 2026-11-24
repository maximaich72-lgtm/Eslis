import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/defaultCatalog';
import { formatKes } from '../services/storageService';
import { FurnitureItem } from '../types/furniture';
import { ResilientImage } from './ResilientImage';

interface CollectionStageProps {
  items: FurnitureItem[];
  activeId: string;
  onSelectId: (id: string) => void;
  onAddToBag: (item: FurnitureItem) => void;
  whatsappNumber?: string;
}

export const CollectionStage: React.FC<CollectionStageProps> = ({
  items,
  activeId,
  onSelectId,
  onAddToBag,
  whatsappNumber = WHATSAPP_NUMBER,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const spotlightList = items.slice(0, 4);
  const extraItems = items.slice(4);
  const activeItem =
    items.find((item) => item.id === activeId) || spotlightList[0] || items[0];

  if (!activeItem) {
    return null;
  }

  const activeIndex = spotlightList.findIndex((item) => item.id === activeItem.id);

  const cyclePiece = (direction: 1 | -1) => {
    if (spotlightList.length === 0) return;
    const base = activeIndex === -1 ? 0 : activeIndex;
    const nextIdx = (base + direction + spotlightList.length) % spotlightList.length;
    onSelectId(spotlightList[nextIdx].id);
  };

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Eslis Furniture, I would like to order the ${activeItem.title} (${formatKes(
      activeItem.priceKes
    )}).`
  )}`;

  return (
    <section
      id="collection"
      className="w-full max-w-full overflow-x-clip bg-[#111211] text-[#F7F3EB] py-16 sm:py-24 border-b border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 w-full min-w-0">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14 min-w-0">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wider text-[#B84A27] mb-3">
              02/ fresh collection
            </p>
            <h2 className="text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold tracking-tight leading-[0.95] lowercase text-balance">
              new collection
            </h2>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4 min-w-0">
            <p className="text-sm sm:text-base text-[#F7F3EB]/70 max-w-xs min-w-0">
              Four pieces. {isDesktop ? 'Drag or click to switch them.' : 'Tap a card or arrow to switch them.'}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => cyclePiece(-1)}
                aria-label="Previous featured piece"
                className="w-10 h-10 rounded-full border border-white/15 bg-[#181A19] text-[#F7F3EB] flex items-center justify-center hover:border-[#9E3B1C] hover:bg-[#9E3B1C] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => cyclePiece(1)}
                aria-label="Next featured piece"
                className="w-10 h-10 rounded-full border border-white/15 bg-[#181A19] text-[#F7F3EB] flex items-center justify-center hover:border-[#9E3B1C] hover:bg-[#9E3B1C] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Stage: Golden-root Spotlight Left + 4 Numbered Vertical Cards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.272fr_1fr] gap-8 lg:gap-10 items-stretch min-w-0">
          {/* Left: Active Spotlight */}
          <div className="min-w-0 flex flex-col justify-between rounded-[28px] bg-[#181A19] border border-white/10 p-5 sm:p-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                drag={shouldReduceMotion || !isDesktop ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -45) cyclePiece(1);
                  else if (info.offset.x > 45) cyclePiece(-1);
                }}
                initial={
                  shouldReduceMotion
                    ? false
                    : isDesktop
                    ? { opacity: 0, x: 18 }
                    : { opacity: 0, y: 10 }
                }
                animate={isDesktop ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : isDesktop
                    ? { opacity: 0, x: -18 }
                    : { opacity: 0, y: -10 }
                }
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={`min-w-0 flex flex-col h-full justify-between ${
                  isDesktop ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
              >
                <div className="min-w-0">
                  <div className="aspect-[1.618/1] w-full rounded-2xl overflow-hidden bg-[#222523] mb-6 relative">
                    <ResilientImage
                      src={activeItem.imageUrl}
                      alt={activeItem.title}
                      darkSurface
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3.5 left-3.5 text-xs font-mono-tabular px-2.5 py-1 rounded-md bg-[#111211]/85 text-[#F7F3EB] backdrop-blur-sm">
                      {activeItem.slotNumber} / {activeItem.category}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-3 sm:gap-4 mb-3 min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F3EB] min-w-0">
                      {activeItem.title}
                    </h3>
                    <span className="text-xl sm:text-2xl font-bold text-[#F7F3EB] tabular-nums shrink-0">
                      {formatKes(activeItem.priceKes)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#F7F3EB]/65 mb-4 min-w-0">
                    <span>{activeItem.dimensions}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeItem.material}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeItem.inStock ? 'In stock & made to order' : 'Made to order (14 days)'}</span>
                  </div>

                  <p className="text-sm sm:text-base text-[#F7F3EB]/80 leading-relaxed mb-7">
                    {activeItem.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => onAddToBag(activeItem)}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-[#F7F3EB] text-[#141615] text-xs sm:text-sm font-semibold hover:bg-[#EFEAE0] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to bag</span>
                    </button>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-[#9E3B1C] text-[#F7F3EB] text-xs sm:text-sm font-semibold hover:bg-[#B84A27] transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order via WhatsApp</span>
                    </a>
                  </div>

                  {/* Quick numbered switcher */}
                  <div className="flex items-center gap-1.5" role="group" aria-label="Switch spotlight piece">
                    {spotlightList.map((entry) => {
                      const active = entry.id === activeItem.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => onSelectId(entry.id)}
                          aria-label={`Show ${entry.title}`}
                          aria-pressed={active}
                          className={`px-2.5 py-1 rounded-full text-xs font-mono-tabular transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#F7F3EB] text-[#141615] font-bold'
                              : 'text-[#F7F3EB]/55 hover:text-[#F7F3EB]'
                          }`}
                        >
                          {entry.slotNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: 4 Numbered Vertical Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
            {spotlightList.map((item) => {
              const isSelected = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectId(item.id)}
                  aria-pressed={isSelected}
                  className={`relative min-w-0 group text-left rounded-[24px] p-4 flex flex-col justify-between transition-colors duration-200 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B3B2B] border-[#F7F3EB]/45 shadow-lg'
                      : 'bg-[#181A19] border-white/10 hover:border-white/25 hover:bg-[#1E201F]'
                  }`}
                >
                  {isSelected && !shouldReduceMotion && (
                    <motion.span
                      layoutId="collection-active-ring"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className="pointer-events-none absolute inset-0 rounded-[24px] ring-2 ring-[#B84A27]/80"
                    />
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-mono-tabular font-medium ${
                          isSelected ? 'text-[#F7F3EB]' : 'text-[#F7F3EB]/55'
                        }`}
                      >
                        {item.slotNumber}
                      </span>
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#9E3B1C] text-[#F7F3EB]'
                            : 'bg-white/10 text-[#F7F3EB] group-hover:bg-[#9E3B1C]'
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#222523] mb-4">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.title}
                        darkSurface
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#F7F3EB]/60 mb-1">
                      {item.category} · {item.inStock ? 'Available' : 'Custom'}
                    </div>
                    <h3 className="text-base font-bold text-[#F7F3EB] leading-snug mb-1.5">
                      {item.title}
                    </h3>
                    <div className="text-sm font-semibold text-[#F7F3EB]/90 tabular-nums">
                      {formatKes(item.priceKes)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Catalog Items Added via Admin */}
        {extraItems.length > 0 && (
          <div className="mt-14 pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#F7F3EB]">
                More from the Eslis Workshop
              </h3>
              <span className="text-xs text-[#F7F3EB]/60 tabular-nums">
                {extraItems.length} additional {extraItems.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {extraItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#181A19] border border-white/10 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#222523] mb-3.5">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.title}
                        darkSurface
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs text-[#F7F3EB]/60 mb-1">
                      {item.category} · {item.inStock ? 'In stock' : 'Made to order'}
                    </div>
                    <h4 className="text-base font-bold text-[#F7F3EB] mb-1">{item.title}</h4>
                    <div className="text-sm font-semibold text-[#F7F3EB]/90 tabular-nums mb-4">
                      {formatKes(item.priceKes)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectId(item.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-white/15 text-xs font-medium text-[#F7F3EB] hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToBag(item)}
                      className="inline-flex items-center justify-center px-3.5 py-2 rounded-full bg-[#9E3B1C] text-[#F7F3EB] text-xs font-semibold hover:bg-[#B84A27] transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
