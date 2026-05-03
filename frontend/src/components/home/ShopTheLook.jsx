import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';

// Static editorial looks — each references product categories
const LOOKS = [
  {
    id: 'midnight',
    title: 'Midnight Editorial',
    subtitle: 'Evening · Winter 2026',
    description: 'A commanding presence. Structured outerwear over fluid silk — the tension between hard and soft.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85&auto=format',
    accent: '#1a1a2e',
    pieces: ['Cashmere Overcoat', 'Noir Evening Dress'],
    categories: ['outerwear', 'dresses'],
  },
  {
    id: 'morning',
    title: 'Morning Silhouette',
    subtitle: 'Casual · Day Edit',
    description: 'Effortless refinement. Wide-leg linen, a merino knit — the art of looking undone while being perfectly composed.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=85&auto=format',
    accent: '#1e1a14',
    pieces: ['Merino Knit Pullover', 'Linen Wide-Leg Pants'],
    categories: ['tops', 'bottoms'],
  },
  {
    id: 'power',
    title: 'The Power Suit',
    subtitle: 'Business · Statement',
    description: 'Precision tailoring meets quiet authority. A silk blouse beneath tailored wool — dressed to lead.',
    image: 'https://images.unsplash.com/photo-1558171813-0c60d21a578e?w=800&q=85&auto=format',
    accent: '#121820',
    pieces: ['Silk Drape Blouse', 'Tailored Wool Trousers'],
    categories: ['tops', 'bottoms'],
  },
];

function LookCard({ look, isActive, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      data-cursor="View Look"
      className="relative cursor-none overflow-hidden rounded-2xl flex-shrink-0"
      style={{ width: isActive ? '52%' : '24%' }}
      animate={{ width: isActive ? '52%' : '24%' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <motion.img
          src={look.image}
          alt={look.title}
          className="w-full h-full object-cover"
          animate={{ scale: isActive ? 1.04 : 1.08 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Light sweep micro-cinematic */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="sweep"
              initial={{ x: '-100%', opacity: 0.6 }}
              animate={{ x: '200%', opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-body text-[9px] tracking-[0.4em] uppercase text-primary mb-2">{look.subtitle}</p>
                <h3 className="font-heading text-2xl text-white mb-3">{look.title}</h3>
                <p className="font-body text-xs text-white/60 leading-relaxed mb-5 max-w-xs">{look.description}</p>

                {/* Piece tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {look.pieces.map((piece, i) => (
                    <Link
                      key={i}
                      to={`/shop?category=${look.categories[i]}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full hover:bg-primary/30 hover:border-primary/50 transition-colors"
                    >
                      <Plus className="w-2.5 h-2.5 text-primary" />
                      <span className="font-body text-[9px] tracking-wider uppercase text-white/80">{piece}</span>
                    </Link>
                  ))}
                </div>

                <Link
                  to={`/shop?category=${look.categories[0]}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.25em] uppercase text-primary hover:text-white transition-colors group"
                >
                  Shop This Look
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="writing-vertical"
              >
                <p className="font-heading text-sm text-white/70 [writing-mode:vertical-rl] rotate-180 tracking-wider">
                  {look.title}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopTheLook() {
  const [activeLook, setActiveLook] = useState(0);

  return (
    <section className="py-24 border-t border-border/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-2">Editorial</p>
            <h2 className="font-heading text-3xl md:text-4xl">Shop the Look</h2>
          </div>
          <p className="hidden md:block font-body text-xs text-muted-foreground">Click a look to expand</p>
        </motion.div>

        {/* Accordion looks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex gap-3 h-[520px] md:h-[600px]"
        >
          {LOOKS.map((look, i) => (
            <LookCard
              key={look.id}
              look={look}
              isActive={activeLook === i}
              onClick={() => setActiveLook(i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}