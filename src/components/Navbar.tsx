import React, { useState } from 'react';
import { ArrowUpRight, MapPin, Menu, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { SocialLinksConfig } from '../types/furniture';
import { FacebookGlyph, InstagramGlyph, XGlyph } from './SocialIcons';

export type ActiveRoute = 'home' | 'admin';

interface NavbarProps {
  activeRoute: ActiveRoute;
  onNavigate: (route: ActiveRoute, sectionId?: string) => void;
  bagCount: number;
  onOpenBag: () => void;
  socials: SocialLinksConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRoute,
  onNavigate,
  bagCount,
  onOpenBag,
  socials,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigateAndClose = (route: ActiveRoute, sectionId?: string) => {
    setDrawerOpen(false);
    onNavigate(route, sectionId);
  };

  const whatsappHref = `https://wa.me/${socials.whatsappNumber}?text=${encodeURIComponent(
    'Hello Eslis Furniture, I would like to inquire about a piece.'
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F7F3EB]/90 backdrop-blur-md border-b border-[#141615]/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Left: eslis wordmark */}
          <button
            type="button"
            onClick={() => navigateAndClose('home', 'hero')}
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
              onClick={() => navigateAndClose('home', 'hero')}
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
              onClick={() => navigateAndClose('home', 'collection')}
              className="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#F7F3EB]/80 hover:text-[#F7F3EB] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              COLLECTION
            </button>
            <button
              type="button"
              onClick={() => navigateAndClose('home', 'manifesto')}
              className="hidden sm:inline-flex px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#F7F3EB]/80 hover:text-[#F7F3EB] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              STUDIO
            </button>
            <button
              type="button"
              onClick={() => navigateAndClose('admin')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeRoute === 'admin'
                  ? 'bg-[#9E3B1C] text-[#F7F3EB]'
                  : 'text-[#F7F3EB]/80 hover:text-[#F7F3EB]'
              }`}
            >
              ADMIN
            </button>
          </nav>

          {/* Right: Direct WhatsApp, Menu/Social Drawer & Bag */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp Eslis Furniture on ${socials.whatsappDisplay}`}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#141615]/15 text-xs font-medium text-[#141615] hover:bg-[#141615]/5 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#1B3B2B]" />
              <span className="tabular-nums">{socials.whatsappDisplay}</span>
            </a>

            <button
              type="button"
              onClick={onOpenBag}
              aria-label={`Open shopping bag with ${bagCount} items`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1B3B2B] text-[#F7F3EB] text-xs font-semibold hover:bg-[#142D20] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="tabular-nums">Bag ({bagCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation and social channels drawer"
              className="w-9 h-9 rounded-full border border-[#141615]/15 flex items-center justify-center text-[#141615] hover:bg-[#141615]/5 transition-colors shrink-0 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Static Slide-Over Navigation & Socials Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#111211]/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Eslis Navigation and Socials"
        >
          <div className="w-full max-w-sm bg-[#F7F3EB] text-[#141615] h-full flex flex-col justify-between p-6 shadow-2xl border-l border-[#141615]/10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#141615]/10">
                <span className="text-xl font-extrabold tracking-tight lowercase">eslis</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                  className="w-9 h-9 rounded-full border border-[#141615]/15 flex items-center justify-center hover:bg-[#141615]/5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Section Links */}
              <div className="py-6 space-y-2 border-b border-[#141615]/10">
                <p className="text-xs font-semibold text-[#9E3B1C] mb-3">Navigate</p>
                {[
                  { label: 'Home Stage', route: 'home' as ActiveRoute, section: 'hero' },
                  { label: 'New Collection', route: 'home' as ActiveRoute, section: 'collection' },
                  { label: 'Craft & Manifesto', route: 'home' as ActiveRoute, section: 'manifesto' },
                  { label: 'Materials & Specs', route: 'home' as ActiveRoute, section: 'materials' },
                  { label: 'Rooms, Lived In', route: 'home' as ActiveRoute, section: 'lookbook' },
                  { label: 'Nairobi & Ruiru Showrooms', route: 'home' as ActiveRoute, section: 'showrooms' },
                  { label: 'Admin Studio', route: 'admin' as ActiveRoute, section: undefined },
                ].map((nav) => (
                  <button
                    key={nav.label}
                    type="button"
                    onClick={() => navigateAndClose(nav.route, nav.section)}
                    className="w-full flex items-center justify-between py-2.5 text-left text-base font-bold text-[#141615] hover:text-[#9E3B1C] transition-colors cursor-pointer"
                  >
                    <span>{nav.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>

              {/* Social & Direct WhatsApp */}
              <div className="py-6 space-y-3">
                <p className="text-xs font-semibold text-[#9E3B1C]">
                  Direct Contact &amp; Socials
                </p>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl bg-[#1B3B2B] text-[#F7F3EB] px-4 py-3.5 hover:bg-[#142D20] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">WhatsApp Direct</div>
                      <div className="text-xs text-[#F7F3EB]/75 tabular-nums">
                        {socials.whatsappDisplay}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <div className="space-y-2 pt-1">
                  <a
                    href={socials.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-[#EFEAE0] border border-[#141615]/10 px-3.5 py-2.5 text-xs hover:border-[#9E3B1C]/50 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2.5 font-semibold">
                      <InstagramGlyph className="w-4 h-4 text-[#9E3B1C]" />
                      <span>Instagram</span>
                    </span>
                    <span className="text-[#141615]/70">{socials.instagramHandle}</span>
                  </a>

                  <a
                    href={socials.facebookBrandUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-[#EFEAE0] border border-[#141615]/10 px-3.5 py-2.5 text-xs hover:border-[#9E3B1C]/50 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2.5 font-semibold">
                      <FacebookGlyph className="w-4 h-4 text-[#1B3B2B]" />
                      <span>Facebook (Brand)</span>
                    </span>
                    <span className="text-[#141615]/70">{socials.facebookBrandHandle}</span>
                  </a>

                  <a
                    href={socials.facebookFounderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-[#EFEAE0] border border-[#141615]/10 px-3.5 py-2.5 text-xs hover:border-[#9E3B1C]/50 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2.5 font-semibold">
                      <FacebookGlyph className="w-4 h-4 text-[#141615]" />
                      <span>Founder</span>
                    </span>
                    <span className="text-[#141615]/70">{socials.facebookFounderHandle}</span>
                  </a>

                  <a
                    href={socials.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-[#EFEAE0] border border-[#141615]/10 px-3.5 py-2.5 text-xs hover:border-[#9E3B1C]/50 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2.5 font-semibold">
                      <XGlyph className="w-3.5 h-3.5 text-[#141615]" />
                      <span>X</span>
                    </span>
                    <span className="text-[#141615]/70">{socials.xHandle}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#141615]/10 flex items-center gap-2 text-xs text-[#141615]/60">
              <MapPin className="w-3.5 h-3.5 text-[#9E3B1C] shrink-0" />
              <span>Ruiru · Northern Bypass · Eastern Bypass · Wendani</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
