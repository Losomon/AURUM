import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/wishlist - Get user's wishlist items
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user.id },
      include: { 
        items: {
          include: { product: { include: { category: true } } }
        }
      }
    });
    res.json(wishlist || { items: [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/wishlist/add - Add/remove toggle for product
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }
    
    const existing = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } }
    });
    
    if (existing) {
      // Remove
      await prisma.wishlistItem.delete({
        where: { id: existing.id }
      });
      return res.json({ message: 'Removed from wishlist' });
    }
    
    // Add
    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId }
    });
    
    res.json({ message: 'Added to wishlist' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/wishlist/:itemId - Remove specific item
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    await prisma.wishlistItem.delete({ where: { id: itemId } });
    res.json({ message: 'Removed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

