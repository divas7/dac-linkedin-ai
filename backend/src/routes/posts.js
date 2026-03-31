import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateLinkedInPost } from '../services/ai.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-dac-fallback';

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authenticate, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Enforce limits (max 3 posts per day) for resource constaint
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const postCount = await prisma.post.count({
      where: {
        userId: req.userId,
        createdAt: { gte: today }
      }
    });

    if (postCount >= 3) {
      return res.status(429).json({ error: 'Daily generation limit reached (3/3). Try again tomorrow.' });
    }

    const { theme } = req.body;
    if (!theme) return res.status(400).json({ error: 'Theme is required' });

    // Execute zero-cost local Ollama inference
    const { hook, content } = await generateLinkedInPost(theme);

    const post = await prisma.post.create({
      data: {
        userId: req.userId,
        theme,
        hook,
        content
      }
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
