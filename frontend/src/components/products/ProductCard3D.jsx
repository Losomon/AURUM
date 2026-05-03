import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import WishlistHeart from './WishlistHeart';

export default function ProductCard3D({ product, index = 0 }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(nx);
    y.set(ny);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <Link to={`/product?id=${product.id}`} className="block">
        <motion.div
          ref={ref}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="group cursor-pointer"
        >
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-4"
            style={{ boxShadow: hovered ? '0 30px 60px rgba(0,0,0,0.6), 0 0 20px rgba(200,164,94,0.15)' : '0 8px 24px rgba(0,0,0,0.4)' }}
          >
            {product.image_url ? (
              <motion.img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm">
                No Image
              </div>
            )}

            {/* Shine overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Gold border glow */}
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              animate={{ boxShadow: hovered ? 'inset 0 0 0 1px rgba(200,164,94,0.4)' : 'inset 0 0 0 0px transparent' }}
              transition={{ duration: 0.3 }}
            />

            {/* Wishlist heart */}
            <div className="absolute top-3 left-3">
              <WishlistHeart product={product} />
            </div>

            {product.featured && (
              <div className="absolute top-3 right-3 bg-primary/90 px-3 py-1 rounded-full">
                <span className="font-body text-[10px] tracking-widest uppercase text-primary-foreground">Featured</span>
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">Sold Out</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-1 px-1">
            <motion.h3
              className="font-body text-sm font-medium"
              animate={{ color: hovered ? 'hsl(40,60%,50%)' : 'hsl(40,20%,95%)' }}
              transition={{ duration: 0.3 }}
            >
              {product.name}
            </motion.h3>
            <p className="font-heading text-sm text-muted-foreground">${product.price?.toFixed(2)}</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}