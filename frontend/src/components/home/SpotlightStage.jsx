import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SpotlightScene from '../3d/SpotlightScene';

export default function SpotlightStage({ products }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => { setDirection(1); setCurrent((c) => (c + 1) % products.length); };
  const prev = () => { setDirection(-1); setCurrent((c) => (c - 1 + products.length) % products.length); };

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [products.length]);

  if (!products.length) return null;
  const product = products[current];

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, filter: 'blur(4px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, filter: 'blur(4px)' }),
  };

  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-background flex items-center">
      {/* 3D background */}
      <SpotlightScene />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Product image — spotlight feel */}
          <div className="lg:w-1/2 flex justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={product.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="w-72 md:w-96 aspect-[3/4] rounded-2xl overflow-hidden relative"
                  style={{ boxShadow: '0 0 80px rgba(200,164,94,0.25), 0 40px 80px rgba(0,0,0,0.8)' }}
                >
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-sm">No Image</div>
                  )}
                  {/* Spotlight gradient on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                {/* Gold glow under image */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-2xl rounded-full" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Product info */}
          <div className="lg:w-1/2">
            {/* Dots indicator */}
            <div className="flex gap-2 mb-8">
              {products.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className="transition-all duration-500"
                  style={{ width: i === current ? '2rem' : '0.5rem', height: '2px', background: i === current ? 'hsl(40,60%,50%)' : 'hsl(0,0%,30%)' }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={product.id + '-info'}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">
                  {product.category} · Spotlight
                </p>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4 leading-[1.05]">
                  {product.name}
                </h2>
                <p className="font-heading text-2xl text-primary mb-6">${product.price?.toFixed(2)}</p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
                  {product.description}
                </p>
                <Link
                  to={`/product?id=${product.id}`}
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all group"
                >
                  View Piece
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Prev / Next */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center bg-background/40 backdrop-blur hover:bg-secondary transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center bg-background/40 backdrop-blur hover:bg-secondary transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}