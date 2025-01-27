const express = require('express');
const generateRandomCard = require('../utils/cardGenerator');
const router = express.Router();

router.post('/generate-card', async (req, res) => {
  const { levelRange, images } = req.body;

  try {
    const card = await generateRandomCard(levelRange, images);
    res.status(201).json({ card });
  } catch (error) {
    console.error('Ошибка при генерации карты:', error);
    res.status(500).json({ error: 'Ошибка при генерации карты' });
  }
});

module.exports = router;
