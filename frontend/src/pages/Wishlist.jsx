import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2, Check } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

function WishlistCard({ item, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [moved, setMoved] = useState(false);
  const queryClient = useQueryClient();
  const { toggle } = useWishlist();

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    x.set(0); y.set(0); setHovered(false);
  };

  const moveToBagMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.CartItem.create({
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        price: item.price,
        quantity: 1,
        size: '',
        color: '',
      });
      await base44.entities.WishlistItem.delete(item.id);
    },
    onSuccess: () => {
      setMoved(true);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleRemove = () => {
    toggle({ id: item.product_id, name: item.product_name, image_url: item.product_image, price: item.price, category: item.category });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group"
      >
        {/* Image */}
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary mb-4"
          style={{
            boxShadow: hovered
              ? '0 30px 60px rgba(0,0,0,0.6), 0 0 20px rgba(200,164,94,0.12)'
              : '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <Link to={`/product?id=${item.product_id}`}>
            {item.product_image ? (
              <motion.img
                src={item.product_image}
                alt={item.product_name}
                className="w-full h-full object-cover"
                animate={{ scale: hovered ? 1.05 : 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-xs">No Image</div>
            )}
          </Link>

          {/* Shine */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Hover actions */}
          <motion.div
            className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={() => moveToBagMutation.mutate()}
              disabled={moveToBagMutation.isPending || moved}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3 rounded-full font-body text-[10px] tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-all ${
                moved ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {moved ? (
                <><Check className="w-3.5 h-3.5" /> In Bag</>
              ) : (
                <><ShoppingBag className="w-3.5 h-3.5" /> Move to Bag</>
              )}
            </motion.button>
          </motion.div>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-rose-500/30 hover:border-rose-400/40 transition-all group/rm"
          >
            <Trash2 className="w-3.5 h-3.5 text-white/50 group-hover/rm:text-rose-400 transition-colors" />
          </button>
        </div>

        {/* Info */}
        <div className="px-1 space-y-1">
          <motion.p
            className="font-body text-sm font-medium"
            animate={{ color: hovered ? 'hsl(40,60%,50%)' : 'hsl(40,20%,95%)' }}
            transition={{ duration: 0.3 }}
          >
            {item.product_name}
          </motion.p>
          <p className="font-heading text-sm text-muted-foreground">${item.price?.toFixed(2)}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative border-b border-border/30 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 font-heading text-[7rem] text-foreground/3 leading-none select-none pointer-events-none hidden lg:block">
          Wishlist
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-primary mb-3">Saved</p>
            <div className="flex items-end gap-4">
              <h1 className="font-heading text-5xl md:text-6xl">Wishlist</h1>
              {items.length > 0 && (
                <span className="font-body text-sm text-muted-foreground mb-2">{items.length} {items.length === 1 ? 'piece' : 'pieces'}</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-secondary border border-border/40 flex items-center justify-center mb-8"
              >
                <Heart className="w-8 h-8 text-muted-foreground" />
              </motion.div>
              <h2 className="font-heading text-3xl mb-3">Nothing saved yet</h2>
              <p className="font-body text-sm text-muted-foreground mb-10 max-w-xs leading-relaxed">
                Heart pieces you love while browsing. They'll appear here, waiting.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all group"
              >
                Explore Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {items.map((item, i) => (
                  <WishlistCard key={item.id} item={item} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
