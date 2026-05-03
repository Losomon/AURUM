import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CAMPAIGNS = [
  {
    id: 'winter-2026',
    tag: 'Campaign',
    season: 'Winter 2026',
    title: 'Into the Darkness',
    subtitle: 'When night becomes the canvas',
    description: 'The new Winter collection explores the space between shadow and form. Deep blacks, midnight navies, and the shimmer of finely woven cashmere against cold air.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85&auto=format',
    category: 'outerwear',
    size: 'large',
  },
  {
    id: 'silk-stories',
    tag: 'Material Story',
    season: 'The Fabric Series',
    title: 'On Silk',
    subtitle: 'A thousand years of refinement',
    description: 'Silk is not simply a fabric — it is memory, history, and light made tactile. We trace the journey from Suzhou looms to the final drape.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85&auto=format',
    category: 'tops',
    size: 'small',
  },
  {
    id: 'morning-ritual',
    tag: 'Style Guide',
    season: 'Day Edit',
    title: 'The Morning Ritual',
    subtitle: 'Dressed before the world begins',
    description: 'There is power in the early hours. We style four essential pieces for the woman who owns her mornings — and everything that follows.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85&auto=format',
    category: 'tops',
    size: 'small',
  },
  {
    id: 'midnight-collection',
    tag: 'Collection',
    season: 'Midnight Collection',
    title: 'After Dark',
    subtitle: 'The hours that belong only to you',
    description: 'Evening dressing redefined. Less embellishment, more intention. Our evening collection is built on restraint — and therein lies its power.',
    image: 'https://images.unsplash.com/photo-1558171813-0c60d21a578e?w=900&q=85&auto=format',
    category: 'dresses',
    size: 'medium',
  },
];

function ArticleCard({ article, index }) {
  const isLarge = article.size === 'large';
  const isMedium = article.size === 'medium';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={isLarge ? 'md:col-span-2' : ''}
    >
      <Link to={`/shop?category=${article.category}`} data-cursor="Read" className="group block cursor-none">
        <div className={`relative overflow-hidden rounded-2xl ${isLarge ? 'aspect-[16/9]' : isMedium ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
          <motion.img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Light sweep */}
          <motion.div
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 1.3 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Tag */}
          <div className="absolute top-4 left-4">
            <span className="font-body text-[9px] tracking-[0.35em] uppercase bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full">
              {article.tag}
            </span>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/80 mb-2">{article.season}</p>
            <h3 className={`font-heading text-white mb-2 ${isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
              {article.title}
            </h3>
            {isLarge && (
              <p className="font-body text-sm text-white/60 max-w-lg mb-4 leading-relaxed">{article.description}</p>
            )}
            <div className="flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase text-white/50 group-hover:text-primary transition-colors duration-300">
              Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Journal() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative border-b border-border/30 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

        {/* Decorative text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 font-heading text-[8rem] text-foreground/3 leading-none select-none pointer-events-none hidden lg:block">
          Journal
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-primary mb-3">AURUM</p>
            <h1 className="font-heading text-5xl md:text-7xl mb-4">Journal</h1>
            <p className="font-body text-sm text-muted-foreground max-w-md leading-relaxed">
              Campaigns, material stories, and style guides — the world behind the clothes.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CAMPAIGNS.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border/30 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Ready to Shop?</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-6">Enter the Collection</h2>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all group"
            >
              Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}