import express from "express";
import Character from "../models/Character.js";

const router = express.Router();

router.post("/api/characters", async (req, res) => {
  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ error: "Telegram ID обязателен" });
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

export default router;
