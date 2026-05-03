import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Cart() {
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => base44.entities.CartItem.list(),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CartItem.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CartItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed');
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Subtle header gradient */}
      <div className="border-b border-border/30 py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <Link to="/shop"
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            Continue Shopping
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl">Your Bag</h1>
          {cartItems.length > 0 && (
            <p className="font-body text-sm text-muted-foreground mt-2">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {cartItems.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-heading text-xl mb-2">Your bag is empty</p>
            <p className="font-body text-sm text-muted-foreground mb-8">Discover pieces worthy of your collection</p>
            <Link to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-colors"
            >
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -80, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    className="flex gap-5 p-4 bg-card/60 rounded-xl border border-border/30 backdrop-blur-sm hover:border-border/60 transition-colors duration-300"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                  >
                    {/* Image */}
                    <Link to={`/product?id=${item.product_id}`} className="flex-shrink-0">
                      <div className="w-20 h-28 md:w-24 md:h-32 rounded-lg overflow-hidden bg-secondary">
                        {item.product_image
                          ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
                        }
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <Link to={`/product?id=${item.product_id}`} className="font-body text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                          {item.product_name}
                        </Link>
                        <div className="flex gap-3 mt-1 flex-wrap">
                          {item.size && <span className="font-body text-[10px] tracking-wider text-muted-foreground uppercase">Size: {item.size}</span>}
                          {item.color && <span className="font-body text-[10px] tracking-wider text-muted-foreground uppercase">Color: {item.color}</span>}
                        </div>
                        <p className="font-heading text-base text-primary mt-2">${item.price?.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="inline-flex items-center border border-border/40 rounded-lg overflow-hidden">
                          <button onClick={() => updateMutation.mutate({ id: item.id, data: { quantity: Math.max(1, (item.quantity || 1) - 1) } })}
                            className="px-3 py-2 hover:bg-secondary transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-body text-xs">{item.quantity || 1}</span>
                          <button onClick={() => updateMutation.mutate({ id: item.id, data: { quantity: (item.quantity || 1) + 1 } })}
                            className="px-3 py-2 hover:bg-secondary transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Item total + delete */}
                        <div className="flex items-center gap-3">
                          <span className="font-body text-xs text-muted-foreground">
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                          <button onClick={() => deleteMutation.mutate(item.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 p-6"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
              >
                {/* Gold accent line */}
                <div className="w-full h-px bg-gradient-to-r from-primary/40 via-primary/70 to-primary/40 mb-6" />

                <h2 className="font-heading text-xl mb-6">Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body text-xs">
                    <span className="text-muted-foreground tracking-wide">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body text-xs">
                    <span className="text-muted-foreground tracking-wide">Shipping</span>
                    <span className={shipping === 0 ? 'text-primary' : ''}>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="font-body text-[10px] text-primary/70">Free shipping on orders over $200</p>
                  )}
                </div>

                <div className="pt-4 border-t border-border/30 flex justify-between items-center mb-6">
                  <span className="font-body text-xs tracking-wider uppercase text-muted-foreground">Total</span>
                  <span className="font-heading text-2xl text-primary">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => toast.success('Checkout coming soon!')}
                  className="w-full py-4 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-[0.3em] uppercase hover:bg-primary/90 transition-all duration-300"
                >
                  Proceed to Checkout
                </button>

                <p className="text-center font-body text-[10px] text-muted-foreground/60 mt-4">
                  Secure & encrypted checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}