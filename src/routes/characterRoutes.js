import express from "express";
import Character from "../models/Character.js";

const router = express.Router();

router.post('/api/character', async (req, res) => {
  const { characterId } = req.body;
  console.log('персонаж харРОут', characterId)

  if (!characterId) {
    return res.status(400).json({ error: "ID персонажа обязателен" });
  }

  try {
    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Персонаж не найден" });
    }

    res.status(200).json(character);
  } catch (error) {
    console.error("Ошибка при получении персонажа:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post('/api/characters/update', async (req, res) => {
  const { telegramId, updates } = req.body;
  if (!telegramId || !updates) {
      return res.status(400).json({ error: 'Telegram ID и изменения обязательны.' });
  }

  try {
      const character = await Character.findOneAndUpdate(
          { telegramId },
          { $set: updates },
          { new: true, runValidators: true }
      );

      if (!character) {
          return res.status(404).json({ error: 'Персонаж с таким Telegram ID не найден.' });
      }

      res.status(200).json({ message: 'Персонаж успешно обновлен.', character });
  } catch (error) {
      res.status(500).json({ error: 'Ошибка сервера при обновлении персонажа.' });
  }
});


export default router;
