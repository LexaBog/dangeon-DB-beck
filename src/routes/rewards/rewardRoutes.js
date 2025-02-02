// src/routes/rewardRoutes.js
import express from 'express';
import { completeDungeon  } from '../../service/RewardService.js';

const router = express.Router();

router.post('/api/dungeons/collectRewards', async (req, res) => {
  try {
    const { telegramId, dungeonId } = req.body;
    if (!telegramId || !dungeonId) {
      return res.status(400).json({ error: 'telegramId и dungeonId обязательны' });
    }

    const rewards = await completeDungeon (telegramId, dungeonId);
    res.status(200).json({ message: 'Награды собраны', rewards });
  } catch (error) {
    console.error("Ошибка при сборе наград:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
