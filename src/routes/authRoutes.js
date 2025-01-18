import express from "express";
import User from "../models/User.js";
import Character from "../models/Character.js";

const router = express.Router();

router.post("/api/auth", async (req, res) => {
  const { telegramId, username } = req.body;

  if (!telegramId || !username) {
    return res.status(400).json({ error: "Telegram ID и имя пользователя обязательны" });
  }

  try {
    let user = await User.findOne({ telegramId }).populate("characterId");

    if (!user) {
      // Создаем нового пользователя и персонажа
      const character = new Character({ telegramId, name: username });
      await character.save();

      user = new User({ telegramId, username, characterId: character._id });
      await user.save();
    }

    res.status(200).json({
      message: "Пользователь авторизован",
      user,
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
