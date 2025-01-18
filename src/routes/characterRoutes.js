import express from 'express';
import { authenticateToken } from "../middleware/middleware.js"; // Мидлвеар для проверки токена
import Character from '../models/Character.js';

const router = express.Router();

// Создание нового персонажа
router.post('/api/characters', async (req, res) => {
    const { telegramId, name } = req.body;

    if (!telegramId || !name) {
        return res.status(400).json({ error: 'telegramId and name are required' });
    }

    try {
        // Проверяем, существует ли пользователь с таким telegramId
        const existingCharacter = await Character.findOne({ telegramId });
        if (existingCharacter) {
            return res.status(200).json({
                message: 'Character already exists',
                character: existingCharacter,
            });
        }

        // Создаем нового персонажа
        const character = new Character({ telegramId, name });

        await character.save();
        res.status(201).json({ message: 'Character created successfully', character });
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Получение информации о персонаже (защищено токеном)
router.get("/api/characters", async (req, res) => {
    console.log("Сессия в /api/characters:", req.session);
  
    if (!req.session || !req.session.telegramId) {
      return res.status(401).json({ error: "Не авторизован" });
    }
  
    const telegramId = req.session.telegramId;
  
    try {
      const character = await Character.findOne({ telegramId });
  
      if (!character) {
        return res.status(404).json({ error: "Персонаж не найден" });
      }
  
      res.status(200).json(character);
    } catch (error) {
      console.error("Ошибка при получении персонажа:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
});
  
  

export default router;
