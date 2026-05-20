import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const transformProduct = (product) => ({
  ...product,
  image_url: product.images?.[0] || null,
});

router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    });
    res.json(products.map(transformProduct));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(transformProduct(product));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.json(transformProduct(product));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

