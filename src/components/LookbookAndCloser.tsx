import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Phone } from 'lucide-react';
import {
  CUSTOMER_REVIEWS,
  DISPLAY_PHONE,
  ESLIS_SHOWROOMS,
  WHATSAPP_NUMBER,
} from '../data/defaultCatalog';
import { SiteMediaConfig } from '../types/furniture';
import { ResilientImage } from './ResilientImage';

interface LookbookAndCloserProps {
  media: SiteMediaConfig;
  onShopCollection: () => void;
  onOpenAdmin: () => void;
}

export const LookbookAndCloser: React.FC<LookbookAndCloserProps> = ({
  media,
  onShopCollection,
  onOpenAdmin,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [contactInput, setContactInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) return;
    setSubmitted(true);
    setContactInput('');
  };

  return (
    <>
      {/* 05/ lookbook — rooms, lived in. */}
      <section
        id="lookbook"
        className="bg-[#F7F3EB] text-[#141615] py-16 sm:py-24 border-b border-[#141615]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#9E3B1C] mb-3">
                05/ lookbook
              </p>
              <h2 className="text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold tracking-tight leading-[0.95] lowercase text-balance">
                rooms, lived in.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#141615]/70 max-w-md">
              Real Nairobi and Kiambu homes photographed after delivery—where timber, light, and daily life settle together.
            </p>
          </div>

          {/* 3-Room Photo Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {media.rooms.map((room, index) => (
              <motion.article
                key={room.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-[24px] bg-[#EFEAE0] border border-[#141615]/10 p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#141615]/60 mb-3">
                    <span className="font-mono-tabular font-medium text-[#9E3B1C]">
                      {room.label}
                    </span>
                    <span>{room.location}</span>
                  </div>
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#E5DDD0] mb-4">
                    <ResilientImage
                      src={room.imageUrl}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-[#141615] mb-1">
                    {room.title}
                  </h3>
                </div>
                <p className="text-xs text-[#141615]/65">
                  Featuring {room.featuredPiece}
                </p>
              </motion.article>
            ))}
          </div>

          {/* Customer Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl bg-[#EFEAE0]/75 border border-[#141615]/10 p-6 flex flex-col justify-between"
              >
                <p className="text-sm sm:text-base text-[#141615]/85 leading-relaxed mb-5">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-[#141615]/10">
                  <div className="text-sm font-bold text-[#141615]">{review.name}</div>
                  <div className="text-xs text-[#141615]/60">{review.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showrooms Strip */}
      <section
        id="showrooms"
        className="bg-[#EFEAE0] text-[#141615] py-14 sm:py-16 border-b border-[#141615]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#9E3B1C] mb-2">
                Visit in person
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Four Eslis Showrooms
              </h2>
            </div>
            <a
              href={`tel:+254706276318`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3B2B] hover:underline"
            >
              <Phone className="w-4 h-4" />
              <span className="tabular-nums">{DISPLAY_PHONE}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ESLIS_SHOWROOMS.map((branch) => (
              <div
                key={branch.id}
                className="rounded-2xl bg-[#F7F3EB] border border-[#141615]/10 p-5"
              >
                <div className="flex items-start gap-2.5 mb-2">
                  <MapPin className="w-4 h-4 text-[#9E3B1C] shrink-0 mt-0.5" />
                  <h3 className="text-sm font-bold text-[#141615]">{branch.name}</h3>
                </div>
                <p className="text-xs text-[#141615]/75 mb-3">{branch.landmark}</p>
                <p className="text-[11px] text-[#141615]/55 tabular-nums">{branch.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bring it home. Closer + Footer */}
      <footer className="bg-[#111211] text-[#F7F3EB] pt-16 sm:pt-24 pb-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-10 pb-14 border-b border-white/10">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#B84A27] mb-3">
                06/ commission &amp; delivery
              </p>
              <h2 className="text-[clamp(2.75rem,6vw,5.25rem)] font-extrabold tracking-tight leading-[0.94] lowercase mb-6 text-balance">
                bring it home.
              </h2>
              <p className="text-sm sm:text-base text-[#F7F3EB]/75 max-w-lg mb-8">
                Visit any Eslis Furniture showroom or message our workshop directly for custom fabric swatches, exact room sizing, and Nairobi-wide delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onShopCollection}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#F7F3EB] text-[#141615] text-sm font-semibold hover:bg-[#EFEAE0] transition-colors cursor-pointer"
                >
                  <span>Browse collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    'Hello Eslis Furniture, I would like to inquire about custom furniture.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1B3B2B] text-[#F7F3EB] text-sm font-semibold hover:bg-[#234C38] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="tabular-nums">WhatsApp {DISPLAY_PHONE}</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <div className="rounded-[24px] bg-[#181A19] border border-white/10 p-6 sm:p-7">
                <h3 className="text-base font-bold text-[#F7F3EB] mb-1.5">
                  Request swatches or a custom quote
                </h3>
                <p className="text-xs text-[#F7F3EB]/65 mb-4">
                  Enter your email or phone number and a Ruiru workshop specialist will reach out.
                </p>

                {submitted ? (
                  <div className="flex items-center gap-2.5 rounded-xl bg-[#1B3B2B]/60 border border-[#F7F3EB]/15 px-4 py-3 text-sm text-[#F7F3EB]">
                    <CheckCircle2 className="w-4 h-4 text-[#B84A27] shrink-0" />
                    <span>Inquiry received. We will contact you shortly.</span>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="flex flex-col sm:flex-row gap-2.5">
                    <label htmlFor="eslis-inquiry-input" className="sr-only">
                      Email or phone number
                    </label>
                    <input
                      id="eslis-inquiry-input"
                      type="text"
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      placeholder="Email or phone (e.g. 0706...)"
                      className="flex-1 px-4 py-3 rounded-full bg-[#111211] border border-white/15 text-sm text-[#F7F3EB] placeholder:text-[#F7F3EB]/40 focus:outline-none focus:border-[#9E3B1C]"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-full bg-[#9E3B1C] text-[#F7F3EB] text-sm font-semibold hover:bg-[#B84A27] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Send inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Quiet Footer Bottom */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F3EB]/55">
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-[#F7F3EB] lowercase">eslis</span>
              <span>·</span>
              <span>Eslis Furniture Kenya</span>
            </div>
            <div className="flex items-center gap-5">
              <span>© {new Date().getFullYear()} Eslis Furniture</span>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[#F7F3EB]/75 hover:text-[#F7F3EB] underline underline-offset-4 cursor-pointer"
              >
                Admin Studio
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
