import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useWishlist() {
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => base44.entities.WishlistItem.list('-created_date'),
    initialData: [],
  });

  const addMutation = useMutation({
    mutationFn: (product) =>
      base44.entities.WishlistItem.create({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url || '',
        price: product.price,
        category: product.category || '',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (wishlistItemId) => base44.entities.WishlistItem.delete(wishlistItemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const isWishlisted = (productId) => items.some((i) => i.product_id === productId);

  const toggle = (product) => {
    const existing = items.find((i) => i.product_id === product.id);
    if (existing) {
      removeMutation.mutate(existing.id);
    } else {
      addMutation.mutate(product);
    }
  };

  return { items, isWishlisted, toggle };
}