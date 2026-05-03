import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product?id=${product.id}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-4">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {!product.in_stock && (
            <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Sold Out</span>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="font-body text-[10px] tracking-widest uppercase text-primary-foreground">Featured</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            ${product.price?.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}