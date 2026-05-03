import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

export default function WishlistHeart({ product, className = '' }) {
  const { isWishlisted, toggle } = useWishlist();
  const [burst, setBurst] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wishlisted) setBurst(true);
    toggle(product);
    setTimeout(() => setBurst(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 ${
        wishlisted
          ? 'bg-rose-500/20 border-rose-500/50 hover:bg-rose-500/30'
          : 'bg-black/30 border-white/20 backdrop-blur-sm hover:border-rose-400/50 hover:bg-rose-500/10'
      } ${className}`}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <motion.div
        animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-4 h-4 transition-colors duration-300 ${wishlisted ? 'fill-rose-400 text-rose-400' : 'text-white/70'}`}
        />
      </motion.div>

      {/* Burst particles */}
      <AnimatePresence>
        {burst && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-rose-400 pointer-events-none"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i / 6) * Math.PI * 2) * 18,
                  y: Math.sin((i / 6) * Math.PI * 2) * 18,
                  opacity: 0,
                  scale: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </button>
  );
}