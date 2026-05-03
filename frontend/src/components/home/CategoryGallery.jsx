import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const categories = [
  { name: 'Tops', slug: 'tops', desc: 'Silk, cotton & knit', emoji: '👗' },
  { name: 'Bottoms', slug: 'bottoms', desc: 'Tailored silhouettes', emoji: '👖' },
  { name: 'Outerwear', slug: 'outerwear', desc: 'Cashmere & wool coats', emoji: '🧥' },
  { name: 'Dresses', slug: 'dresses', desc: 'Evening & day wear', emoji: '✨' },
  { name: 'Accessories', slug: 'accessories', desc: 'Bags & fine leather', emoji: '👜' },
];

function CategoryCard({ cat, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [30 * (index % 2 === 0 ? 1 : -1), -30 * (index % 2 === 0 ? 1 : -1)]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ y }}
    >
      <Link to={`/shop?category=${cat.slug}`} className="group block">
        <div
          className="relative h-52 rounded-xl overflow-hidden border border-border/30 bg-secondary hover:border-primary/40 transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, hsl(0,0%,8%) 0%, hsl(0,0%,12%) 100%)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          {/* Gold shimmer on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Decorative gold line */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary/60 to-transparent"
            initial={{ width: '0%' }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-3xl">{cat.emoji}</span>
            <span className="font-heading text-xl text-foreground">{cat.name}</span>
            <span className="font-body text-xs text-muted-foreground tracking-wider">{cat.desc}</span>
          </div>

          {/* Corner accent */}
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/30 group-hover:border-primary/70 transition-colors" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/30 group-hover:border-primary/70 transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryGallery() {
  return (
    <section className="py-24 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-2">Browse</p>
          <h2 className="font-heading text-3xl md:text-4xl">Collections</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}