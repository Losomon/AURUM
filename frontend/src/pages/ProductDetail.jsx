import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ProductScene from '../components/3d/ProductScene';
import MaterialStory from '../components/products/MaterialStory';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => base44.entities.Product.filter({ id: productId }),
    enabled: !!productId,
  });

  const product = products[0];

  const addToCartMutation = useMutation({
    mutationFn: (data) => base44.entities.CartItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
      toast.success('Added to your bag');
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCartMutation.mutate({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      price: product.price,
      size: selectedSize || '',
      color: selectedColor || '',
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-body text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="font-body text-sm text-primary hover:underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D ambient scene behind everything */}
      <ProductScene color="#c8a45e" />

      {/* Overlay gradient to keep content readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/80 to-background/40 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80 pointer-events-none z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Product Image — floating with gold glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="aspect-[3/4] rounded-2xl overflow-hidden relative"
              style={{ boxShadow: '0 0 60px rgba(200,164,94,0.2), 0 40px 80px rgba(0,0,0,0.7)' }}
            >
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">No Image</div>
              )}
              {/* Inner gold rim */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/20 pointer-events-none" />
            </div>
            {/* Glow pool */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-primary/15 blur-3xl rounded-full" />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category */}
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="font-heading text-4xl md:text-5xl leading-[1.05] mb-4">{product.name}</h1>

            {/* Price */}
            <p className="font-heading text-3xl text-primary mb-6">${product.price?.toFixed(2)}</p>

            {/* Divider */}
            <div className="w-12 h-px bg-primary/40 mb-6" />

            {/* Description */}
            {product.description && (
              <p className="font-body text-sm text-muted-foreground leading-[1.85] mb-8">{product.description}</p>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 rounded-lg font-body text-sm border transition-all duration-200",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/50 bg-secondary/50 text-foreground hover:border-primary/50 hover:bg-secondary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  Color {selectedColor && <span className="text-primary ml-2">— {selectedColor}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 rounded-full font-body text-xs border transition-all duration-200",
                        selectedColor === color
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/50 bg-secondary/50 text-foreground hover:border-primary/50"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border/50 rounded-xl overflow-hidden bg-secondary/30">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-secondary transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-body text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-secondary transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.in_stock || addToCartMutation.isPending}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full py-5 rounded-full font-body text-xs tracking-[0.3em] uppercase transition-all duration-500 flex items-center justify-center gap-3",
                added
                  ? "bg-green-600 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
                (!product.in_stock || addToCartMutation.isPending) && "opacity-60 cursor-not-allowed"
              )}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span key="check" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Added to Bag
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    {!product.in_stock ? 'Sold Out' : addToCartMutation.isPending ? 'Adding...' : 'Add to Bag'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Material Storytelling — full width below grid */}
        <div className="mt-8 max-w-2xl">
          <MaterialStory category={product.category} />
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-20">
        <TestimonialsCarousel compact />
      </div>
    </div>
  );
}