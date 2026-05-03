import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroScene from '../components/3d/HeroScene';
import ProductCard3D from '../components/products/ProductCard3D';
import SpotlightStage from '../components/home/SpotlightStage';
import PhilosophySection from '../components/home/PhilosophySection';
import CategoryGallery from '../components/home/CategoryGallery';
import ShopTheLook from '../components/home/ShopTheLook';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import VirtualShowroom from '../components/home/VirtualShowroom';
import AIStylist from '../components/home/AIStylist';

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 8),
    initialData: [],
  });

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const spotlightProducts = featured.length >= 2 ? featured : products.slice(0, 4);
  const gridProducts = products.slice(0, 8);

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <HeroScene />

        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-body text-[10px] tracking-[0.5em] uppercase text-primary mb-5"
            >
              New Collection · 2026
            </motion.p>

            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] mb-8">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block"
              >
                Redefine
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="block text-primary italic"
              >
                Elegance
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="font-body text-base text-muted-foreground max-w-sm mb-10 leading-relaxed"
            >
              A digital showroom for those who demand nothing less than perfection. Premium clothing, timeless design.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300 group"
              >
                Explore Collection
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors border-b border-border/50 hover:border-primary/50 pb-0.5"
              >
                View All
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="font-body text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── CATEGORY GALLERY ─── */}
      <CategoryGallery />

      {/* ─── SPOTLIGHT STAGE ─── */}
      {spotlightProducts.length > 0 && (
        <div className="border-t border-border/30">
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-2">Spotlight</p>
              <h2 className="font-heading text-3xl md:text-4xl">Featured Pieces</h2>
            </motion.div>
          </div>
          <SpotlightStage products={spotlightProducts} />
        </div>
      )}

      {/* ─── PRODUCT GRID ─── */}
      <section className="py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-2">Curated</p>
              <h2 className="font-heading text-3xl md:text-4xl">The Edit</h2>
            </motion.div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors group"
            >
              All Pieces
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gridProducts.map((product, i) => (
              <ProductCard3D key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── VIRTUAL SHOWROOM ─── */}
      <VirtualShowroom />

      {/* ─── AI STYLIST ─── */}
      <AIStylist products={gridProducts} />

      {/* ─── SHOP THE LOOK ─── */}
      <ShopTheLook />

      {/* ─── TESTIMONIALS ─── */}
      <TestimonialsCarousel />

      {/* ─── PHILOSOPHY ─── */}
      <PhilosophySection />

      {/* ─── FOOTER CTA ─── */}
      <section className="py-24 border-t border-border/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Join Us</p>
            <h2 className="font-heading text-3xl md:text-5xl mb-6">Enter the Showroom</h2>
            <p className="font-body text-sm text-muted-foreground mb-10 leading-relaxed">
              Discover the full collection — from timeless essentials to statement pieces crafted for those who understand quality.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-full font-body text-xs tracking-[0.3em] uppercase hover:bg-primary/90 transition-all group"
            >
              Shop Now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}