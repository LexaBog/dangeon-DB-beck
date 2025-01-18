import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/api/validate-token', authenticateToken, (req, res) => {
  // Возвращаем данные персонажа
  res.status(200).json({ character: req.character });
});

export default router;
