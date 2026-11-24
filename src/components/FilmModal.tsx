import React, { useEffect, useState } from 'react';
import { Pause, Play, X } from 'lucide-react';
import { formatKes } from '../services/storageService';
import { FurnitureItem, SiteMediaConfig } from '../types/furniture';
import { ResilientImage } from './ResilientImage';

interface FilmModalProps {
  open: boolean;
  onClose: () => void;
  items: FurnitureItem[];
  media: SiteMediaConfig;
}

export const FilmModal: React.FC<FilmModalProps> = ({
  open,
  onClose,
  items,
  media,
}) => {
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  const frames = [
    {
      caption: '00:00 — Sculpture in Velvet & Walnut',
      sub: media.heroTagline,
      imageUrl: media.heroImageUrl,
    },
    ...items.slice(0, 4).map((item) => ({
      caption: `${item.slotNumber} — ${item.title}`,
      sub: `${formatKes(item.priceKes)} · ${item.material}`,
      imageUrl: item.imageUrl,
    })),
  ];

  useEffect(() => {
    if (!open || !playing) return;
    const timer = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frames.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [open, playing, frames.length]);

  if (!open) return null;

  const activeFrame = frames[frameIdx] || frames[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111211]/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Eslis Studio Film Reel"
    >
      <div className="w-full max-w-4xl rounded-[28px] bg-[#181A19] text-[#F7F3EB] border border-white/15 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div>
            <p className="text-xs font-semibold text-[#B84A27]">Eslis Studio Reel</p>
            <h3 className="text-base font-bold">Crafted in Ruiru · Held by Light</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium hover:bg-white/20 cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playing ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close studio reel"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/9] bg-[#111211]">
          <ResilientImage
            src={activeFrame.imageUrl}
            alt={activeFrame.caption}
            darkSurface
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111211]/90 via-[#111211]/45 to-transparent p-6">
            <p className="text-sm sm:text-lg font-bold">{activeFrame.caption}</p>
            <p className="text-xs sm:text-sm text-[#F7F3EB]/75">{activeFrame.sub}</p>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-2 overflow-x-auto bg-[#141615]">
          {frames.map((frame, idx) => (
            <button
              key={frame.caption}
              type="button"
              onClick={() => {
                setFrameIdx(idx);
                setPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                idx === frameIdx
                  ? 'bg-[#9E3B1C] text-[#F7F3EB]'
                  : 'bg-white/8 text-[#F7F3EB]/70 hover:text-[#F7F3EB]'
              }`}
            >
              {String(idx + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
