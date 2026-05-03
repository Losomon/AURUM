import React from 'react';
import { motion } from 'framer-motion';

const words = ['Fashion', 'is', 'the', 'armor', 'to', 'survive', 'the', 'reality', 'of', 'everyday', 'life.'];

export default function PhilosophySection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Subtle parallax background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />

      {/* Gold line decorations */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-10"
        >
          Our Philosophy
        </motion.p>

        {/* Animated word-by-word reveal */}
        <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl italic leading-[1.15] mb-12">
          <span className="inline">&ldquo;</span>
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
          <span className="inline">&rdquo;</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-px bg-primary mx-auto mb-8 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body text-sm text-muted-foreground max-w-lg mx-auto leading-[1.9]"
        >
          Each piece in our collection is thoughtfully designed with the world's finest materials —
          ensuring lasting quality and timeless style that transcends seasons, trends, and time itself.
        </motion.p>

        {/* Decorative floating elements */}
        <motion.div
          animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-12 top-1/3 w-px h-16 bg-gradient-to-b from-transparent via-primary/40 to-transparent"
        />
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-16 bottom-1/3 w-px h-20 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        />
      </div>
    </section>
  );
}