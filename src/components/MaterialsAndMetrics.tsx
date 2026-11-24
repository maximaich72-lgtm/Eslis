import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { MATERIAL_CARDS } from '../data/defaultCatalog';
import { ResilientImage } from './ResilientImage';

interface CounterMetricProps {
  target: number;
  suffix?: string;
  label: string;
  sublabel: string;
}

const AnimatedMetric: React.FC<CounterMetricProps> = ({
  target,
  suffix = '',
  label,
  sublabel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? target : 0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setDisplayValue(target);
      return;
    }

    let rafId = 0;
    const duration = 1250;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="py-2"
    >
      <div className="text-[clamp(2.5rem,4.5vw,3.75rem)] font-extrabold tracking-tight text-[#F7F3EB] tabular-nums leading-none mb-2">
        {displayValue.toLocaleString('en-KE')}
        {suffix}
      </div>
      <div className="text-sm font-semibold text-[#F7F3EB]">{label}</div>
      <div className="text-xs text-[#F7F3EB]/60 mt-0.5">{sublabel}</div>
    </motion.div>
  );
};

export const MaterialsAndMetrics: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const middleCardY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const outerCardY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <section id="materials" ref={sectionRef} className="bg-[#F7F3EB] text-[#141615]">
      {/* 04/ materials */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#9E3B1C] mb-3">
              04/ materials
            </p>
            <h2 className="text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold tracking-tight leading-[0.95] lowercase text-balance">
              what it&rsquo;s made of
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#141615]/70 max-w-md">
            Every frame begins with moisture-checked timber, heavy-rub upholstery, and hand-rubbed natural finishes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {MATERIAL_CARDS.map((card, idx) => {
            const yStyle = shouldReduceMotion
              ? undefined
              : idx === 1
              ? { y: middleCardY }
              : { y: outerCardY };

            return (
              <motion.article
                key={card.id}
                style={yStyle}
                className="rounded-[24px] bg-[#EFEAE0] border border-[#141615]/10 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#E5DDD0] mb-5">
                    <ResilientImage
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-mono-tabular text-[#9E3B1C] font-medium mb-1.5">
                    {card.eyebrow}
                  </p>
                  <h3 className="text-xl font-bold tracking-tight text-[#141615] mb-2">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-[#141615]/75 leading-relaxed">
                  {card.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Dark Metrics Strip */}
      <div className="bg-[#111211] text-[#F7F3EB] py-14 sm:py-16 border-y border-white/10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <AnimatedMetric
            target={5000}
            suffix="+"
            label="Pieces Crafted"
            sublabel="Delivered across Nairobi & Kenya"
          />
          <AnimatedMetric
            target={4}
            label="Active Showrooms"
            sublabel="Ruiru, Northern & Eastern Bypass, Wendani"
          />
          <AnimatedMetric
            target={14}
            suffix=" Days"
            label="Bespoke Lead Time"
            sublabel="Built to your room dimensions"
          />
          <AnimatedMetric
            target={10}
            suffix=" Yrs"
            label="Structural Warranty"
            sublabel="Solid kiln-dried timber frames"
          />
        </div>
      </div>
    </section>
  );
};
