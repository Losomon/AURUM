import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/cart - Get user's cart items
router.get('/', auth, async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { 
        items: {
          include: { product: { include: { category: true } } }
        }
      }
    });
    res.json(cart || { items: [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/cart/add - Add/update item
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;
    
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
    
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity },
      create: { cartId: cart.id, productId, quantity }
    });
    
    res.json({ message: 'Added to cart' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/cart/:itemId - Update quantity
router.put('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
    res.json({ message: 'Updated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/cart/:itemId - Remove item
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    await prisma.cartItem.delete({ where: { id: itemId } });
    res.json({ message: 'Removed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

