import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Isabelle M.',
    location: 'Paris, France',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    rating: 5,
    text: "The silk drapes like liquid gold. I've worn luxury pieces my entire life, and this is a different category altogether — the weight, the hand-feel, the way it holds its shape. Extraordinary.",
    product: 'Atelier Silk Blouse',
    verified: true,
  },
  {
    id: 2,
    name: 'Christoph V.',
    location: 'Vienna, Austria',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    rating: 5,
    text: 'Received more compliments wearing this coat in a single evening than I have in years. The tailoring is impeccable — every seam intentional. AURUM understand that restraint is the highest luxury.',
    product: 'Cashmere Overcoat',
    verified: true,
  },
  {
    id: 3,
    name: 'Naomi K.',
    location: 'Tokyo, Japan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    rating: 5,
    text: "I ordered three pieces in one sitting. The packaging alone signals that something exceptional is inside. But it's the fabric that stopped me — I just held it for a moment before putting it on.",
    product: 'Linen Wide-Leg Trousers',
    verified: true,
  },
  {
    id: 4,
    name: 'Léa B.',
    location: 'Milan, Italy',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80',
    rating: 5,
    text: "Working in fashion, I'm skeptical of everything. AURUM earned genuine admiration. The construction is couture-level at a fraction of the price. These are heirloom pieces.",
    product: 'Structured Evening Dress',
    verified: true,
  },
  {
    id: 5,
    name: 'Marcus T.',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    rating: 5,
    text: "The merino is softer than anything I've felt at this price point. No pilling after six months of wear. It still looks like the day I received it. That's not common — that's craftsmanship.",
    product: 'Fine-Knit Merino Sweater',
    verified: true,
  },
];

function TiltCard({ testimonial, isActive }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e) => {
    if (!isActive) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl border border-border/40 bg-card overflow-hidden p-8 md:p-10"
      style={{
        boxShadow: isActive
          ? '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,164,94,0.15), 0 0 40px rgba(200,164,94,0.06)'
          : '0 8px 24px rgba(0,0,0,0.3)',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Quote mark */}
      <div className="absolute top-6 right-8 font-heading text-7xl text-primary/10 leading-none select-none">"</div>

      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
        ))}
      </div>

      {/* Review text */}
      <p className="font-body text-sm md:text-base text-foreground/80 leading-[1.85] mb-8 italic">
        "{testimonial.text}"
      </p>

      {/* Product tag */}
      <div className="mb-6">
        <span className="font-body text-[9px] tracking-[0.3em] uppercase text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-full">
          {testimonial.product}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-4 border-t border-border/30 pt-6">
        <div className="relative">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover ring-1 ring-primary/30"
          />
          {testimonial.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <BadgeCheck className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>
        <div>
          <p className="font-body text-sm font-medium text-foreground">{testimonial.name}</p>
          <p className="font-body text-[10px] text-muted-foreground tracking-wide">{testimonial.location}</p>
        </div>
        {testimonial.verified && (
          <span className="ml-auto font-body text-[9px] tracking-[0.2em] uppercase text-primary/60">Verified</span>
        )}
      </div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </motion.div>
  );
}

export default function TestimonialsCarousel({ compact = false }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => navigate(1), 6000);
    return () => clearInterval(timer);
  }, [current]);

  const navigate = (dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  };

  const testimonial = TESTIMONIALS[current];
  const prev = TESTIMONIALS[(current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length];
  const next = TESTIMONIALS[(current + 1) % TESTIMONIALS.length];

  return (
    <section className={`${compact ? 'py-16' : 'py-24'} border-t border-border/30`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-[10px] tracking-[0.5em] uppercase text-primary mb-3">Verified Clients</p>
          <h2 className={`font-heading ${compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'}`}>
            {compact ? 'What Clients Say' : 'Worn & Adored'}
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative flex items-center gap-4">
          {/* Prev ghost — desktop only */}
          {!compact && (
            <motion.div
              className="hidden lg:block w-1/5 flex-shrink-0 opacity-20 scale-90 pointer-events-none select-none"
              key={`prev-${prev.id}`}
            >
              <TiltCard testimonial={prev} isActive={false} />
            </motion.div>
          )}

          {/* Active card */}
          <div className="flex-1 relative" style={{ perspective: 1200 }}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={testimonial.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard testimonial={testimonial} isActive={true} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next ghost — desktop only */}
          {!compact && (
            <motion.div
              className="hidden lg:block w-1/5 flex-shrink-0 opacity-20 scale-90 pointer-events-none select-none"
              key={`next-${next.id}`}
            >
              <TiltCard testimonial={next} isActive={false} />
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-border/50 bg-secondary/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground'}`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            className="w-10 h-10 rounded-full border border-border/50 bg-secondary/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}