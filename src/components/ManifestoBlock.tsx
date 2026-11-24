import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SiteMediaConfig } from '../types/furniture';
import { ResilientImage } from './ResilientImage';

interface ManifestoBlockProps {
  media: SiteMediaConfig;
  onExploreMaterials: () => void;
}

export const ManifestoBlock: React.FC<ManifestoBlockProps> = ({
  media,
  onExploreMaterials,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="manifesto"
      className="bg-[#EFEAE0] text-[#141615] py-16 sm:py-24 border-b border-[#141615]/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.618fr] gap-6 sm:gap-8 items-stretch">
          {/* Left Side (38.2%): Featured Craft Piece & Material Subtitle */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[28px] bg-[#F7F3EB] border border-[#141615]/10 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="mb-6">
              <p className="text-xs font-medium text-[#141615]/60 mb-2">
                Featured Studio Build
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141615] mb-2">
                {media.craftSpotlightTitle}
              </h3>
              <p className="text-sm text-[#141615]/70">
                {media.craftSpotlightMaterial}
              </p>
            </div>

            <div className="aspect-[1.618/1] lg:aspect-auto lg:flex-1 min-h-[260px] w-full rounded-2xl overflow-hidden bg-[#E5DDD0]">
              <ResilientImage
                src={media.craftSpotlightImageUrl}
                alt={media.craftSpotlightTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right Side (61.8%): Sunburnt Rust Manifesto Card */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[28px] bg-[#9E3B1C] text-[#F7F3EB] p-7 sm:p-11 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#F7F3EB]/80 mb-6">
                03/ manifesto
              </p>
              <blockquote className="text-[clamp(1.75rem,3.1vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-balance">
                &ldquo;Good Kenyan furniture shouldn&rsquo;t need replacing every three years. We mill seasoned timber, tailor heavy upholstery by hand, and stand behind every joint across Ruiru, Northern Bypass, Eastern Bypass, and Kahawa Wendani.&rdquo;
              </blockquote>
            </div>

            <div className="mt-10 pt-6 border-t border-[#F7F3EB]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#F7F3EB]">
                  Eslis Ruiru Workshop &amp; Showrooms
                </p>
                <p className="text-xs text-[#F7F3EB]/80 mt-0.5">
                  Ruiru · Northern Bypass (near Venus Complex) · Eastern Bypass (near Kamakis) · Kahawa Wendani
                </p>
              </div>
              <button
                type="button"
                onClick={onExploreMaterials}
                aria-label="Explore Eslis materials and craftsmanship"
                className="w-12 h-12 rounded-full bg-[#F7F3EB] text-[#141615] flex items-center justify-center hover:scale-105 transition-transform shrink-0 cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
