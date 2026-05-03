import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const ROOMS = [
  {
    id: 'entrance',
    name: 'Grand Entrance',
    label: 'Lobby',
    description: 'The first impression. Where restraint meets grandeur — a curated gateway to the collection.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90&auto=format',
    category: null,
    hotspots: [
      { x: 30, y: 55, label: 'Outerwear', category: 'outerwear' },
      { x: 70, y: 60, label: 'Dresses', category: 'dresses' },
    ],
  },
  {
    id: 'atelier',
    name: 'The Atelier',
    label: 'Craftsmanship',
    description: 'Where each piece begins its journey. Stone floors, natural light, and the quiet hum of intention.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=90&auto=format',
    category: 'tops',
    hotspots: [
      { x: 20, y: 50, label: 'Silk Tops', category: 'tops' },
      { x: 65, y: 45, label: 'Accessories', category: 'accessories' },
    ],
  },
  {
    id: 'gallery',
    name: 'The Gallery',
    label: 'Collections',
    description: 'Editorial depth. Our seasonal pieces displayed like works of art — because they are.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=90&auto=format',
    category: 'dresses',
    hotspots: [
      { x: 25, y: 65, label: 'Evening Dresses', category: 'dresses' },
      { x: 72, y: 55, label: 'Tailored Bottoms', category: 'bottoms' },
    ],
  },
  {
    id: 'wardrobe',
    name: 'Private Wardrobe',
    label: 'Essentials',
    description: 'The inner sanctum. Foundational pieces that anchor every wardrobe — selected with precision.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90&auto=format',
    category: 'bottoms',
    hotspots: [
      { x: 35, y: 60, label: 'Outerwear', category: 'outerwear' },
      { x: 68, y: 50, label: 'Bottoms', category: 'bottoms' },
    ],
  },
];

function Hotspot({ spot, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Link to={`/shop?category=${spot.category}`}>
            <motion.div
              className="relative cursor-pointer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/60"
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              {/* Dot */}
              <div className="w-4 h-4 rounded-full bg-primary/80 border-2 border-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                <MapPin className="w-2 h-2 text-primary-foreground" />
              </div>
              {/* Label */}
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, x: '-50%' }}
                    animate={{ opacity: 1, y: -8, x: '-50%' }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute bottom-full left-1/2 mb-1 whitespace-nowrap bg-background/90 backdrop-blur-sm border border-primary/30 text-foreground px-3 py-1.5 rounded-full font-body text-[9px] tracking-[0.2em] uppercase"
                  >
                    {spot.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function VirtualShowroom() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showHotspots, setShowHotspots] = useState(true);
  const room = ROOMS[current];

  const navigate = (dir) => {
    setDirection(dir);
    setShowHotspots(false);
    setTimeout(() => {
      setCurrent((c) => (c + dir + ROOMS.length) % ROOMS.length);
      setShowHotspots(true);
    }, 300);
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? '8%' : '-8%', opacity: 0, scale: 1.04 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d) => ({ x: d > 0 ? '-8%' : '8%', opacity: 0, scale: 0.97 }),
  };

  return (
    <section className="py-24 border-t border-border/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-2">Immersive</p>
            <h2 className="font-heading text-3xl md:text-4xl">Virtual Showroom</h2>
          </div>
          <p className="hidden md:block font-body text-xs text-muted-foreground">Click hotspots to explore</p>
        </motion.div>

        {/* Showroom viewer */}
        <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={room.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
              {/* Light sweep on enter */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none"
              />
              {/* Hotspots */}
              {room.hotspots.map((spot) => (
                <Hotspot key={spot.label} spot={spot} visible={showHotspots} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Room info */}
          <div className="absolute bottom-0 left-0 p-8 z-10">
            <motion.p
              key={room.id + '-tag'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-body text-[9px] tracking-[0.4em] uppercase text-primary mb-1"
            >
              {room.label}
            </motion.p>
            <motion.h3
              key={room.id + '-name'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-2xl md:text-3xl text-white mb-2"
            >
              {room.name}
            </motion.h3>
            <motion.p
              key={room.id + '-desc'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-body text-xs text-white/55 max-w-xs leading-relaxed hidden md:block"
            >
              {room.description}
            </motion.p>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/40 hover:border-primary/50 transition-all z-10"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/40 hover:border-primary/50 transition-all z-10"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          {/* Room dots */}
          <div className="absolute bottom-8 right-8 flex gap-2 z-10">
            {ROOMS.map((r, i) => (
              <button
                key={r.id}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary' : 'w-2 bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>

        {/* Room strip nav */}
        <div className="grid grid-cols-4 gap-3 mt-3">
          {ROOMS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`relative overflow-hidden rounded-xl aspect-video transition-all duration-300 ${i === current ? 'ring-1 ring-primary' : 'opacity-50 hover:opacity-75'}`}
            >
              <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <span className="absolute bottom-2 left-2 font-body text-[8px] tracking-[0.2em] uppercase text-white/80">{r.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}