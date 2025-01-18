import express from 'express'
import Character from "../models/Character.js";

const router = express.Router()

router.get("/api/characters", async (req, res) => {
    console.log("Сессия в /api/characters:", req.session);

    const telegramId = req.session?.telegramId; // Берем telegramId из сессии
  
    if (!telegramId) {
      return res.status(401).json({ error: "Не авторизован" });
    }
  
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
  
  
  


export default router