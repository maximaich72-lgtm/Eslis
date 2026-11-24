import React from 'react';
import { MapPin, ShoppingBag } from 'lucide-react';

export type ActiveRoute = 'home' | 'admin';

interface NavbarProps {
  activeRoute: ActiveRoute;
  onNavigate: (route: ActiveRoute, sectionId?: string) => void;
  bagCount: number;
  onOpenBag: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRoute,
  onNavigate,
  bagCount,
  onOpenBag,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F3EB]/90 backdrop-blur-md border-b border-[#141615]/8">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Left: eslis wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home', 'hero')}
          className="text-2xl font-extrabold tracking-tight text-[#141615] lowercase whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9E3B1C]"
        >
          eslis
        </button>

        {/* Center: Floating dark pill navigation */}
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 rounded-full bg-[#141615] text-[#F7F3EB] shadow-sm"
        >
          <button
            type="button"
            onClick={() => onNavigate('home', 'hero')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeRoute === 'home'
                ? 'bg-[#F7F3EB] text-[#141615]'
                : 'text-[#F7F3EB]/80 hover:text-[#F7F3EB]'
            }`}
          >
            HOME
          </button>
          <button
            type="button"
            onClick={() => onNavigate('home', 'collection')}
            className="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#F7F3EB]/80 hover:text-[#F7F3EB] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            COLLECTION
          </button>
          <button
            type="button"
            onClick={() => onNavigate('home', 'manifesto')}
            className="hidden sm:inline-flex px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#F7F3EB]/80 hover:text-[#F7F3EB] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            STUDIO
          </button>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeRoute === 'admin'
                ? 'bg-[#9E3B1C] text-[#F7F3EB]'
                : 'text-[#F7F3EB]/80 hover:text-[#F7F3EB]'
            }`}
          >
            ADMIN
          </button>
        </nav>

        {/* Right: Showrooms & Bag */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('home', 'showrooms')}
            aria-label="Find our Nairobi and Ruiru showrooms"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#141615]/15 text-xs font-medium text-[#141615] hover:bg-[#141615]/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#9E3B1C]" />
            <span>Showrooms</span>
          </button>
          <button
            type="button"
            onClick={onOpenBag}
            aria-label={`Open shopping bag with ${bagCount} items`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1B3B2B] text-[#F7F3EB] text-xs font-semibold hover:bg-[#142D20] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="tabular-nums">Bag ({bagCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
