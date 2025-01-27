import express from "express";
import User from "../models/User.js";
import Character from "../models/Character.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "b4a97c8f43a1b761d7f9a865fae72c8b414a3e5371b65fdf4398f56a6e8a4562";

// Эндпоинт для валидации токена
router.post("/api/validate-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { telegramId, username } = decoded;

    if (!telegramId || !username) {
      return res.status(400).json({ error: "Некорректный токен" });
    }

    console.log("Токен успешно верифицирован:", decoded);
    res.json({ data: { telegramId, username } });
  } catch (err) {
    console.error("Ошибка валидации токена:", err.message);
    res.status(401).json({ error: "Недействительный токен", message: err.message });
  }
});

// Эндпоинт для авторизации
router.post("/api/auth", async (req, res) => {
  const { telegramId, username } = req.body;

  console.log("Полученные данные в /api/auth:", { telegramId, username });

  if (!telegramId || !username) {
    return res.status(400).json({ error: "Telegram ID и имя пользователя обязательны" });
  }

  try {
    let user = await User.findOne({ telegramId }).populate("characterId");

    if (user) {
      console.log("Пользователь найден:", user);

      // Обновляем имя пользователя, если оно изменилось
      if (user.username !== username) {
        user.username = username;
        await user.save();
        console.log("Имя пользователя обновлено.");
      }

      return res.status(200).json({
        message: "Пользователь найден",
        user,
      });
    }

    // Создаём нового персонажа и пользователя
    const character = new Character({ telegramId, name: username });
    await character.save();

    user = new User({ telegramId, username, characterId: character._id });
    await user.save();

    console.log("Пользователь и персонаж созданы:", { user, character });

    res.status(201).json({
      message: "Пользователь и персонаж созданы",
      user,
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error.message || error);
    res.status(500).json({ error: "Ошибка сервера", details: error.message });
  }
});

export default router;
