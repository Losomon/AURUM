import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

// Material details keyed to product categories
const MATERIAL_DATA = {
  tops: {
    label: '100% Mulberry Silk',
    origin: 'Woven in Como, Italy',
    details: ['Hand-finished seams', 'Pre-washed for softness', 'Dry clean recommended'],
    texture: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=85&auto=format',
    textureLabel: 'Silk Weave — 22 momme',
  },
  bottoms: {
    label: '100% Italian Wool',
    origin: 'Milled in Biella, Italy',
    details: ['130s Super wool', 'Lightly interlined', 'Dry clean only'],
    texture: 'https://images.unsplash.com/photo-1584184924103-e310d9dc82fc?w=400&q=85&auto=format',
    textureLabel: 'Fine Twill Weave',
  },
  outerwear: {
    label: 'Pure Grade-A Cashmere',
    origin: 'Sourced from Inner Mongolia',
    details: ['2-ply construction', 'Brushed finish', 'Dry clean recommended'],
    texture: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=85&auto=format',
    textureLabel: 'Cashmere — 16 micron',
  },
  dresses: {
    label: '100% Silk Chiffon',
    origin: 'Crafted in Lyon, France',
    details: ['4-weight chiffon', 'Bias-cut construction', 'Hand wash or dry clean'],
    texture: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=85&auto=format',
    textureLabel: 'Silk Chiffon Weave',
  },
  accessories: {
    label: 'Full-Grain Vegetable-Tanned Leather',
    origin: 'Tanned in Florence, Italy',
    details: ['Hand-stitched edges', 'Brass hardware', 'Develops patina over time'],
    texture: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=85&auto=format',
    textureLabel: 'Vegetable-Tanned Calf',
  },
};

const DEFAULT_MATERIAL = MATERIAL_DATA.tops;

export default function MaterialStory({ category }) {
  const [zoomed, setZoomed] = useState(false);
  const material = MATERIAL_DATA[category] || DEFAULT_MATERIAL;

  return (
    <div className="mt-12 pt-10 border-t border-border/20">
      <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-6">Crafted Details</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Texture close-up */}
        <div
          className="relative aspect-square rounded-xl overflow-hidden cursor-none group"
          data-cursor="Zoom"
          onClick={() => setZoomed(true)}
        >
          <motion.img
            src={material.texture}
            alt="Material texture"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Light sweep on hover */}
          <motion.div
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/60">{material.textureLabel}</span>
            <ZoomIn className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
          </div>
        </div>

        {/* Material details */}
        <div className="flex flex-col justify-center">
          <h3 className="font-heading text-xl mb-1">{material.label}</h3>
          <p className="font-body text-xs text-primary tracking-wider mb-5">{material.origin}</p>

          <div className="space-y-3 mb-6">
            {material.details.map((detail, i) => (
              <motion.div
                key={detail}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                <span className="font-body text-xs text-muted-foreground tracking-wide">{detail}</span>
              </motion.div>
            ))}
          </div>

          {/* Luxury quality badge */}
          <div className="inline-flex items-center gap-3 border border-primary/20 rounded-lg px-4 py-3 bg-primary/5">
            <div className="w-6 h-6 rounded-full border border-primary/40 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <div>
              <p className="font-body text-[9px] tracking-[0.3em] uppercase text-primary">AURUM Quality Standard</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Inspected & certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          >
            <motion.img
              src={material.texture}
              alt="Material close-up"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl w-full rounded-xl"
              style={{ boxShadow: '0 0 60px rgba(200,164,94,0.2)' }}
            />
            <p className="absolute bottom-8 font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Click anywhere to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}