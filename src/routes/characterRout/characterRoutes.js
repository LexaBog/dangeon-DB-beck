import express from "express";
import Character from "../../models/Character.js";
import  getCharacterWithRegen from "../../service/HealManaRegen.js";

const router = express.Router();

// временый роут для получения характера для офлайн версии
router.get("/api/character/:telegramId", async (req, res) => {
  try {
    const { telegramId } = req.params; // Извлекаем telegramId из параметров URL
    const character = await Character.findOne({ telegramId }); // Ищем персонажа по telegramId

    if (!character) {
      return res.status(404).json({ error: "Персонаж не найден" });
    }

    const updatedCharacter = await getCharacterWithRegen(character);

    res.status(200).json(updatedCharacter); // Возвращаем данные о персонаже
  } catch (error) {
    console.error("Ошибка получения персонажа:", error.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;


