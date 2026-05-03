import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/30 bg-background">
      {/* Depth fade from above */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/60 to-transparent pointer-events-none" />

      {/* Subtle gold shimmer line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-heading text-3xl text-primary mb-4 tracking-wider"
            >
              AURUM
            </motion.h3>
            <p className="font-body text-xs text-muted-foreground leading-[1.9]">
              Timeless elegance crafted for the modern individual. Premium clothing that transcends seasons.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-[9px] tracking-[0.4em] uppercase text-foreground/60 mb-5">Shop</h4>
            <div className="flex flex-col gap-3">
              {['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Accessories'].map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${cat.toLowerCase()}`}
                  className="font-body text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body text-[9px] tracking-[0.4em] uppercase text-foreground/60 mb-5">Company</h4>
            <div className="flex flex-col gap-3">
              {['About Us', 'Sustainability', 'Careers', 'Press'].map((item) => (
                <span key={item} className="font-body text-xs text-muted-foreground cursor-default">{item}</span>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body text-[9px] tracking-[0.4em] uppercase text-foreground/60 mb-5">Support</h4>
            <div className="flex flex-col gap-3">
              {['Shipping', 'Returns', 'Size Guide', 'Contact'].map((item) => (
                <span key={item} className="font-body text-xs text-muted-foreground cursor-default">{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-[10px] tracking-[0.2em] text-muted-foreground/60">
            © 2026 AURUM. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="w-1 h-1 rounded-full bg-primary"
              />
            ))}
          </div>
          <p className="font-body text-[10px] tracking-[0.2em] text-muted-foreground/40">
            Digital Luxury Showroom
          </p>
        </div>
      </div>
    </footer>
  );
}