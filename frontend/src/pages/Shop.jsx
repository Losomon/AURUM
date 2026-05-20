import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import ProductCard3D from '../components/products/ProductCard3D';
import CategoryFilter from '../components/products/CategoryFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Cashmere Overcoat', price: 1295, image_url: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&q=85&auto=format', category: 'outerwear' },
  { id: '2', name: 'Noir Evening Dress', price: 895, image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=85&auto=format', category: 'dresses' },
  { id: '3', name: 'Merino Knit Pullover', price: 425, image_url: 'https://images.unsplash.com/photo-1576566583005-7ac1b0d3d7e1?w=600&q=85&auto=format', category: 'tops' },
  { id: '4', name: 'Linen Wide-Leg Pants', price: 375, image_url: 'https://images.unsplash.com/photo-1594633312536-3f5e57a3a5c7?w=600&q=85&auto=format', category: 'bottoms' },
  { id: '5', name: 'Silk Drape Blouse', price: 295, image_url: 'https://images.unsplash.com/photo-1564568193198-8bd5862ae5b7?w=600&q=85&auto=format', category: 'tops' },
  { id: '6', name: 'Tailored Wool Trousers', price: 450, image_url: 'https://images.unsplash.com/photo-1583743814966-843287200372?w=600&q=85&auto=format', category: 'bottoms' },
  { id: '7', name: 'Double-Breasted Blazer', price: 695, image_url: 'https://images.unsplash.com/photo-1529376625391-2be9a2e0f6b9?w=600&q=85&auto=format', category: 'outerwear' },
  { id: '8', name: 'Cropped Leather Jacket', price: 795, image_url: 'https://images.unsplash.com/photo-1551024601-bec79cee3d53?w=600&q=85&auto=format', category: 'outerwear' },
];

export default function Shop() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';

  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date', 100),
    initialData: MOCK_PRODUCTS,
  });

  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS;

  const filteredProducts = useMemo(() => {
    let filtered = category === 'all' ? displayProducts : displayProducts.filter((p) => p.category === category);
    if (sortBy === 'price_low') filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === 'price_high') filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    return filtered;
  }, [displayProducts, category, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border/30 py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent pointer-events-none" />
        {/* Decorative gold lines */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-primary mb-3">Collection</p>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl">
              {category === 'all' ? 'All Pieces' : category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-3">
              {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-12"
        >
          <CategoryFilter active={category} onChange={setCategory} />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-secondary border-border font-body text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-secondary rounded-lg mb-4" />
                <div className="h-3 bg-secondary rounded w-2/3 mb-2" />
                <div className="h-3 bg-secondary rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-body text-muted-foreground text-sm tracking-wide">No pieces found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard3D key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}